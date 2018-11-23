import { NgModule, Optional, SkipSelf, ModuleWithProviders, } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AlainThemeModule, MenuService } from '@delon/theme';
import { DelonABCModule, ReuseTabService, ReuseTabStrategy, PageHeaderConfig } from '@delon/abc';
import { DelonUtilModule } from '@delon/util';

import { AppConsts } from '@shared/AppConsts';
import { AbpMenuService } from '@shared/menus/abp-menu.service';

export function pageHeaderConfig(): PageHeaderConfig {
    return Object.assign(new PageHeaderConfig(), {
        homeI18n: abp.localization.localize('HomePage', AppConsts.localization.defaultLocalizationSourceName),
    }
    );
}

@NgModule({
    imports: [
        AlainThemeModule.forRoot(),
        DelonABCModule.forRoot(),
        DelonUtilModule.forRoot()
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
                },
                {
                    provide: MenuService, useClass: AbpMenuService, multi: false
                }
            ],
        };
    }
}
