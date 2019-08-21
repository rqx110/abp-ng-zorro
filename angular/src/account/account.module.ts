import { ForgotPasswordComponent } from './passwords/forgot-password.component';
import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AccountRoutingModule } from './account-routing.module';

import { CommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';

import { AccountComponent } from './account.component';
import { TenantChangeComponent } from './shared/tenant-change.component';
import { TenantChangeModalComponent } from './shared/tenant-change-modal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { LanguageSwitchComponent } from './shared/language-switch.component';

import { LoginService } from './login/login.service';
import { ResetPasswordComponent } from './passwords/reset-password.component';
import { AccountRouteGuard } from './auth/account-route-guard';

import { OAuthModule } from 'volo-angular-oauth2-oidc';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';

import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { TenantRegistrationHelperService } from './register/tenant-registration-helper.service';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        CommonModule,
        UtilsModule,
        AccountRoutingModule,
        OAuthModule.forRoot()
    ],
    declarations: [
        AccountComponent,
        TenantChangeComponent,
        TenantChangeModalComponent,
        LoginComponent,
        RegisterComponent,
        RegisterTenantComponent,
        RegisterTenantResultComponent,
        LanguageSwitchComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponent
    ],
    entryComponents: [TenantChangeModalComponent],
    providers: [
        LoginService,
        AccountRouteGuard,
        TenantRegistrationHelperService
    ]
})
export class AccountModule { }
