import { ListResultDtoOfOrganizationUnitDto, OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import { Component, OnInit, EventEmitter, Output, Injector } from '@angular/core';

import { NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitServiceProxy, MoveOrganizationUnitInput } from '@shared/service-proxies/service-proxies';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CreateOrEditUnitModalComponent } from './create-or-edit-unit-modal.component';
import { ArrayService } from '@delon/util';

@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html',
    styleUrls: ['./organization-tree.component.less'],
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
        this.getTreeDataFromServer((treeData) => {
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
        return this._arrayService.arrToTreeNode(this._ouData, {
            idMapName: 'id',
            parentIdMapName: 'parentId',
            titleMapName: 'displayName',
            cb: (item) => {
                item.expanded = true;
            },
        });
    }

    openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
        if (data instanceof NzTreeNode) {
            data.isExpanded = !data.isExpanded;
        } else {
            const node = data.node;
            if (node) {
                node.isExpanded = !node.isExpanded;
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
            this.activedNode.isSelected = false;
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
                    this.l('OrganizationUnitMoveConfirmMessage', this.dragSrcNode.title, this.dragTargetNode.title),
                    this.l('AreYouSure'),
                    (isConfirmed) => {
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
                                    catchError((error) => {
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

    createContextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, node: NzTreeNode): void {
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
            .createStatic(
                CreateOrEditUnitModalComponent,
                {
                    organizationUnit: {
                        parentId: parentId,
                        parentDisplayName: _parentDisplayName,
                    },
                },
                { size: 'md' },
            )
            .subscribe((res: OrganizationUnitDto) => {
                if (res) {
                    this.unitCreated(res);
                }
            });
    }

    unitCreated(ou: OrganizationUnitDto): void {
        ou.parentId = 0;
        const newNode = this._arrayService.arrToTreeNode([ou], {
            idMapName: 'id',
            parentIdMapName: 'parentId',
            titleMapName: 'displayName',
            cb:(item)=>{
                item.expanded = true;
            }
        });
        if (this.activedNode) {
            this.activedNode.isLeaf = false;
            this.activedNode.isExpanded = true;
            this.activedNode.addChildren(newNode);
        } else {
            this._treeData = [...this._treeData, ...newNode];
        }

        this.totalUnitCount += 1;
    }

    addSubUnit() {
        const canManageOrganizationTree = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        if (!canManageOrganizationTree) {
            return;
        }
        if (this.activedNode.key) {
            this.addUnit(parseInt(this.activedNode.key));
        }
    }

    editUnit(): void {
        const canManageOrganizationTree = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        if (!canManageOrganizationTree) {
            return;
        }
        if (this.activedNode.key) {
            const ouPars = {
                id: parseInt(this.activedNode.key),
                displayName: this.activedNode.title,
            };
            this.modalHelper
                .createStatic(
                    CreateOrEditUnitModalComponent,
                    {
                        organizationUnit: ouPars,
                    },
                    { size: 'md' },
                )
                .subscribe((res: OrganizationUnitDto) => {
                    if (res) {
                        this.activedNode.title = res.displayName;
                    }
                });
        }
    }

    deleteUnit(): void {
        if (this.activedNode.key) {
            this.message.confirm(
                this.l('OrganizationUnitDeleteWarningMessage', this.activedNode.title),
                this.l('AreYouSure'),
                (isConfirmed) => {
                    if (isConfirmed) {
                        this._organizationUnitService.deleteOrganizationUnit(parseInt(this.activedNode.key, 10)).subscribe(() => {
                            this.totalUnitCount -= 1;
                            this._setActiveNodeNull()
                            this.activedNode.remove();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                    }
                },
            );
        }
    }

    membersAdded(userIds: number[]): void {
        this.incrementMemberCount(userIds.length);
    }

    memberRemoved(userIds: number[]): void {
        this.incrementMemberCount(-userIds.length);
    }

    incrementMemberCount(incrementAmount: number): void {
        this.activedNode.origin.memberCount = this.activedNode.origin.memberCount + incrementAmount;
        if (this.activedNode.origin.memberCount < 0) {
            this.activedNode.origin.memberCount = 0;
        }
    }

    rolesAdded(roleIds: number[]): void {
        this.incrementRoleCount(roleIds.length);
    }

    roleRemoved(roleIds: number[]): void {
        this.incrementRoleCount(-roleIds.length);
    }

    incrementRoleCount(incrementAmount: number): void {
        this.activedNode.origin.roleCount = this.activedNode.origin.roleCount + incrementAmount;
        if (this.activedNode.origin.roleCount < 0) {
            this.activedNode.origin.roleCount = 0;
        }
    }
}
