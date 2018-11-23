import { Component, OnInit, Injector, Input } from '@angular/core';
import {
    UpdateLanguageTextInput,
    LanguageServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-edit-language-text',
    templateUrl: './edit-language-text.component.html',
    styles: [],
})
export class EditLanguageTextComponent extends ModalComponentBase
    implements OnInit {
    @Input()
    data: UpdateLanguageTextInput;
    @Input()
    baseText: string;
    @Input()
    baseLanguage: abp.localization.ILanguageInfo;
    @Input()
    targetLanguage: abp.localization.ILanguageInfo;
    baseLanguageName: string;
    targetLanguageName: string;

    saving = false;

    constructor(
        injector: Injector,
        private languageService: LanguageServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        const self = this;
        self.baseLanguage = self.findLanguage(self.baseLanguageName);
        self.targetLanguage = self.findLanguage(self.targetLanguageName);
    }

    save(): void {
        if (this.data.value && this.data.value !== '') {
            this.saving = true;
            this.languageService
                .updateLanguageText(this.data)
                .pipe(finalize(() => (this.saving = false)))
                .subscribe(() => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.success();
                });
        }
    }

    private findLanguage(name: string): abp.localization.ILanguageInfo {
        return abp.localization.languages.find(
            (item, index, array) => item.name === name,
        );
    }
}
