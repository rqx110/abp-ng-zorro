import { NgModule, Injector, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { registerLocaleData, PlatformLocation } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RootRoutingModule } from './root-routing.module';

import { AppModule } from '@app/app.module';
import { RootComponent } from './root.component';
import { AppPreBootstrap } from './AppPreBootstrap';

import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppConsts } from '@shared/AppConsts';
import { AbpZeroTemplateCommonModule } from '@shared/common/common.module';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { LocaleMappingService } from '@shared/locale-mapping.service';

// import { AbpHttpInterceptor } from 'abp-ng2-module';

import { GlobalConfigModule } from './global-config.module';

import { NzI18nService, NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import * as localForage from 'localforage';
import { SharedModule } from '@shared/shared.module';
import { NgZorroMessageService } from '@shared/common/ui/message.service';
import { NgZorroNotifyService } from '@shared/common/ui/notify.service';

export function appInitializerFactory(
    injector: Injector,
    platformLocation: PlatformLocation) {
    return () => {
        return new Promise<boolean>((resolve, reject) => {
            AppConsts.appBaseHref = getBaseHref(platformLocation);
            let appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

            initializeLocalForage();
            
            AppPreBootstrap.run(appBaseUrl, () => {
                initializeNgZorroMessage(injector);
                
                handleLogoutRequest(injector.get(AppAuthService));

                const appSessionService: AppSessionService = injector.get(AppSessionService);
                appSessionService.init().then(
                    () => {
                        registerNgZorroLocales(injector);
                        registerLocales(resolve, reject);
                    },
                    err => {
                        reject(err);
                    },
                );
            });
        });
    };
}

function initializeNgZorroMessage(injector: Injector) {
    const zorroMessage = injector.get(NgZorroMessageService);
    zorroMessage.init();
    const zorroNotify = injector.get(NgZorroNotifyService);
    zorroNotify.init();
}

function initializeLocalForage() {
    localForage.config({
        driver: localForage.LOCALSTORAGE,
        name: 'AbpZeroTemplate',
        version: 1.0,
        storeName: 'abpzerotemplate_local_storage',
        description: 'Cached data for AbpZeroTemplate'
    });
}

function getDocumentOrigin() {
    if (!document.location.origin) {
        return document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '');
    }

    return document.location.origin;
}

function registerNgZorroLocales(injector: Injector) {
    if (shouldLoadLocale()) {
        let ngZorroLcale = convertAbpLocaleToNgZorroLocale(abp.localization.currentLanguage.name);
        import(`ng-zorro-antd/esm2015/i18n/languages/${ngZorroLcale}.js`)
            .then(module => {
                let nzI18nService = injector.get(NzI18nService);
                nzI18nService.setLocale(module.default);
            });
    }
}

function registerLocales(resolve: (value?: boolean | Promise<boolean>) => void, reject: any) {
    if (shouldLoadLocale()) {
        let angularLocale = convertAbpLocaleToAngularLocale(abp.localization.currentLanguage.name);
        import(`@angular/common/locales/${angularLocale}.js`)
            .then(module => {
                registerLocaleData(module.default);
                resolve(true);
            }, reject);
    } else {
        resolve(true);
    }
}

export function shouldLoadLocale(): boolean {
    return abp.localization.currentLanguage.name && abp.localization.currentLanguage.name !== 'en-US';
}

export function convertAbpLocaleToAngularLocale(locale: string): string {
    return new LocaleMappingService().map('angular', locale);
}

export function convertAbpLocaleToNgZorroLocale(locale: string): string {
    return new LocaleMappingService().map('ng_zorro', locale);
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
    return convertAbpLocaleToAngularLocale(abp.localization.currentLanguage.name);
}

export function getBaseHref(platformLocation: PlatformLocation): string {
    let baseUrl = platformLocation.getBaseHrefFromDOM();
    if (baseUrl) {
        return baseUrl;
    }

    return '/';
}

function handleLogoutRequest(authService: AppAuthService) {
    let currentUrl = UrlHelper.initialUrl;
    let returnUrl = UrlHelper.getReturnUrl();
    if (currentUrl.indexOf(('account/logout')) >= 0 && returnUrl) {
        authService.logout(true, returnUrl);
    }
}

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        AbpZeroTemplateCommonModule.forRoot(),
        GlobalConfigModule.forRoot(),
        SharedModule,
        ServiceProxyModule,
        RootRoutingModule,
        AppModule
    ],
    declarations: [RootComponent],
    providers: [
        // { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
        { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector, PlatformLocation],
            multi: true,
        },
        {
            provide: LOCALE_ID,
            useFactory: getCurrentLanguage,
        },
        { provide: NZ_I18N, useValue: en_US }
    ],
    bootstrap: [RootComponent],
})
export class RootModule { }
