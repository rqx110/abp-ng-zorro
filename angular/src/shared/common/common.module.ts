import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppUrlService } from './nav/app-url.service';
import { AppSessionService } from './session/app-session.service';

import { MessageService, NotifyService } from 'abp-ng2-module';

import { NgZorroNotifyService } from './ui/notify.service';
import { NgZorroMessageService } from './ui/message.service';

import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [
        SharedModule
    ]
})
export class AbpZeroTemplateCommonModule {
    static forRoot(): ModuleWithProviders<AbpZeroTemplateCommonModule> {
        return {
            ngModule: AbpZeroTemplateCommonModule,
            providers: [
                AppSessionService,
                AppUrlService,
                NgZorroMessageService,
                NgZorroNotifyService
            ]
        };
    }
}
