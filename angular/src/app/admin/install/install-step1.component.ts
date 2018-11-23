import { Component, Injector } from '@angular/core';
import { TransferService } from './transfer.service';
import { NameValue } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'install-step1',
    templateUrl: './install-step1.component.html'
})
export class InstallStep1Component  extends AppComponentBase {
    languages: NameValue[];

    constructor(injector: Injector, public item: TransferService) {
        super(injector);
    }

    _submitForm() {
        ++this.item.step;
    }
}
