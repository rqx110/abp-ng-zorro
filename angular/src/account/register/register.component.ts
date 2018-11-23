import { AppComponentBase } from '@shared/common/app-component-base';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
    AccountServiceProxy,
    RegisterOutput,
    PasswordComplexitySetting,
    ProfileServiceProxy,
} from '@shared/service-proxies/service-proxies';

import { LoginService } from '../login/login.service';
import { finalize } from 'rxjs/operators';
import { RegisterModel } from './register.model';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent extends AppComponentBase implements OnInit {
    model: RegisterModel = new RegisterModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    saving = false;
    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private readonly _loginService: LoginService,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //Prevent to register new users in the host context
        if (this.appSession.tenant == null) {
            this._router.navigate(['account/login']);
            return;
        }

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    save(): void {
        this.saving = true;
        this._accountService.register(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: RegisterOutput) => {
                if (!result.canLogin) {
                    this.notify.success(this.l('SuccessfullyRegistered'));
                    this._router.navigate(['account/login']);
                    return;
                }

                //Autheticate
                this.saving = true;
                this._loginService.authenticateModel.userNameOrEmailAddress = this.model.userName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => { this.saving = false; });
            });
    }
}
