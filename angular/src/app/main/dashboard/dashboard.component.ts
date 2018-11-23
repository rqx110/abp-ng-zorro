import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit() {
    }
}
