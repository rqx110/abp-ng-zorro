import { Component, Injector, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SendTwoFactorAuthCodeModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { LoginService } from './login.service';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './send-two-factor-code.component.html'
})
export class SendTwoFactorCodeComponent extends AppComponentBase implements CanActivate, OnInit {
    selectedTwoFactorProvider: string;
    submitting = false;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    canActivate(): boolean {
        if (this.loginService.authenticateModel &&
            this.loginService.authenticateResult &&
            this.loginService.authenticateResult.twoFactorAuthProviders &&
            this.loginService.authenticateResult.twoFactorAuthProviders.length
        ) {
            return true;
        }

        return false;
    }

    ngOnInit(): void {
        if (!this.canActivate()) {
            this._router.navigate(['account/login']);
            return;
        }

        this.selectedTwoFactorProvider = this.loginService.authenticateResult.twoFactorAuthProviders[0];
    }

    submit(): void {
        const model = new SendTwoFactorAuthCodeModel();
        model.userId = this.loginService.authenticateResult.userId;
        model.provider = this.selectedTwoFactorProvider;

        this.submitting = true;
        this._tokenAuthService
            .sendTwoFactorAuthCode(model)
            .pipe(finalize(() => this.submitting = false))
            .subscribe(() => {
                this._router.navigate(['account/verify-code']);
            });
    }
}
