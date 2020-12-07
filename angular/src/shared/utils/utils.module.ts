import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';
import { FileDownloadService } from './file-download.service';
import { ScriptLoaderService } from './script-loader.service';
import { ValidationMessagesComponent } from './validation-messages.component';
import { EqualValidator } from './validation/equal-validator.directive';
import { PasswordComplexityValidator } from './validation/password-complexity-validator.directive';
import { LuxonFromNowPipe } from './luxon-from-now.pipe';
import { LuxonFormatPipe } from './luxon-format.pipe';
import { LocalizePipe } from './localize.pipe';
import { LocalStorageService } from './local-storage.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        FileDownloadService,
        ScriptLoaderService,
        LocalStorageService
    ],
    declarations: [
        EqualValidator,
        PasswordComplexityValidator,
        AutoFocusDirective,
        LuxonFromNowPipe,
        LuxonFormatPipe,
        ValidationMessagesComponent,
        LocalizePipe
    ],
    exports: [
        EqualValidator,
        PasswordComplexityValidator,
        AutoFocusDirective,
        LuxonFromNowPipe,
        LuxonFormatPipe,
        ValidationMessagesComponent,
        LocalizePipe
    ]
})
export class UtilsModule { }
