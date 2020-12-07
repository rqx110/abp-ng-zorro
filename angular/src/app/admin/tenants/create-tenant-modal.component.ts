import { Component, OnInit, Injector } from '@angular/core';
import {
    CreateTenantInput,
    TenantServiceProxy,
    PasswordComplexitySetting,
    SubscribableEditionComboboxItemDto,
    CommonLookupServiceProxy,
    ProfileServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from 'rxjs/operators';
import { filter as _filter } from 'lodash-es';

@Component({
    selector: 'createTenantModal',
    templateUrl: './create-tenant-modal.component.html',
    styles: [],
})
export class CreateTenantModalComponent extends ModalComponentBase implements OnInit {

    saving = false;
    setRandomPassword = true;
    useHostDb = true;
    editions: SubscribableEditionComboboxItemDto[] = [];
    tenant: CreateTenantInput;
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    isUnlimited = false;
    isSubscriptionFieldsVisible = false;
    isSelectedEditionFree = false;
    tenantAdminPasswordRepeat = '';

    selectedEdtionId = '';

    constructor(injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _profileService: ProfileServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.init();

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    init(): void {
        this.tenant = new CreateTenantInput();
        this.tenant.isActive = true;
        this.tenant.shouldChangePasswordOnNextLogin = true;
        this.tenant.sendActivationEmail = true;
        this.tenant.editionId = 0;
        this.tenant.isInTrialPeriod = false;

        this._commonLookupService.getEditionsForCombobox(false)
            .subscribe((result) => {
                this.editions = result.items;

                let notAssignedItem = new SubscribableEditionComboboxItemDto();
                notAssignedItem.value = '';
                notAssignedItem.displayText = this.l('NotAssigned');

                this.editions.unshift(notAssignedItem);

                this._commonLookupService.getDefaultEditionName().subscribe((getDefaultEditionResult) => {
                    let defaultEdition = _filter(this.editions, { 'displayText': getDefaultEditionResult.name });
                    if (defaultEdition && defaultEdition[0]) {
                        this.tenant.editionId = parseInt(defaultEdition[0].value);
                        this.selectedEdtionId = this.tenant.editionId + '';
                        this.toggleSubscriptionFields();
                    }
                });
            });
    }

    selectedEditionIsFree(): boolean {
        let selectedEditions = _filter(this.editions, { 'value': this.tenant.editionId.toString() })
            .map(u => Object.assign(new SubscribableEditionComboboxItemDto(), u));

        if (selectedEditions.length !== 1) {
            this.isSelectedEditionFree = true;
        }

        let selectedEdition = selectedEditions[0];
        this.isSelectedEditionFree = selectedEdition.isFree;
        return this.isSelectedEditionFree;
    }

    subscriptionEndDateIsValid(): boolean {
        if (this.tenant.editionId <= 0) {
            return true;
        }

        if (this.isUnlimited) {
            return true;
        }

        if (!this.tenant.subscriptionEndDateUtc) {
            return false;
        }

        return this.tenant.subscriptionEndDateUtc !== undefined;
    }

    save(): void {
        this.saving = true;

        if (this.setRandomPassword) {
            this.tenant.adminPassword = null;
        }

        if (this.tenant.editionId === 0) {
            this.tenant.editionId = null;
        }

        if (this.isUnlimited || this.tenant.editionId <= 0) {
            this.tenant.subscriptionEndDateUtc = null;
        }

        this._tenantService.createTenant(this.tenant)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.tenantAdminPasswordRepeat = '';
                this.success();
            });
    }

    onEditionChange(): void {
        this.tenant.editionId = parseInt(this.selectedEdtionId);
        this.tenant.isInTrialPeriod = this.tenant.editionId > 0 && !this.selectedEditionIsFree();
        this.toggleSubscriptionFields();
    }

    toggleSubscriptionFields() {
        if (this.tenant.editionId <= 0 || this.isSelectedEditionFree) {
            this.isSubscriptionFieldsVisible = false;

            if (this.isSelectedEditionFree) {
                this.isUnlimited = true;
            } else {
                this.isUnlimited = false;
            }
        } else {
            this.isSubscriptionFieldsVisible = true;
        }
    }
}
