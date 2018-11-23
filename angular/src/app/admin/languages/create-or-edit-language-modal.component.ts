import { Component, OnInit, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import {
    LanguageServiceProxy,
    ApplicationLanguageEditDto,
    ComboboxItemDto,
    CreateOrUpdateLanguageInput,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'createOrEditLanguageModal',
    templateUrl: './create-or-edit-language-modal.component.html',
    styles: [],
})
export class CreateOrEditLanguageModalComponent extends ModalComponentBase implements OnInit {

    languageId: number = undefined;
    saving = false;
    language: ApplicationLanguageEditDto = new ApplicationLanguageEditDto();
    selectedLanguage: string;
    languageNames: ComboboxItemDto[] = [];
    flags: ComboboxItemDto[] = [];

    constructor(
        injector: Injector,
        private languageService: LanguageServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.init();
    }

    init(): void {
        this.languageService
            .getLanguageForEdit(this.languageId)

            .subscribe(result => {
                this.language = result.language;
                this.languageNames = result.languageNames;
                this.flags = result.flags;

                this.selectedLanguage = result.language.name || '';

                if (!this.languageId) {
                    this.language.isEnabled = true;
                }

            });
    }

    save(): void {
        let input = new CreateOrUpdateLanguageInput();
        input.language = this.language;

        this.saving = true;
        this.languageService
            .createOrUpdateLanguage(input)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();
            });
    }
}
