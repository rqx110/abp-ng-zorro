import { AppConsts } from '@shared/AppConsts';
import { LocalStorageService } from '@shared/utils/local-storage.service';

export class SignalRHelper {
    static initSignalR(callback: () => void): void {
        new LocalStorageService().getItem(AppConsts.authorization.encrptedAuthTokenName, function (err, value) {
            let encryptedAuthToken = value?.token;

            abp.signalr = {
                autoConnect: false, 
                connect: undefined,
                hubs: undefined,
                qs: encryptedAuthToken ? (AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken)) : '',
                remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
                startConnection: undefined,
                url: '/signalr'
            };

            let script = document.createElement('script');
            script.onload = () => {
                callback();
            };

            script.src = AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js';
            document.head.appendChild(script);
        });

    }
}
