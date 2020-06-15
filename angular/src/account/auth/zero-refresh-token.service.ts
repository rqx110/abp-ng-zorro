import { Injectable } from '@angular/core';
import { RefreshTokenService, TokenService } from 'abp-ng2-module';
import { TokenAuthServiceProxy, RefreshTokenResult } from '@shared/service-proxies/service-proxies';
import { Observable, Subject, of } from 'rxjs';
import { AppConsts } from '@shared/AppConsts';
import { LocalStorageService } from '@shared/utils/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ZeroRefreshTokenService implements RefreshTokenService {
  constructor(
    private _tokenAuthService: TokenAuthServiceProxy,
    private _tokenService: TokenService,
    private _localStorageService: LocalStorageService
  ) { }

  tryAuthWithRefreshToken(): Observable<boolean> {
    let refreshTokenObservable = new Subject<boolean>();

    let token = this._tokenService.getRefreshToken();
    if (!token || token.trim() === '') {
      return of(false);
    }

    this._tokenAuthService.refreshToken(token)
      .subscribe(
        (tokenResult: RefreshTokenResult) => {
          if (tokenResult && tokenResult.accessToken) {
            let tokenExpireDate = (new Date(new Date().getTime() + 1000 * tokenResult.expireInSeconds));
            this._tokenService.setToken(tokenResult.accessToken, tokenExpireDate);

            this._localStorageService.setItem(AppConsts.authorization.encrptedAuthTokenName, {
                token: tokenResult.encryptedAccessToken,
                expireDate: tokenExpireDate,
            });

            refreshTokenObservable.next(true);
          } else {
            refreshTokenObservable.next(false);
          }
        },
        (error: any) => {
          refreshTokenObservable.next(false);
        }
      );
    return refreshTokenObservable;
  }
}
