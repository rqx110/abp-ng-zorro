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
export class AbpProjectTemplateCommonModule {
    static forRoot(): ModuleWithProviders<AbpProjectTemplateCommonModule> {
        return {
            ngModule: AbpProjectTemplateCommonModule,
            providers: [
                AppSessionService,
                AppUrlService,
                { provide: MessageService, useClass: NgZorroMessageService },
                { provide: NotifyService, useClass: NgZorroNotifyService }
            ]
        };
    }
}
