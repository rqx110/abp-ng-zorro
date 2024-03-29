import { ArrayService } from '@delon/util';
import { Component, OnInit, Injector } from '@angular/core';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PermissionTreeEditModel } from '@app/admin/shared/permission-tree/permission-tree-edit.model';

@Component({
    selector: 'permission-tree',
    templateUrl: './permission-tree.component.html',
})
export class PermissionTreeComponent extends AppComponentBase implements OnInit {
    private _editData: PermissionTreeEditModel;

    checkStrictly = true;

    loading = false;

    set editData(val: PermissionTreeEditModel) {
        this._editData = val;
        this.arrToTreeNode();
    }

    filterText: string;

    _treeData: NzTreeNode[] = [];

    ngOnInit(): void {
    }

    constructor(injector: Injector, private _arrayService: ArrayService) {
        super(injector);
    }

    arrToTreeNode(): void {
        this.loading = true;
        this._treeData = this._arrayService.arrToTreeNode(
            this._editData.permissions,
            {
                idMapName: 'name',
                parentIdMapName: 'parentName',
                titleMapName: 'displayName',
                cb: (item) => { 
                    item.expanded = true;
                    item.checked = item.isLeaf == true && this._editData.grantedPermissionNames.indexOf(item.name) != -1 ? true : false;
                }
            },
        );

        setTimeout(() => {
            this.checkStrictly = false;
            this.loading = false;
        }, 500);
    }

    reload(): void {
        this.checkStrictly = true;
        this.arrToTreeNode();
        this.filterText = '';
    }

    getGrantedPermissionNames(): string[] {
        const permissionNames: string[] = this._arrayService.getKeysByTreeNode(
            this._treeData,
        );
        return permissionNames;
    }

    filterTextEmptyChange() {
        if (!this.filterText) {
            this.reload();
        }
    }
}
