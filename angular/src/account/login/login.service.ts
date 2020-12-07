
import { MessageService, TokenService, LogService, LocalizationService } from 'abp-ng2-module';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AuthenticateModel, AuthenticateResultModel, ExternalAuthenticateModel, ExternalAuthenticateResultModel, ExternalLoginProviderInfoModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { ScriptLoaderService } from '@shared/utils/script-loader.service';
import { filter as _filter, map as _map } from 'lodash-es'

import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { UserAgentApplication, AuthResponse } from 'msal';
import { LocalStorageService } from '@shared/utils/local-storage.service';

declare const FB: any; // Facebook API
declare const gapi: any; // Google API

export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {

    static readonly FACEBOOK: string = 'Facebook';
    static readonly GOOGLE: string = 'Google';
    static readonly MICROSOFT: string = 'Microsoft';
    static readonly OPENID: string = 'OpenIdConnect';

    icon: string;
    initialized = false;

    constructor(providerInfo: ExternalLoginProviderInfoModel) {
        super();

        this.name = providerInfo.name;
        this.clientId = providerInfo.clientId;
        this.additionalParams = providerInfo.additionalParams;
        this.icon = providerInfo.name.toLowerCase();
    }

}

@Injectable()
export class LoginService {

    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';
    
    MSAL: UserAgentApplication; // Microsoft API
    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    externalLoginProviders: ExternalLoginProvider[] = [];
    rememberMe: boolean;
    
    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _messageService: MessageService,
        private _tokenService: TokenService,
        private _logService: LogService,
        private oauthService: OAuthService,
        private _localizationService: LocalizationService,
        private _localStorageService: LocalStorageService
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void, redirectUrl?: string): void {
        finallyCallback = finallyCallback || (() => { });

        const self = this;
        this._localStorageService.getItem(LoginService.twoFactorRememberClientTokenName, function (err, value) {
            self.authenticateModel.twoFactorRememberClientToken = value?.token;
            self.authenticateModel.singleSignIn = UrlHelper.getSingleSignIn();
            self.authenticateModel.returnUrl = UrlHelper.getReturnUrl();

            self._tokenAuthService
                .authenticate(self.authenticateModel)
                .subscribe({
                    next: (result: AuthenticateResultModel) => {
                        self.processAuthenticateResult(result, redirectUrl);
                        finallyCallback();
                    },
                    error: () => {
                        finallyCallback();
                    }
                });
        });
    }

    externalAuthenticate(provider: ExternalLoginProvider): void {
        this.ensureExternalLoginProviderInitialized(provider, () => {
            if (provider.name === ExternalLoginProvider.FACEBOOK) {
                FB.login(response => {
                    this.facebookLoginStatusChangeCallback(response);
                }, { scope: 'email' });
            } else if (provider.name === ExternalLoginProvider.GOOGLE) {
                gapi.auth2.getAuthInstance().signIn().then(() => {
                    this.googleLoginStatusChangeCallback(gapi.auth2.getAuthInstance().isSignedIn.get());
                });
            } else if (provider.name === ExternalLoginProvider.MICROSOFT) {
                let scopes = ['user.read'];
                this.MSAL.loginPopup({
                    scopes: scopes
                }).then(() => {
                    this.MSAL.acquireTokenSilent({ scopes: scopes }).then((accessTokenResponse: AuthResponse) => {
                        this.microsoftLoginCallback(accessTokenResponse);
                    }).catch(error => {
                        abp.log.error(error);
                        abp.message.error(this._localizationService.localize('CouldNotValidateExternalUser', this.localizationSourceName));
                    });
                });
            }
        });
    }

    init(): void {
        this.initExternalLoginProviders();
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel, redirectUrl?: string) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.shouldResetPassword) {
            // Password reset

            this._router.navigate(['account/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: abp.session.tenantId,
                    resetCode: authenticateResult.passwordResetCode
                }
            });

            this.clear();

        } else if (authenticateResult.requiresTwoFactorVerification) {
            // Two factor authentication

            this._router.navigate(['account/send-code']);

        } else if (authenticateResult.accessToken) {
            // Successfully logged in
            if (authenticateResult.returnUrl && !redirectUrl) {
                redirectUrl = authenticateResult.returnUrl;
            }

            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                authenticateResult.refreshToken,
                authenticateResult.refreshTokenExpireInSeconds,
                this.rememberMe,
                authenticateResult.twoFactorRememberClientToken,
                redirectUrl
            );

        } else {
            // Unexpected result!

            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['account/login']);

        }
    }

    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, refreshToken: string, refreshTokenExpireInSeconds: number, rememberMe?: boolean, twoFactorRememberClientToken?: string, redirectUrl?: string): void {

        let tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        this._tokenService.setToken(
            accessToken,
            tokenExpireDate
        );

        if (refreshToken && rememberMe) {
            let refreshTokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * refreshTokenExpireInSeconds)) : undefined;
            this._tokenService.setRefreshToken(
                refreshToken,
                refreshTokenExpireDate
            );
        }

        this._localStorageService.setItem(AppConsts.authorization.encrptedAuthTokenName, {
            token: encryptedAccessToken,
            expireDate: tokenExpireDate,
        });

        if (twoFactorRememberClientToken) {
            this._localStorageService.setItem(LoginService.twoFactorRememberClientTokenName, {
                token: twoFactorRememberClientToken,
                expireDate: new Date(new Date().getTime() + 365 * 86400000), // 1 year
            });
        }

        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            let initialUrl = UrlHelper.initialUrl;

            if (initialUrl.indexOf('/account') > 0) {
                initialUrl = AppConsts.appBaseUrl;
            }

            location.href = initialUrl;
        }
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

    private initExternalLoginProviders(callback?: any) {
        this._tokenAuthService
            .getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = _map(providers, p => new ExternalLoginProvider(p));

                if (callback) {
                    callback();
                }
            });
    }

    ensureExternalLoginProviderInitialized(loginProvider: ExternalLoginProvider, callback: () => void) {
        if (loginProvider.initialized) {
            callback();
            return;
        }

        if (loginProvider.name === ExternalLoginProvider.FACEBOOK) {
            new ScriptLoaderService().load('//connect.facebook.net/en_US/sdk.js').then(() => {
                FB.init({
                    appId: loginProvider.clientId,
                    cookie: false,
                    xfbml: true,
                    version: 'v2.5'
                });

                FB.getLoginStatus(response => {
                    this.facebookLoginStatusChangeCallback(response);
                    if (response.status !== 'connected') {
                        callback();
                    }
                });
            });
        } else if (loginProvider.name === ExternalLoginProvider.GOOGLE) {
            new ScriptLoaderService().load('https://apis.google.com/js/api.js').then(() => {
                gapi.load('client:auth2',
                    () => {
                        gapi.client.init({
                            clientId: loginProvider.clientId,
                            scope: 'openid profile email'
                        }).then(() => {
                            callback();
                        });
                    });
            });
        } else if (loginProvider.name === ExternalLoginProvider.MICROSOFT) {
            this.MSAL = new UserAgentApplication({
                auth: {
                    clientId: loginProvider.clientId,
                    redirectUri: AppConsts.appBaseUrl
                }
            });
            callback();
        } else if (loginProvider.name === ExternalLoginProvider.OPENID) {
            const authConfig = this.getOpenIdConnectConfig(loginProvider);
            this.oauthService.configure(authConfig);
            this.oauthService.initImplicitFlow('openIdConnect=1');
        }
    }

    private getOpenIdConnectConfig(loginProvider: ExternalLoginProvider): AuthConfig {
        let authConfig = new AuthConfig();
        authConfig.loginUrl = loginProvider.additionalParams['LoginUrl'];
        authConfig.issuer = loginProvider.additionalParams['Authority'];
        authConfig.clientId = loginProvider.clientId;
        authConfig.responseType = 'id_token';
        authConfig.redirectUri = window.location.origin + '/account/login';
        authConfig.scope = 'openid profile';
        authConfig.requestAccessToken = false;
        return authConfig;
    }

    private facebookLoginStatusChangeCallback(resp) {
        if (resp.status === 'connected') {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.FACEBOOK;
            model.providerAccessCode = resp.authResponse.accessToken;
            model.providerKey = resp.authResponse.userID;
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService.externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info('You have successfully registered. Waiting for activation!');
                        return;
                    }

                    this.login(result.accessToken,
                        result.encryptedAccessToken,
                        result.expireInSeconds,
                        result.refreshToken,
                        result.refreshTokenExpireInSeconds,
                        false,
                        '',
                        result.returnUrl);
                });
        }
    }

    public openIdConnectLoginCallback(resp) {
        this.initExternalLoginProviders(() => {
            let openIdProvider = _filter(this.externalLoginProviders, { name: 'OpenIdConnect' })[0];
            let authConfig = this.getOpenIdConnectConfig(openIdProvider);
            this.oauthService.configure(authConfig);

            this.oauthService.tryLogin().then(() => {
                let claims = this.oauthService.getIdentityClaims();

                const model = new ExternalAuthenticateModel();
                model.authProvider = ExternalLoginProvider.OPENID;
                model.providerAccessCode = this.oauthService.getIdToken();
                model.providerKey = claims['sub'];
                model.singleSignIn = UrlHelper.getSingleSignIn();
                model.returnUrl = UrlHelper.getReturnUrl();

                this._tokenAuthService.externalAuthenticate(model)
                    .subscribe((result: ExternalAuthenticateResultModel) => {
                        if (result.waitingForActivation) {
                            this._messageService.info('You have successfully registered. Waiting for activation!');
                            return;
                        }

                        this.login(result.accessToken,
                            result.encryptedAccessToken,
                            result.expireInSeconds,
                            result.refreshToken,
                            result.refreshTokenExpireInSeconds,
                            false,
                            '',
                            result.returnUrl);
                    });
            });
        });
    }

    private googleLoginStatusChangeCallback(isSignedIn) {
        if (isSignedIn) {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.GOOGLE;
            model.providerAccessCode = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            model.providerKey = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId();
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService.externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info('You have successfully registered. Waiting for activation!');
                        return;
                    }

                    this.login(result.accessToken,
                        result.encryptedAccessToken,
                        result.expireInSeconds,
                        result.refreshToken,
                        result.refreshTokenExpireInSeconds,
                        false,
                        '',
                        result.returnUrl);
                });
        }
    }

    /**
    * Microsoft login is not completed yet, because of an error thrown by zone.js: https://github.com/angular/zone.js/issues/290
    */
   private microsoftLoginCallback(response: AuthResponse) {

    const model = new ExternalAuthenticateModel();
    model.authProvider = ExternalLoginProvider.MICROSOFT;
    model.providerAccessCode = response.accessToken;
    // remove dashes and starting 0 characters from objectId
    // 000-000-111-222 will be converted to 111222
    model.providerKey = response.idToken.objectId.replace(new RegExp('-', 'gm'), '').replace(/^0*/g, '');
    model.singleSignIn = UrlHelper.getSingleSignIn();
    model.returnUrl = UrlHelper.getReturnUrl();
    
    this._tokenAuthService.externalAuthenticate(model)
        .subscribe((result: ExternalAuthenticateResultModel) => {
            if (result.waitingForActivation) {
                this._messageService.info('You have successfully registered. Waiting for activation!');
                return;
            }

            this.login(result.accessToken,
                result.encryptedAccessToken,
                result.expireInSeconds,
                result.refreshToken,
                result.refreshTokenExpireInSeconds,
                false,
                '',
                result.returnUrl);
        });
    }
}
