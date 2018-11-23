import { Component, Injector } from '@angular/core';
import { TransferService } from './transfer.service';
import { InstallServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'install-step2',
    templateUrl: './install-step2.component.html',
})
export class InstallStep2Component extends AppComponentBase {

    saving = false;

    constructor(
        injector: Injector,
        private _installSettingService: InstallServiceProxy,
        public item: TransferService) {
        super(injector);
    }


    _submitForm() {
        this.saving = true;
        this._installSettingService.setup(this.item.setupSettings)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                ++this.item.step;
            });
    }

    prev() {
        --this.item.step;
    }
}
