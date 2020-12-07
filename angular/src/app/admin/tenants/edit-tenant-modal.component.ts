import { Component, OnInit, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { TenantEditDto, SubscribableEditionComboboxItemDto, TenantServiceProxy, CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { filter as _filter } from 'lodash-es';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    selector: 'editTenantModal',
    templateUrl: './edit-tenant-modal.component.html',
    styles: []
})
export class EditTenantModalComponent extends ModalComponentBase implements OnInit {

    saving = false;
    isUnlimited = false;
    subscriptionEndDateUtcIsValid = false;
    subscriptionEndDateUtcx: Date = this._dateTimeService.getStartOfDay().toJSDate()

    tenant: TenantEditDto = undefined;
    tenantId: number;
    currentConnectionString: string;
    editions: SubscribableEditionComboboxItemDto[] = [];
    isSubscriptionFieldsVisible = false;

    selectedEdtionId = '';

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.init();
    }

    init(): void {
        this._commonLookupService.getEditionsForCombobox(false).subscribe(editionsResult => {
            this.editions = editionsResult.items;
            let notSelectedEdition = new SubscribableEditionComboboxItemDto();
            notSelectedEdition.displayText = this.l('NotAssigned');
            notSelectedEdition.value = '';
            this.editions.unshift(notSelectedEdition);

            this._tenantService.getTenantForEdit(this.tenantId).subscribe((tenantResult) => {
                this.tenant = tenantResult;
                this.currentConnectionString = tenantResult.connectionString;
                if (this.tenant.editionId) {
                    this.selectedEdtionId = this.tenant.editionId + '';
                }
                this.isUnlimited = !this.tenant.subscriptionEndDateUtc;
                this.subscriptionEndDateUtcIsValid = this.isUnlimited || this.tenant.subscriptionEndDateUtc !== undefined;

                this.toggleSubscriptionFields();
            });
        });
    }

    subscriptionEndDateChange(e): void {
        this.subscriptionEndDateUtcIsValid = e && e.date !== false;
    }

    selectedEditionIsFree(): boolean {
        if (!this.tenant.editionId) {
            return true;
        }

        let selectedEditions = _filter(this.editions, { value: this.tenant.editionId + '' });
        if (selectedEditions.length !== 1) {
            return true;
        }

        let selectedEdition = selectedEditions[0];
        return selectedEdition.isFree;
    }

    save(): void {
        this.saving = true;
        if (this.tenant.editionId === 0) {
            this.tenant.editionId = null;
        }

        //take selected date as UTC
        if (this.isUnlimited || !this.tenant.editionId) {
            this.tenant.subscriptionEndDateUtc = null;
        } else {
            this.tenant.subscriptionEndDateUtc = this._dateTimeService.toUtcDate(this.tenant.subscriptionEndDateUtc);
        }

        this._tenantService.updateTenant(this.tenant)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();
            });
    }

    onEditionChange(): void {
        this.tenant.editionId = parseInt(this.selectedEdtionId);
        if (this.selectedEditionIsFree()) {
            this.tenant.isInTrialPeriod = false;
        }

        this.toggleSubscriptionFields();
    }

    onUnlimitedChange(): void {
        if (this.isUnlimited) {
            this.tenant.subscriptionEndDateUtc = null;
            this.subscriptionEndDateUtcIsValid = true;
        } else {

            if (!this.tenant.subscriptionEndDateUtc) {
                this.subscriptionEndDateUtcIsValid = false;
            }
        }
    }

    toggleSubscriptionFields() {
        if (this.tenant.editionId > 0) {
            this.isSubscriptionFieldsVisible = true;
        } else {
            this.isSubscriptionFieldsVisible = false;
        }
    }
}
