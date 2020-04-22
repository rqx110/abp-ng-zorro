import { AppComponentBase } from '@shared/common/app-component-base';
import { Component, Injector, OnInit } from '@angular/core';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { ProfileServiceProxy, TenantLoginInfoDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'header-user',
    template: `
    <div nz-dropdown class="alain-default__nav-item d-flex align-items-center px-sm" nzPlacement="bottomRight" [nzDropdownMenu]="userMenuTpl">
        <div class="mr-sm">
            <strong>{{shownLoginName}}</strong>
        </div>
        <nz-avatar [nzSrc]="profilePicture" nzSize="small" class="mr-sm"></nz-avatar>
    </div>
    <nz-dropdown-menu #userMenuTpl="nzDropdownMenu">
        <ul nz-menu>
            <li nz-menu-item (click)="changePassword()">
                <i nz-icon nzType="ellipsis"></i>
                {{"ChangePassword" | localize}}
            </li>
            <li nz-menu-item (click)="showLoginAttempts()">
                <i nz-icon nzType="bars"></i>
                {{"LoginAttempts" | localize}}
            </li>
            <li nz-menu-item (click)="changeProfilePicture()">
                <i nz-icon nzType="picture"></i>
                {{"ChangeProfilePicture" | localize}}
            </li>
            <li nz-menu-item (click)="changeMySettings()">
                <i nz-icon nzType="setting"></i>
                {{"MySettings" | localize}}
            </li>
            <li nz-menu-divider></li>
            <li nz-menu-item (click)="logout()">
                <i nz-icon nzType="logout"></i>
                {{'Logout' | localize}}
            </li>
        </ul>
    </nz-dropdown-menu>
  `,
})
export class HeaderUserComponent extends AppComponentBase implements OnInit {
    shownLoginNameTitle = '';
    shownLoginName = '';
    tenancyName = '';
    userName = '';

    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    tenant: TenantLoginInfoDto = new TenantLoginInfoDto();

    constructor(injector: Injector,
        private authService: AppAuthService,
        private _profileServiceProxy: ProfileServiceProxy) {
        super(injector);
    }
    ngOnInit(): void {
        this.setCurrentLoginInformations();
        this.getProfilePicture();

        this.registerToEvents();
    }
    changePassword(): void {
        this.modalHelper.createStatic(ChangePasswordModalComponent).subscribe(result => {
            if (result) {
                this.logout();
            }
        });
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });
    }

    setCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
        this.tenancyName = this.appSession.tenancyName;
        this.userName = this.appSession.user.userName;
        this.tenant = this.appSession.tenant;
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    showLoginAttempts(): void {
        this.modalHelper.create(LoginAttemptsModalComponent).subscribe(result => { });
    }

    changeMySettings(): void {
        this.modalHelper.createStatic(MySettingsModalComponent).subscribe(result => { });
    }

    changeProfilePicture(): void {
        this.modalHelper.createStatic(ChangeProfilePictureModalComponent).subscribe(_ => { });
    }

    logout(): void {
        this.authService.logout();
    }
}
