import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitMembersComponent } from './organization-unit-members.component';
import { OrganizationTreeComponent } from './organization-tree.component';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { OrganizationUnitRolesComponent } from './organization-unit-roles.component';

@Component({
    selector: 'app-organization-units',
    templateUrl: './organization-units.component.html',
    styles: [],
})
export class OrganizationUnitsComponent extends AppComponentBase {
    @ViewChild('ouMembers', {static: true}) ouMembers: OrganizationUnitMembersComponent;
    @ViewChild('ouRoles', {static: true}) ouRoles: OrganizationUnitRolesComponent;
    @ViewChild('ouTree', {static: true}) ouTree: OrganizationTreeComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    constructor(injector: Injector) {
        super(injector);
    }
    
    ouSelected(event: any): void {
        this.organizationUnit = event;
        this.ouMembers.organizationUnit = event;
        this.ouRoles.organizationUnit = event;
    }
}
