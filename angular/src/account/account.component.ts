import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { filter as _filter } from 'lodash-es';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    selector: 'layout-account',

    templateUrl: './account.component.html',
    styleUrls: ['./account.component.less'],
})
export class AccountComponent extends AppComponentBase {
    versionText: string;
    currentYear: number;
    tenantChangeDisabledRoutes: string[] = [
        'select-edition',
        'register-tenant',
        'session-locked'
    ];

    links = [];

    public constructor(injector: Injector, private _router: Router, private _dateTimeService: DateTimeService,) {
        super(injector);
        this.currentYear = new Date().getFullYear();
        this.versionText =
            this.appSession.application.version +
            ' [' +
            this.appSession.application.releaseDate.toFormat('yyyyLLdd') +
            ']';
    }

    showTenantChange(): boolean {
        if (!this._router.url) {
            return false;
        }

        if (_filter(this.tenantChangeDisabledRoutes, route => this._router.url.indexOf('/account/' + route) >= 0).length) {
            return false;
        }

        return abp.multiTenancy.isEnabled && !this.supportsTenancyNameInUrl();
    }

    private supportsTenancyNameInUrl() {
        return (AppConsts.appBaseUrlFormat && AppConsts.appBaseUrlFormat.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) >= 0);
    }
}
