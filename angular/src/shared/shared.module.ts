import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AbpModule } from '@abp/abp.module';

// #region your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AbpModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    NgZorroAntdModule,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AbpModule,
    AlainThemeModule,
    DelonABCModule,
    NgZorroAntdModule,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule {}
