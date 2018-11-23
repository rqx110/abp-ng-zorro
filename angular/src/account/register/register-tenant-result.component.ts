import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { RegisterTenantOutput } from '@shared/service-proxies/service-proxies';
import { TenantRegistrationHelperService } from './tenant-registration-helper.service';

@Component({
    templateUrl: './register-tenant-result.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
            .result__extra {
                padding: 24px 8px;
            }
        `]
})
export class RegisterTenantResultComponent extends AppComponentBase implements OnInit {

    model: RegisterTenantOutput = new RegisterTenantOutput();
    tenantUrl: string;

    saving = false;

    constructor(
        injector: Injector,
        private _router: Router,
        private _appUrlService: AppUrlService,
        private _tenantRegistrationHelper: TenantRegistrationHelperService
    ) {
        super(injector);
    }

    ngOnInit() {
        if (!this._tenantRegistrationHelper.registrationResult) {
            this._router.navigate(['account/login']);
            return;
        }

        this.model = this._tenantRegistrationHelper.registrationResult;
        abp.multiTenancy.setTenantIdCookie(this.model.tenantId);
        this.tenantUrl = this._appUrlService.getAppRootUrlOfTenant(this.model.tenancyName);
    }
}
