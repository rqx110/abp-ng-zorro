import { NgModule } from '@angular/core';

import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';

import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { LocalizationService } from 'abp-ng2-module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [        
        SharedModule,
        MainRoutingModule,
        AppCommonModule,
        UtilsModule
    ],
    declarations: [DashboardComponent],
    providers: [
        LocalizationService
    ],
})
export class MainModule { }
