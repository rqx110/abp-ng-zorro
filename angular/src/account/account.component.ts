import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'layout-account',

    templateUrl: './account.component.html',
    styleUrls: ['./account.component.less'],
})
export class AccountComponent extends AppComponentBase {
    versionText: string;
    currentYear: number;

    links = [];

    public constructor(injector: Injector) {
        super(injector);
        this.currentYear = new Date().getFullYear();
        this.versionText =
            this.appSession.application.version +
            ' [' +
            this.appSession.application.releaseDate.format('YYYYMMDD') +
            ']';
    }

    showTenantChange(): boolean {
        return abp.multiTenancy.isEnabled;
    }
}
