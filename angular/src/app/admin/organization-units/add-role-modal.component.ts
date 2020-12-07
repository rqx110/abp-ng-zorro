import { Component, Injector } from '@angular/core';
import {
    FindOrganizationUnitRolesInput,
    NameValueDto,
    OrganizationUnitServiceProxy,
    RolesToOrganizationUnitInput,
    PagedResultDtoOfNameValueDto,
} from '@shared/service-proxies/service-proxies';
import { map as _map } from 'lodash-es';

import { finalize } from 'rxjs/operators';
import { ModalPagedListingComponentBase } from '@shared/common/modal-paged-listing-component-base';
import { PagedRequestDto } from '@shared/common/paged-listing-component-base';

@Component({
    selector: 'addRoleModal',
    templateUrl: './add-role-modal.component.html',
})
export class AddRoleModalComponent extends ModalPagedListingComponentBase<NameValueDto> {
    organizationUnitId: number;
    filterText = '';
    saving = false;

    constructor(injector: Injector, private _organizationUnitService: OrganizationUnitServiceProxy) {
        super(injector);
    }

    protected getDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new FindOrganizationUnitRolesInput();
        input.organizationUnitId = this.organizationUnitId;
        input.filter = this.filterText;
        input.skipCount = request.skipCount;
        input.maxResultCount = request.maxResultCount;

        this._organizationUnitService
            .findRoles(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result: PagedResultDtoOfNameValueDto) => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    addRolesToOrganizationUnit(): void {
        const selectCount = this.selectedDataItems.length;
        if (selectCount <= 0) {
            this.message.warn(this.l('SelectARole'));
            return;
        }
        this.saving = true;
        const input = new RolesToOrganizationUnitInput();
        input.organizationUnitId = this.organizationUnitId;
        input.roleIds = _map(this.selectedDataItems, (selectedMember) => Number(selectedMember.value));

        this._organizationUnitService
            .addRolesToOrganizationUnit(input)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe(() => {
                this.notify.info(this.l('SuccessfullyAdded'));

                this.success(input.roleIds);
            });
    }
}
