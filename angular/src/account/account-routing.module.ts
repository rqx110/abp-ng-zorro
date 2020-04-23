import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { ForgotPasswordComponent } from './passwords/forgot-password.component';
import { ResetPasswordComponent } from './passwords/reset-password.component';
import { AccountRouteGuard } from './auth/account-route-guard';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { SessionLockScreenComponent } from './login/session-lock-screen.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: '', redirectTo: 'login' },
                    { path: 'login', component: LoginComponent, canActivate: [AccountRouteGuard] },
                    { path: 'register', component: RegisterComponent, canActivate: [AccountRouteGuard] },
                    { path: 'register-tenant', component: RegisterTenantComponent, canActivate: [AccountRouteGuard] },
                    { path: 'register-tenant-result', component: RegisterTenantResultComponent, canActivate: [AccountRouteGuard] },
                    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AccountRouteGuard] },
                    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AccountRouteGuard] },
                    { path: 'email-activation', component: EmailActivationComponent, canActivate: [AccountRouteGuard] },
                    { path: 'confirm-email', component: ConfirmEmailComponent, canActivate: [AccountRouteGuard] },
                    { path: 'send-code', component: SendTwoFactorCodeComponent, canActivate: [AccountRouteGuard] },
                    { path: 'verify-code', component: ValidateTwoFactorCodeComponent, canActivate: [AccountRouteGuard] },
                    { path: 'session-locked', component: SessionLockScreenComponent },
                    { path: '**', redirectTo: 'login' }
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AccountRoutingModule { }
