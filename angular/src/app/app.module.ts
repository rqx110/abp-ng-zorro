import { NgModule } from '@angular/core';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { UtilsModule } from '@shared/utils/utils.module';

import { AppCommonModule } from '@app/shared/common/app-common.module';

import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { SmsVerificationModalComponent } from '@app/shared/layout/profile/sms-verification-modal.component';

import { HeaderComponent } from '@app/shared/layout/header/header.component';
import { SidebarComponent } from '@app/shared/layout/sidebar/sidebar.component';
import { HeaderUserComponent } from '@app/shared/layout/header/components/user.component';

import { LanguageSwitchComponent } from '@app/shared/layout/header/components/language-switch.component';

import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';
import { HeaderNotificationsComponent } from './shared/layout/notifications/header-notifications.component';
import { NotificationSettingsModalComponent } from './shared/layout/notifications/notification-settings-modal.component';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';

import { SettingDrawerComponent } from '@app/shared/layout/setting-drawer/setting-drawer.component';
import { SettingDrawerItemComponent } from '@app/shared/layout/setting-drawer/setting-drawer-item.component';

import { LayoutThemeBtnComponent } from './shared/layout/theme-btn/theme-btn.component';

import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';

import { SessionTimeoutModalComponent } from './shared/common/session-timeout/session-timeout-modal-component';
import { SessionTimeoutComponent } from './shared/common/session-timeout/session-timeout.component';
import { SharedModule } from '@shared/shared.module';


const NAVCOMPONENTS = [
    HeaderComponent,
    SidebarComponent,
    HeaderUserComponent,
    LanguageSwitchComponent,
    HeaderNotificationsComponent
];

@NgModule({
    imports: [        
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        FileUploadModule,
        ImageCropperModule
    ],
    declarations: [
        AppComponent,
        ...NAVCOMPONENTS,
        LoginAttemptsModalComponent,
        ChangePasswordModalComponent,
        MySettingsModalComponent,
        ChangeProfilePictureModalComponent,
        SmsVerificationModalComponent,
        NotificationsComponent,
        NotificationSettingsModalComponent,
        SettingDrawerComponent,
        SettingDrawerItemComponent,
        SessionTimeoutModalComponent,
        SessionTimeoutComponent,
        LayoutThemeBtnComponent
    ],
    entryComponents: [
        LoginAttemptsModalComponent,
        ChangePasswordModalComponent,
        MySettingsModalComponent,
        ChangeProfilePictureModalComponent,
        SmsVerificationModalComponent,
        NotificationSettingsModalComponent,
        SettingDrawerComponent,
        SettingDrawerItemComponent,
    ],
    providers: [UserNotificationHelper],
})
export class AppModule { }
