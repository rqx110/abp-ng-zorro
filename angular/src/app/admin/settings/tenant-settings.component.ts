import { Component, Injector, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { SendTestEmailInput, TenantSettingsEditDto, TenantSettingsServiceProxy, SettingScopes } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl: './tenant-settings.component.html',
})
export class TenantSettingsComponent extends AppComponentBase implements OnInit {

    usingDefaultTimeZone = false;
    initialTimeZone: string = null;
    testEmailAddress: string = undefined;

    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;

    settings: TenantSettingsEditDto = undefined;

    remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    defaultTimezoneScope: SettingScopes = SettingScopes.Tenant;

    constructor(
        injector: Injector,
        private _tenantSettingsService: TenantSettingsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.testEmailAddress = this.appSession.user.emailAddress;
        this.getSettings();
    }

    getSettings(): void {
        this._tenantSettingsService.getAllSettings()
            .subscribe((result: TenantSettingsEditDto) => {
                this.settings = result;
                if (this.settings.general) {
                    this.initialTimeZone = this.settings.general.timezone;
                    this.usingDefaultTimeZone = this.settings.general.timezoneForComparison === abp.setting.values['Abp.Timing.TimeZone'];
                }

            });
    }

    saveAll(): void {
        this._tenantSettingsService.updateAllSettings(this.settings).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));

            if (abp.clock.provider.supportsMultipleTimezone && this.usingDefaultTimeZone && this.initialTimeZone !== this.settings.general.timezone) {
                this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).then(() => {
                    window.location.reload();
                });
            }

        });
    }

    sendTestEmail(): void {
        const input = new SendTestEmailInput();
        input.emailAddress = this.testEmailAddress;
        this._tenantSettingsService.sendTestEmail(input).subscribe(result => {
            this.notify.info(this.l('TestEmailSentSuccessfully'));
        });
    }
}
