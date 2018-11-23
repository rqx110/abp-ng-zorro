import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantChangeModalComponent } from './tenant-change-modal.component';

@Component({
    selector: 'app-tenant-change',
    templateUrl: './tenant-change.component.html',
})
export class TenantChangeComponent extends AppComponentBase implements OnInit {
    tenancyName: string;
    name: string;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.appSession.tenant) {
            this.tenancyName = this.appSession.tenant.tenancyName;
            this.name = this.appSession.tenant.name;
        }
    }

    get isMultiTenancyEnabled(): boolean {
        return abp.multiTenancy.isEnabled;
    }

    showChangeModal(): void {
        this.modalHelper.createStatic(TenantChangeModalComponent, { tenancyName: this.tenancyName }, {size: 'md'})
            .subscribe(() => { });
    }
}
