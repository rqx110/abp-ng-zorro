import { Injectable } from '@angular/core';
import { AbpHttpConfigurationService, LogService, MessageService } from 'abp-ng2-module';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ZeroTemplateHttpConfigurationService extends AbpHttpConfigurationService {

    constructor(
        messageService: MessageService,
        logService: LogService,
        private _route: Router) {
        super(messageService, logService);
    }

    // Override handleUnAuthorizedRequest so it doesn't refresh the page during failed login attempts.
    handleUnAuthorizedRequest(messagePromise: any, targetUrl?: string) {
        if (this._route.url === '/account/login') {
            return;
        }

        const self = this;

        if (messagePromise) {
            messagePromise.done(() => {
                this.handleTargetUrl(targetUrl || '/');
            });
        } else {
            self.handleTargetUrl(targetUrl || '/');
        }
    }
}
