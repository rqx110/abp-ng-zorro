import { OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import { Component, Injector } from '@angular/core';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { filter as _filter, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ArrayService } from '@delon/util';

export interface IOrganizationUnitsTreeComponentData {
    allOrganizationUnits: OrganizationUnitDto[];
    selectedOrganizationUnits: string[];
}

@Component({
    selector: 'organization-unit-tree',
    templateUrl: './organization-unit-tree.component.html',
})
export class OrganizationUnitsTreeComponent extends AppComponentBase {
    private _allOrganizationUnits: OrganizationUnitDto[] = [];
    defaultCheckedOrganizationUnits: number[] = [];
    checkStrictly = true;
    loading = false;
    set data(data: IOrganizationUnitsTreeComponentData) {
        this._allOrganizationUnits = data.allOrganizationUnits;
        this.ouCodeArrToIdArr(data.selectedOrganizationUnits);
        this.arrToTreeNode();
    }

    filterText: string;

    _treeData: NzTreeNode[] = [];

    constructor(injector: Injector, private _arrayService: ArrayService) {
        super(injector);
    }

    arrToTreeNode(): void {
        this.loading = true;
        this._treeData = this._arrayService.arrToTreeNode(
            this._allOrganizationUnits,
            {
                idMapName: 'id',
                parentIdMapName: 'parentId',
                titleMapName: 'displayName',
                cb: (item) => { item.expanded = true }
            }
        );

        setTimeout(() => {
            this.loading = false;
        }, 500);
    }

    reload(): void {
        this.arrToTreeNode();
        this.filterText = '';
    }

    getSelectedOrganizations(): number[] {
        const organizationIds: number[] = this._arrayService.getKeysByTreeNode(
            this._treeData,
        );
        return organizationIds;
    }

    ouCodeArrToIdArr(codes: string[]) {
        const filterOUs = _filter(this._allOrganizationUnits, (u: OrganizationUnitDto) => {
            return codes.indexOf(u.code) >= 0;
        },
        );
        const ids = _map(filterOUs, f => f.id);
        this.defaultCheckedOrganizationUnits = ids;
    }

    filterTextEmptyChange() {
        if (!this.filterText) {
            this.reload();
        }
    }
}
