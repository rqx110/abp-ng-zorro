import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';

import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { LocalizationService } from '@abp/localization/localization.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MainRoutingModule,
        AppCommonModule,
        UtilsModule,
    ],
    declarations: [DashboardComponent],
    providers: [
        LocalizationService
    ],
})
export class MainModule { }
