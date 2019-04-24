import { AbpModule } from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppUrlService } from './nav/app-url.service';
import { AppSessionService } from './session/app-session.service';

import { MessageService } from '@abp/message/message.service';
import { NotifyService } from '@abp/notify/notify.service';
import { NgZorroNotifyService } from './ui/notify.service';
import { NgZorroMessageService } from './ui/message.service';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DelonABCModule } from '@delon/abc';
import { AlainThemeModule, ModalHelper } from '@delon/theme';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        AbpModule,
        NgZorroAntdModule,
        DelonABCModule,
        AlainThemeModule.forChild()
    ],
    exports: [
        AbpModule,
        NgZorroAntdModule,
        AlainThemeModule,
        DelonABCModule,
    ],
    providers: [
        ModalHelper,
        { provide: MessageService, useClass: NgZorroMessageService },
        { provide: NotifyService, useClass: NgZorroNotifyService }
    ],
})
export class CommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CommonModule,
            providers: [
                AppSessionService,
                AppUrlService
            ]
        };
    }
}
