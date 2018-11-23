import { Component, Injector } from '@angular/core';
import { TransferService } from './transfer.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'install-step3',
    templateUrl: './install-step3.component.html',
})
export class InstallStep3Component extends AppComponentBase {

    constructor(injector: Injector, public item: TransferService) {
        super(injector);
    }

    _submitForm() {
        window.location.href = '/';
    }
}
