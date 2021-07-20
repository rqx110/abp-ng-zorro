import { DateTime, Settings } from 'luxon';
import { merge as _merge} from 'lodash-es';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Type, CompilerOptions, NgModuleRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { environment } from '@env/environment';
import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';
import { XmlHttpRequestHelper } from '@shared/helpers/XMLHttpRequestHelper';
import { LocaleMappingService } from '@shared/locale-mapping.service';

export class AppPreBootstrap {
    static run(appRootUrl: string, callback: () => void): void {
        AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
            AppPreBootstrap.getUserConfiguration(callback);
        });
    }

    static bootstrap<TM>(
        moduleType: Type<TM>,
        compilerOptions?: CompilerOptions | CompilerOptions[],
    ): Promise<NgModuleRef<TM>> {
        return platformBrowserDynamic().bootstrapModule(
            moduleType,
            compilerOptions,
        );
    }

    private static getApplicationConfig(appRootUrl: string, callback: () => void) {
        let type = 'GET';
        let url = appRootUrl + 'assets/' + environment.appConfig;
        let customHeaders = [
            {
                name: abp.multiTenancy.tenantIdCookieName,
                value: abp.multiTenancy.getTenantIdCookie() + ''
            }];

        XmlHttpRequestHelper.ajax(type, url, customHeaders, null, (result) => {
            const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
            const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl);

            AppConsts.appBaseUrlFormat = result.appBaseUrl;
            AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl;
            AppConsts.localeMappings = result.localeMappings;

            if (tenancyName == null) {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
            } else {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
            }

            callback();
        });
    }

    private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    private static getUserConfiguration(callback: () => void): any {
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
        const token = abp.auth.getToken();

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
            [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie()
        };

        if (!cookieLangValue) {
            delete requestHeaders['.AspNetCore.Culture'];
        }

        if (token) {
            requestHeaders['Authorization'] = 'Bearer ' + token;
        }

        return XmlHttpRequestHelper.ajax('GET', AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll', requestHeaders, null, (response) => {
            let result = response.result;
            _merge(abp, result);

            abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);

            AppPreBootstrap.configureLuxon();

            abp.event.trigger('abp.dynamicScriptsInitialized');

            callback();
        });
    }

    private static configureLuxon() {
        let luxonLocale = new LocaleMappingService().map(
            'luxon',
            abp.localization.currentLanguage.name
        );

		Settings.defaultLocale = luxonLocale
        // DateTime.local().setLocale(luxonLocale);
        // DateTime.utc().setLocale(luxonLocale);

        if (abp.clock.provider.supportsMultipleTimezone) {
            Settings.defaultZoneName = abp.timing.timeZoneInfo.iana.timeZoneId;
        }

        Date.prototype.toISOString = function () {
            let value = DateTime.fromJSDate(this).setLocale('en').setZone(abp.timing.timeZoneInfo.iana.timeZoneId).toString();
            return value;
        };

        Date.prototype.toString = function () {
            let value = DateTime.fromJSDate(this).setLocale('en').setZone(abp.timing.timeZoneInfo.iana.timeZoneId).toString();
            return value;
        };

        DateTime.prototype.toString = function () {
            let date = this.setLocale('en').setZone(abp.timing.timeZoneInfo.iana.timeZoneId) as DateTime;
            return date.toISO();
        };
    }
}
