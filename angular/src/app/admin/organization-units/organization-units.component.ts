import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'app-organization-units',
    templateUrl: './organization-units.component.html',
    styles: [],
})
export class OrganizationUnitsComponent extends AppComponentBase
    implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() { }
}
