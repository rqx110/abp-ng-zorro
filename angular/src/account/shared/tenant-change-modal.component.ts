import {
    Component,
    OnInit,
    Injector,
    Input,
} from '@angular/core';
import { AccountServiceProxy, TenantAvailabilityState } from '@shared/service-proxies/service-proxies';
import { IsTenantAvailableInput } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-tenant-change-modal',
    templateUrl: './tenant-change-modal.component.html',
})
export class TenantChangeModalComponent extends ModalComponentBase
    implements OnInit {
    @Input()
    tenancyName = '';
    beforeTenancyName = '';
    saving = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.beforeTenancyName = this.tenancyName;
    }

    save(): void {
        this.saving = true;
        if (this.tenancyName === this.beforeTenancyName) {
            this.close();
            return;
        }
        if (!this.tenancyName || this.tenancyName === '') {
            abp.multiTenancy.setTenantIdCookie(undefined);
            this.close();
            location.reload();
            return;
        }

        const input = new IsTenantAvailableInput();
        input.tenancyName = this.tenancyName;

        this._accountService
            .isTenantAvailable(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(result => {
                switch (result.state) {
                    case TenantAvailabilityState.Available:
                        abp.multiTenancy.setTenantIdCookie(result.tenantId);
                        this.success();
                        location.reload();
                        return;
                    case TenantAvailabilityState.InActive:
                        this.message.warn(this.l('TenantIsNotActive', this.tenancyName));
                        break;
                    case TenantAvailabilityState.NotFound: // NotFound
                        this.message.warn(
                            this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName),
                        );
                        break;
                }
            });
    }
}
