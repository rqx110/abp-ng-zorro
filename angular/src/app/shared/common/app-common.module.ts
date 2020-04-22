import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { AbpProjectTemplateCommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        UtilsModule,
        AbpProjectTemplateCommonModule
    ],
    declarations: [
        TimeZoneComboComponent
    ],
    exports: [
        TimeZoneComboComponent
    ],
    providers: [
        AppLocalizationService,
        AppNavigationService
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders<AppCommonModule> {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
