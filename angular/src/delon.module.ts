import { NgModule, Optional, SkipSelf, ModuleWithProviders, } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AlainThemeModule } from '@delon/theme';
import { ReuseTabService, ReuseTabStrategy, PageHeaderConfig } from '@delon/abc';

import { AppConsts } from '@shared/AppConsts';

export function pageHeaderConfig(): PageHeaderConfig {
    return Object.assign(new PageHeaderConfig(), {
        homeI18n: abp.localization.localize('HomePage', AppConsts.localization.defaultLocalizationSourceName),
        recursiveBreadcrumb: true
    });
}

@NgModule({
    imports: [
        AlainThemeModule.forRoot()
    ],
})

export class DelonModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: DelonModule,
    ) { }
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DelonModule,
            providers: [
                // {
                //     provide: RouteReuseStrategy, useClass: ReuseTabStrategy, deps: [ReuseTabService],
                // },
                {
                    provide: PageHeaderConfig, useFactory: pageHeaderConfig
                }
            ],
        };
    }
}
