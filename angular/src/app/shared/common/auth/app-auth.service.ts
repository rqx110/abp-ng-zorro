import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { XmlHttpRequestHelper } from '@shared/helpers/XMLHttpRequestHelper';
import { LocalStorageService } from '@shared/utils/local-storage.service';

@Injectable()
export class AppAuthService {
    logout(reload?: boolean, returnUrl?: string): void {
        let customHeaders = {
            'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
            'Authorization': 'Bearer ' + abp.auth.getToken()
        };

        XmlHttpRequestHelper.ajax(
            'GET',
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LogOut',
            customHeaders,
            null,
            () => {
                abp.auth.clearToken();
                abp.auth.clearRefreshToken();
                new LocalStorageService().removeItem(AppConsts.authorization.encrptedAuthTokenName);

                if (reload !== false) {
                    if (returnUrl) {
                        location.href = returnUrl;
                    } else {
                        location.href = '';
                    }
                }
            }
        );
    }
}
