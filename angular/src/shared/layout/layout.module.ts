import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { LayoutThemeBtnComponent } from './theme-btn/theme-btn.component';

@NgModule({
    imports: [SharedModule],
    declarations: [LayoutThemeBtnComponent],
    exports: [LayoutThemeBtnComponent],
})
export class LayoutModule {}
