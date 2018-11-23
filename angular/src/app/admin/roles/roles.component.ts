import { Component, Injector } from '@angular/core';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import {
    RoleListDto,
    RoleServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { CreateOrEditRoleModalComponent } from './create-or-edit-role-modal.component';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styles: [],
})
export class RolesComponent extends PagedListingComponentBase<RoleListDto> {
    advancedFiltersVisible = false;
    selectedPermission = '';

    constructor(injector: Injector, private _roleService: RoleServiceProxy) {
        super(injector);
    }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        let permission = this.permission ? this.selectedPermission : undefined;

        this._roleService.getRoles(permission)
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
            });
    }

    protected delete(entity: RoleListDto): void {
        this._roleService.deleteRole(entity.id).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }

    createOrEdit(id?: number): void {
        this.modalHelper
            .createStatic(CreateOrEditRoleModalComponent, { roleId: id }, {size: 'md', includeTabs: true })
            .subscribe(res => {
                if (res) {
                    this.refresh();
                }
            });
    }

    batchDelete(): void {
        this.message.warn('method not implement!');
        // const selectCount = this.selectedDataItems.length;
        // if (selectCount <= 0) {
        //     abp.message.warn(this.l('SelectAnItem'));

        //     return;
        // }
        // this.message.confirm(
        //     this.l('<b class="text-red">{0}</b> items will be removed.', selectCount),
        //     this.l('AreYouSure'),
        //     res => {
        //         if (res) {
        //             let deletedIds = _.map(this.selectedDataItems, (item) => new EntityDto({ id: item.id }));
        //             this._roleService.batchDeleteRoles(deletedIds).subscribe(() => {
        //                 this.refresh();
        //                 this.notify.success(this.l('SuccessfullyDeleted'));
        //             });
        //         }
        //     },
        // );
    }
}
