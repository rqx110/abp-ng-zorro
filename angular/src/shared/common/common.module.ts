import { AbpModule } from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppUrlService } from './nav/app-url.service';
import { AppSessionService } from './session/app-session.service';

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
