import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EditionSelectDto, PasswordComplexitySetting, ProfileServiceProxy, RegisterTenantOutput, TenantRegistrationServiceProxy, SubscriptionStartType, PaymentPeriodType, SubscriptionPaymentGatewayType } from '@shared/service-proxies/service-proxies';
import { RegisterTenantModel } from './register-tenant.model';
import { TenantRegistrationHelperService } from './tenant-registration-helper.service';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './register-tenant.component.html'
})
export class RegisterTenantComponent extends AppComponentBase implements OnInit, AfterViewInit {
    model: RegisterTenantModel = new RegisterTenantModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    subscriptionStartType = SubscriptionStartType;
    paymentPeriodType = PaymentPeriodType;
    selectedPaymentPeriodType: PaymentPeriodType = PaymentPeriodType.Monthly;
    subscriptionPaymentGateway = SubscriptionPaymentGatewayType;
    paymentId = '';

    saving = false;

    constructor(
        injector: Injector,
        private _tenantRegistrationService: TenantRegistrationServiceProxy,
        private _router: Router,
        private _profileService: ProfileServiceProxy,
        private _tenantRegistrationHelper: TenantRegistrationHelperService,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit() {
        this.model.editionId = this._activatedRoute.snapshot.queryParams['editionId'];

        //Prevent to create tenant in a tenant context
        if (this.appSession.tenant != null) {
            this._router.navigate(['account/login']);
            return;
        }

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    ngAfterViewInit() {
        if (this.model.editionId) {
            this._tenantRegistrationService.getEdition(this.model.editionId)
                .subscribe((result: EditionSelectDto) => {
                    this.model.edition = result;
                });
        }
    }

    save(): void {
        this.saving = true;
        this._tenantRegistrationService.registerTenant(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: RegisterTenantOutput) => {
                this.notify.success(this.l('SuccessfullyRegistered'));

                this._tenantRegistrationHelper.registrationResult = result;
                this._router.navigate(['account/register-tenant-result']);
            });
    }
}
