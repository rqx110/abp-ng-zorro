import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl: './host-dashboard.component.html',
    styleUrls: ['./host-dashboard.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class HostDashboardComponent extends AppComponentBase {


    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

}
