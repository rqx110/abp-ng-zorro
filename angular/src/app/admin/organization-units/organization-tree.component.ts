import {
    ListResultDtoOfOrganizationUnitDto,
    OrganizationUnitDto,
} from '@shared/service-proxies/service-proxies';
import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    Injector,
} from '@angular/core';
import {
    NzTreeNode,
    NzDropdownContextComponent,
    NzContextMenuService,
    NzFormatEmitEvent,
    NzDropdownMenuComponent,
} from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    OrganizationUnitServiceProxy,
    MoveOrganizationUnitInput,
} from '@shared/service-proxies/service-proxies';
import { ArrayService } from '@delon/util';
import * as _ from 'lodash';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CreateOrEditUnitModalComponent } from './create-or-edit-unit-modal.component';

@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html',
    styleUrls: ['./organization-tree.less'],
})
export class OrganizationTreeComponent extends AppComponentBase implements OnInit {

    @Output()
    selectedChange = new EventEmitter<NzTreeNode>();

    loading = false;
    totalUnitCount = 0;
    _treeData: NzTreeNode[] = [];
    private _ouData: OrganizationUnitDto[] = [];
    activedNode: NzTreeNode;
    private dragSrcNode: NzTreeNode;
    private dragTargetNode: NzTreeNode;
    draging = false;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _nzContextMenuService: NzContextMenuService,
        private _arrayService: ArrayService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.reload();
    }

    reload(): void {
        this.getTreeDataFromServer(treeData => {
            this.totalUnitCount = this._ouData.length;
            this._treeData = treeData;
        });
    }

    private getTreeDataFromServer(callback: (ous: NzTreeNode[]) => void): void {
        this.loading = true;
        this._organizationUnitService
            .getOrganizationUnits()
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
            )
            .subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
                this._ouData = result.items;
                const treeData = this.treeDataMap();
                callback(treeData);
            });
    }

    treeDataMap(): NzTreeNode[] {
        const _treeData: NzTreeNode[] = [];
        const ouDtataParentIsNull = _.filter(
            this._ouData,
            item => (<OrganizationUnitDto>item).parentId === null,
        );
        ouDtataParentIsNull.forEach(item => {
            const treeItem = this._recursionGenerateTree(item);
            _treeData.push(treeItem);
        });
        return _treeData;
    }

    private _recursionGenerateTree(item: OrganizationUnitDto): NzTreeNode {
        const childs = _.filter(
            this._ouData,
            child => (<OrganizationUnitDto>child).parentId === item.id,
        );
        const parentOu = _.find(
            this._ouData,
            p => (<OrganizationUnitDto>p).id === item.parentId,
        );
        const _treeNode = new NzTreeNode({
            title: item.displayName,
            key: item.id.toString(),
            isLeaf: childs && childs.length <= 0,
            expanded: true,
            isMatched: true,
            code: item.code,
            memberCount: item.memberCount,
            dto: item,
            parent: parentOu,
        });
        if (childs && childs.length) {
            childs.forEach(itemChild => {
                const childItem = this._recursionGenerateTree(itemChild);
                _treeNode.children.push(childItem);
            });
        }
        return _treeNode;
    }

    openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
        if (data instanceof NzTreeNode) {
            if (!data.isExpanded) {
                data.origin.isLoading = true;
                setTimeout(() => {
                    data.isExpanded = !data.isExpanded;
                    data.origin.isLoading = false;
                }, 500);
            } else {
                data.isExpanded = !data.isExpanded;
            }
        } else {
            if (!data.node.isExpanded) {
                data.node.origin.isLoading = true;
                setTimeout(() => {
                    data.node.isExpanded = !data.node.isExpanded;
                    data.node.origin.isLoading = false;
                }, 500);
            } else {
                data.node.isExpanded = !data.node.isExpanded;
            }
        }
    }

    activeNode(data: NzFormatEmitEvent): void {
        this._setActiveNodeValue(data.node);
    }

    private _setActiveNodeValue(currentNode: NzTreeNode) {
        this._setActiveNodeNull(false);
        currentNode.isSelected = true;
        this.activedNode = currentNode;
        this.selectedChange.emit(currentNode);
    }

    private _setActiveNodeNull(isEmit: boolean = true) {
        if (this.activedNode) {
            this.activedNode = null;
            if (isEmit) {
                this.selectedChange.emit(null);
            }
        }
    }

    dragEnter(event: NzFormatEmitEvent): void {
        this.dragSrcNode = null;
        this.dragTargetNode = null;
        this.dragSrcNode = event.dragNode;
        this.dragTargetNode = event.node;
    }

    dragSaveData(event: NzFormatEmitEvent): void {
        if (this.dragSrcNode && this.dragTargetNode) {
            if (this.dragSrcNode.key !== this.dragTargetNode.key) {
                this.draging = true;
                this.message.confirm(
                    this.l(
                        'OrganizationUnitMoveConfirmMessage',
                        this.dragSrcNode.title,
                        this.dragTargetNode.title,
                    ),
                    this.l('AreYouSure'),
                    isConfirmed => {
                        if (isConfirmed) {
                            const input = new MoveOrganizationUnitInput();
                            // tslint:disable-next-line:radix
                            input.id = parseInt(this.dragSrcNode.key);
                            input.newParentId =
                                this.dragTargetNode === null
                                    ? undefined
                                    : // tslint:disable-next-line:radix
                                    parseInt(this.dragTargetNode.key);
                            this._organizationUnitService
                                .moveOrganizationUnit(input)
                                .pipe(
                                    finalize(() => {
                                        this.draging = false;
                                        this.reload();
                                    }),
                                    catchError(error => {
                                        return throwError(error);
                                    }),
                                )
                                .subscribe(() => {
                                    this.notify.success(this.l('SuccessfullyMoved'));
                                });
                        } else {
                            this.reload();
                            this.draging = false;
                        }
                    },
                );
            }
        }
    }

    createContextMenu(
        $event: MouseEvent,
        menu: NzDropdownMenuComponent,
        node: NzTreeNode,
    ): void {
        this._nzContextMenuService.create($event, menu);
        this._setActiveNodeValue(node);
    }

    addUnit(parentId?: number): void {
        if (!parentId) {
            this._setActiveNodeNull();
        }
        let _parentDisplayName = null;
        if (this.activedNode) {
            _parentDisplayName = this.activedNode.title;
        }
        this.modalHelper
            .createStatic(CreateOrEditUnitModalComponent, {
                organizationUnit: {
                    parentId: parentId,
                    parentDisplayName: _parentDisplayName,
                },
            }, { size: 'md' })
            .subscribe((res: OrganizationUnitDto) => {
                if (res) {
                    this.unitCreated(res);
                }
            });
    }

    unitCreated(ou: OrganizationUnitDto): void {
        this._ouData.push(ou);
        let childs = _.filter(
            this._ouData,
            child => (<OrganizationUnitDto>child).parentId === ou.id,
        );
        const _treeNode = new NzTreeNode({
            title: ou.displayName,
            key: ou.id.toString(),
            isLeaf: childs && childs.length <= 0,
            expanded: true,
            isMatched: true,
            code: ou.code,
            memberCount: ou.memberCount,
            dto: ou,
        });
        if (this.activedNode) {
            childs = _.filter(
                this._ouData,
                child =>
                    (<OrganizationUnitDto>child).parentId ===
                    parseInt(this.activedNode.key),
            );
            this.activedNode.isLeaf = childs && childs.length <= 0;

            this.activedNode.children.push(_treeNode);
        } else {
            this._treeData.push(_treeNode);
        }

        this.totalUnitCount += 1;
    }

    addSubUnit() {
        const canManageOrganizationTree = this.isGranted(
            'Pages.Administration.OrganizationUnits.ManageOrganizationTree',
        );
        if (!canManageOrganizationTree) {
            return;
        }
        if (this.activedNode.key) {
            this.addUnit(parseInt(this.activedNode.key));
        }
        this._nzContextMenuService.close();
    }

    editUnit(): void {
        const canManageOrganizationTree = this.isGranted(
            'Pages.Administration.OrganizationUnits.ManageOrganizationTree',
        );
        if (!canManageOrganizationTree) {
            return;
        }
        if (this.activedNode.key) {
            const ouPars = {
                id: parseInt(this.activedNode.key),
                displayName: this.activedNode.title,
            };
            this.modalHelper
                .createStatic(CreateOrEditUnitModalComponent, {
                    organizationUnit: ouPars
                }, { size: 'md' })
                .subscribe((res: OrganizationUnitDto) => {
                    if (res) {
                        this.activedNode.title = res.displayName;
                    }
                });
        }
        this._nzContextMenuService.close();
    }

    deleteUnit(): void {
        if (this.activedNode.key) {
            this.message.confirm(
                this.l('OrganizationUnitDeleteWarningMessage', this.activedNode.title),
                this.l('AreYouSure'),
                isConfirmed => {
                    if (isConfirmed) {
                        this._organizationUnitService
                            .deleteOrganizationUnit(parseInt(this.activedNode.key, 10))
                            .subscribe(() => {
                                this.totalUnitCount -= 1;
                                this.unitDeletedData();
                                this.notify.success(this.l('SuccessfullyDeleted'));
                            });
                    }
                });
        }
        this._nzContextMenuService.close();
    }

    private unitDeletedData(): void {
        _.remove(this._ouData, oRemove => {
            return oRemove.id === parseInt(this.activedNode.key);
        });
        this._treeData.forEach(item => {
            if (item.key === this.activedNode.key) {
                _.remove(this._treeData, tRemove => {
                    return tRemove.key === this.activedNode.key;
                });
                this._setActiveNodeNull();
                return;
            }
            this._unitDeletedSubData(item);
        });
    }

    private _unitDeletedSubData(item: NzTreeNode): void {
        if (item && item.children) {
            item.children.forEach(itemChild => {
                if (itemChild.key === this.activedNode.key) {
                    _.remove(item.children, remove => {
                        return remove.key === this.activedNode.key;
                    });
                    item.isLeaf = !item.children.length;
                    this._setActiveNodeNull();
                    return;
                }
                this._unitDeletedSubData(itemChild);
            });
        }
    }

    membersAdded(userIds: number[]): void {
        this.incrementMemberCount(userIds.length);
    }

    memberRemoved(userIds: number[]): void {
        this.incrementMemberCount(-userIds.length);
    }

    incrementMemberCount(incrementAmount: number): void {
        this.activedNode.origin.memberCount =
            this.activedNode.origin.memberCount + incrementAmount;
        if (this.activedNode.origin.memberCount < 0) {
            this.activedNode.origin.memberCount = 0;
        }
    }
}
