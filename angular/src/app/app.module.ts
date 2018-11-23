import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { UtilsModule } from '@shared/utils/utils.module';

import { AppCommonModule } from '@appshared/common/app-common.module';

import { LoginAttemptsModalComponent } from '@appshared/layout/login-attempts-modal.component';
import { ChangePasswordModalComponent } from '@appshared/layout/profile/change-password-modal.component';
import { MySettingsModalComponent } from '@appshared/layout/profile/my-settings-modal.component';
import { ChangeProfilePictureModalComponent } from '@appshared/layout/profile/change-profile-picture-modal.component';
import { SmsVerificationModalComponent } from '@appshared/layout/profile/sms-verification-modal.component';

import { HeaderComponent } from '@appshared/layout/header/header.component';
import { SidebarComponent } from '@appshared/layout/sidebar/sidebar.component';
import { HeaderUserComponent } from '@appshared/layout/header/components/user.component';

import { LanguageSwitchComponent } from '@appshared/layout/header/components/language-switch.component';

import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';
import { HeaderNotificationsComponent } from './shared/layout/notifications/header-notifications.component';
import { NotificationSettingsModalComponent } from './shared/layout/notifications/notification-settings-modal.component';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';

import { SettingDrawerComponent } from '@appshared/layout/setting-drawer/setting-drawer.component';
import { SettingDrawerItemComponent } from '@appshared/layout/setting-drawer/setting-drawer-item.component';


import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';

const NAVCOMPONENTS = [
    HeaderComponent,
    SidebarComponent,
    HeaderUserComponent,
    LanguageSwitchComponent,
    HeaderNotificationsComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
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
        SettingDrawerItemComponent
    ],
    entryComponents: [
        LoginAttemptsModalComponent,
        ChangePasswordModalComponent,
        MySettingsModalComponent,
        ChangeProfilePictureModalComponent,
        SmsVerificationModalComponent,
        NotificationSettingsModalComponent,
        SettingDrawerComponent,
        SettingDrawerItemComponent
    ],
    providers: [UserNotificationHelper],
})
export class AppModule { }
