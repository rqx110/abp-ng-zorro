import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';
import { FileDownloadService } from './file-download.service';
import { ScriptLoaderService } from './script-loader.service';
import { ValidationMessagesComponent } from './validation-messages.component';
import { EqualValidator } from './validation/equal-validator.directive';
import { PasswordComplexityValidator } from './validation/password-complexity-validator.directive';
import { MomentFromNowPipe } from './moment-from-now.pipe';
import { MomentFormatPipe } from './moment-format.pipe';
import { LocalizePipe } from './localize.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        FileDownloadService,
        ScriptLoaderService
    ],
    declarations: [
        EqualValidator,
        PasswordComplexityValidator,
        AutoFocusDirective,
        MomentFromNowPipe,
        MomentFormatPipe,
        ValidationMessagesComponent,
        LocalizePipe
    ],
    exports: [
        EqualValidator,
        PasswordComplexityValidator,
        AutoFocusDirective,
        MomentFromNowPipe,
        MomentFormatPipe,
        ValidationMessagesComponent,
        LocalizePipe
    ]
})
export class UtilsModule { }
