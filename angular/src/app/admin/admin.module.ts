import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { LanguagesComponent } from './languages/languages.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { EntityChangeComponent } from './audit-logs/entity-change.component';
import { TenantsComponent } from './tenants/tenants.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { EditionsComponent } from './editions/editions.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { PermissionTreeComponent } from './shared/permission-tree/permission-tree.component';
import { FeatureTreeComponent } from './shared/feature-tree/feature-tree.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { AuditLogDetailModalComponent } from './audit-logs/audit-logs-detail/audit-logs-detail-modal.component';
import { EntityChangeDetailModalComponent } from './audit-logs/entity-change-detail/entity-change-detail-modal.component';
import { AddMemberModalComponent } from './organization-units/add-member-modal.component';
import { CreateOrEditLanguageModalComponent } from './languages/create-or-edit-language-modal.component';
import { EditLanguageTextComponent } from './languages/edit-language-text.component';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { CreateEditionModalComponent } from './editions/create-edition-modal.component';
import { EditEditionModalComponent } from './editions/edit-edition-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import {TenantFeaturesModalComponent} from './tenants/tenant-features-modal.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { PermissionComboComponent } from './shared/permission-combo/permission-combo.component';
import { RoleComboComponent } from './shared/role-combo/role-combo.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree/organization-unit-tree.component';
import { EditionComboComponent } from './shared/edtion-combo/edition-combo.component';
import { InstallComponent } from './install/install.component';
import { InstallStep1Component } from './install/install-step1.component';
import { InstallStep2Component } from './install/install-step2.component';
import { InstallStep3Component } from './install/install-step3.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UtilsModule,
    AppCommonModule,
    AdminRoutingModule
  ],
  declarations: [
    UsersComponent,
    LanguagesComponent,
    OrganizationUnitsComponent,
    RolesComponent,
    AuditLogsComponent,
    EntityChangeComponent,
    TenantsComponent,
    MaintenanceComponent,
    EditionsComponent,
    HostSettingsComponent,
    TenantSettingsComponent,
    SubscriptionManagementComponent,
    LanguageTextsComponent,
    PermissionComboComponent,
    RoleComboComponent,
    CreateOrEditUserModalComponent,
    OrganizationUnitsTreeComponent,
    EditUserPermissionsModalComponent,
    PermissionTreeComponent,
    FeatureTreeComponent,
    CreateOrEditRoleModalComponent,
    AuditLogDetailModalComponent,
    EntityChangeDetailModalComponent,
    CreateOrEditUnitModalComponent,
    AddMemberModalComponent,
    CreateOrEditLanguageModalComponent,
    EditLanguageTextComponent,
    CreateTenantModalComponent,
    CreateEditionModalComponent,
    EditEditionModalComponent,
    OrganizationTreeComponent,
    OrganizationUnitMembersComponent,
    EditTenantModalComponent,
    TenantFeaturesModalComponent,
    EditionComboComponent,
    HostDashboardComponent,
    InstallComponent,
    InstallStep1Component,
    InstallStep2Component,
    InstallStep3Component
  ],
  entryComponents: [
    CreateOrEditUserModalComponent,
    EditUserPermissionsModalComponent,
    CreateOrEditRoleModalComponent,
    AuditLogDetailModalComponent,
    EntityChangeDetailModalComponent,
    CreateOrEditUnitModalComponent,
    AddMemberModalComponent,
    CreateOrEditLanguageModalComponent,
    EditLanguageTextComponent,
    CreateTenantModalComponent,
    CreateEditionModalComponent,
    EditEditionModalComponent,
    EditTenantModalComponent,
    TenantFeaturesModalComponent
  ]
})
export class AdminModule { }
