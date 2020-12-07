import { Component, Injector } from '@angular/core';
import {
    NameValueDto,
    OrganizationUnitServiceProxy,
    FindOrganizationUnitUsersInput,
    UsersToOrganizationUnitInput,
    PagedResultDtoOfNameValueDto,
} from '@shared/service-proxies/service-proxies';
import {
    PagedRequestDto
} from '@shared/common/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { map as _map } from 'lodash-es';
import { ModalPagedListingComponentBase } from '@shared/common/modal-paged-listing-component-base';

@Component({
    selector: 'addMemberModal',
    templateUrl: './add-member-modal.component.html',
    styles: [],
})
export class AddMemberModalComponent extends ModalPagedListingComponentBase<NameValueDto> {

    organizationUnitId: number;
    filterText = '';
    saving = false;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
    ) {
        super(injector);
    }

    protected getDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        const input = new FindOrganizationUnitUsersInput();
        input.organizationUnitId = this.organizationUnitId;
        input.filter = this.filterText;
        input.skipCount = request.skipCount;
        input.maxResultCount = request.maxResultCount;

        this._organizationUnitService
            .findUsers(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result: PagedResultDtoOfNameValueDto) => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    addUsersToOrganizationUnit(): void {
        const selectCount = this.selectedDataItems.length;
        if (selectCount <= 0) {
            this.message.warn(this.l('SelectAUser'));
            return;
        }
        this.saving = true;
        const input = new UsersToOrganizationUnitInput();
        input.organizationUnitId = this.organizationUnitId;
        input.userIds = _map(this.selectedDataItems, selectedMember =>
            Number(selectedMember.value),
        );

        this._organizationUnitService
            .addUsersToOrganizationUnit(input)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe(() => {
                this.notify.info(this.l('SuccessfullyAdded'));

                this.success(input.userIds);
            });
    }
}
