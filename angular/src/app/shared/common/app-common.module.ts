import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { CommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        UtilsModule,
        CommonModule
    ],
    declarations: [
        TimeZoneComboComponent
    ],
    exports: [
        CommonModule,
        TimeZoneComboComponent
    ],
    providers: [
        AppLocalizationService,
        AppNavigationService
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
