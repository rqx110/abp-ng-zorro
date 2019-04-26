import { Component, OnInit, Injector } from '@angular/core';
import {
    CurrentUserProfileEditDto,
    ProfileServiceProxy,
    SettingScopes,
    SendVerificationSmsInputDto,
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from 'rxjs/operators';
import { SmsVerificationModalComponent } from './sms-verification-modal.component';

@Component({
    selector: 'app-my-settings-modal',
    templateUrl: './my-settings-modal.component.html',
    styles: [],
})
export class MySettingsModalComponent extends ModalComponentBase implements OnInit {

    isPhoneNumberConfirmed: boolean;
    isPhoneNumberEmpty = false;
    smsEnabled: boolean;
    user: CurrentUserProfileEditDto = new CurrentUserProfileEditDto();
    showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    canChangeUserName: boolean;
    defaultTimezoneScope: SettingScopes = SettingScopes.User;
    private _initialTimezone: string = undefined;

    saving = false;
    constructor(injector: Injector, private _profileService: ProfileServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this._profileService.getCurrentUserProfileForEdit().subscribe(result => {
            this.user = result;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName === AppConsts.userManagement.defaultAdminUserName;
            this.isPhoneNumberConfirmed = result.isPhoneNumberConfirmed;
            this.isPhoneNumberEmpty = result.phoneNumber === '';
        });
    }

    smsVerify(): void {
        let input = new SendVerificationSmsInputDto();
        input.phoneNumber = this.user.phoneNumber;
        this._profileService.sendVerificationSms(input)
            .subscribe(() => {
                this.modalHelper.createStatic(SmsVerificationModalComponent)
                    .subscribe(() => { this.isPhoneNumberConfirmed = true; });
            });
    }

    save(): void {
        this.saving = true;
        this._profileService
            .updateCurrentUserProfile(this.user)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.appSession.user.name = this.user.name;
                this.appSession.user.surname = this.user.surname;
                this.appSession.user.userName = this.user.userName;
                this.appSession.user.emailAddress = this.user.emailAddress;
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();

                if (abp.clock.provider.supportsMultipleTimezone && this._initialTimezone !== this.user.timezone) {
                    this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).then(() => {
                        window.location.reload();
                    });
                }
            });
    }
}
