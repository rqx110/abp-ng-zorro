import { Component, OnInit, Injector } from '@angular/core';
import {
    ProfileServiceProxy,
    ChangePasswordInput,
    PasswordComplexitySetting,
} from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styles: [],
})
export class ChangePasswordModalComponent extends ModalComponentBase implements OnInit {
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    currentPassword: string;
    password: string;
    confirmPassword: string;
    saving = false;

    constructor(injector: Injector, private _profileService: ProfileServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.currentPassword = '';
        this.password = '';
        this.confirmPassword = '';

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    save(): void {
        let input = new ChangePasswordInput();
        input.currentPassword = this.currentPassword;
        input.newPassword = this.password;

        this.saving = true;
        this._profileService.changePassword(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('YourPasswordHasChangedSuccessfully'));
                this.close();
            });
    }
}
