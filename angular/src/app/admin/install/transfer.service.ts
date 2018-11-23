import { Injectable } from '@angular/core';
import { InstallDto, EmailSettingsEditDto, InstallServiceProxy, NameValue } from '@shared/service-proxies/service-proxies';

@Injectable()
export class TransferService {
    step: 0 | 1 | 2 = 1;

    setupSettings: InstallDto;
    languages: NameValue[];

    constructor(private _installSettingService: InstallServiceProxy) {
        this.again();
    }

    loadAppSettingsJson(): void {
        let self = this;
        self._installSettingService.getAppSettingsJson()
            .subscribe(result => {
                this.setupSettings.webSiteUrl = result.webSiteUrl;
                this.setupSettings.serverUrl = result.serverSiteUrl;
                this.languages = result.languages;
            });
    }

    again() {
        this.step = 0;
        this.setupSettings = new InstallDto();
        this.setupSettings.smtpSettings = new EmailSettingsEditDto();
        this.setupSettings.defaultLanguage = 'en';
        this.loadAppSettingsJson();
    }

}
