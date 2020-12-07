import { Component, Injector } from '@angular/core';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import {
    ApplicationLanguageListDto,
    LanguageServiceProxy,
    SetDefaultLanguageInput,
} from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { CreateOrEditLanguageModalComponent } from './create-or-edit-language-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styles: [],
})
export class LanguagesComponent extends PagedListingComponentBase<ApplicationLanguageListDto> {
    defaultLanguageName: string;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private router: Router,
    ) {
        super(injector);
    }

    changeTexts(language: ApplicationLanguageListDto): void {
        const self = this;
        setTimeout(() => {
            self.router.navigate(['app/admin/languagetexts', language.name, 'texts']);
        }, 300);
    }

    setAsDefaultLanguage(language: ApplicationLanguageListDto): void {
        const input = new SetDefaultLanguageInput();
        input.name = language.name;
        this._languageService.setDefaultLanguage(input).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullySaved'));
        });
    }

    deleteLanguage(language: ApplicationLanguageListDto): void {
        this._languageService.deleteLanguage(language.id).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }

    createOrEditLanguage(languageId?: number): void {
        this.modalHelper
            .createStatic(CreateOrEditLanguageModalComponent, { languageId: languageId })
            .subscribe(res => {
                if (res) {
                    this.refresh();
                }
            });
    }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this._languageService
            .getLanguages()
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.defaultLanguageName = result.defaultLanguageName;
                this.pageSize = result.items.length;
            });
    }

    delete(language: ApplicationLanguageListDto): void {
        this._languageService.deleteLanguage(language.id).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }

    batchDelete(): void {
        this.message.warn('method not implement!');
        // const selectCount = this.selectedDataItems.length;
        // if (selectCount <= 0) {
        //     this.message.warn(this.l('SelectAnItem'));
        //     return;
        // }

        // this.message.confirm(
        //     this.l('<b class="text-red">{0}</b> items will be removed.', selectCount),
        //     res => {
        //         if (res) {
        //             let deletedIds = _.map(this.selectedDataItems, (item) => new EntityDto({ id: item.id }));
        //             this._languageService.batchDeleteLanguages(deletedIds).subscribe(() => {
        //                 this.refresh();
        //                 this.notify.success(this.l('SuccessfullyDeleted'));
        //             });
        //         }
        //     },
        // );
    }
}
