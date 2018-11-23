import { Component, AfterViewInit, Injector } from '@angular/core';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import {
    LanguageTextListDto,
    UpdateLanguageTextInput,
    LanguageServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { EditLanguageTextComponent } from './edit-language-text.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-language-texts',
    templateUrl: './language-texts.component.html',
    styles: [],
})
export class LanguageTextsComponent
    extends PagedListingComponentBase<LanguageTextListDto>
    implements AfterViewInit {
    languages: abp.localization.ILanguageInfo[] = [];
    baseLanguageName: string;
    targetLanguageName: string;
    sourceNames: string[] = [];
    sourceName: string;

    targetValueFilters: any[] = [
        {
            label: this.l('All'),
            value: 'ALL',
        },
        {
            label: this.l('EmptyOnes'),
            value: 'EMPTY',
        },
    ];
    targetValueFilter: string;

    filterText: string;

    constructor(
        injector: Injector,
        private _languageService: LanguageServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);

        abp.localization.sources.forEach((item, index, array) => {
            if (item.type === 'MultiTenantLocalizationSource') {
                this.sourceNames.push(item.name);
            }
        });
        this.languages = abp.localization.languages;
        this.init();
    }

    ngAfterViewInit(): void { }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this._languageService
            .getLanguageTexts(
                request.maxResultCount,
                request.skipCount,
                undefined,
                this.sourceName,
                this.baseLanguageName,
                this.targetLanguageName,
                this.targetValueFilter,
                this.filterText
            )
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.totalItems = result.totalCount;
            });
    }

    init(): void {
        const self = this;
        this._activatedRoute.params.subscribe((params: Params) => {
            self.filterText = params['filterText'] || '';

            self.baseLanguageName =
                params['baseLanguageName'] || abp.localization.currentLanguage.name;
            self.targetLanguageName = params['name'];

            self.sourceName = AppConsts.localization.defaultLocalizationSourceName;
            self.targetValueFilter = params['targetValueFilter'] || 'ALL';
        });
    }

    truncateString(text): string {
        return abp.utils.truncateStringWithPostfix(text, 32, '...');
    }

    findIcon(name: string): string {
        let icon = '';
        for (let index = 0; index < this.languages.length; index++) {
            if (this.languages[index].name === name) {
                icon = this.languages[index].icon;
                break;
            }
        }
        return icon;
    }

    backToLanguageList(): void {
        this._router.navigate(['app/admin/languages']);
    }

    edit(data: LanguageTextListDto): void {
        const pars = new UpdateLanguageTextInput();
        pars.sourceName = this.sourceName;
        pars.key = data.key;
        pars.languageName = this.targetLanguageName;
        pars.value = data.targetValue;

        this.modalHelper
            .createStatic(EditLanguageTextComponent, {
                data: pars,
                baseText: data.baseValue,
                baseLanguageName: this.baseLanguageName,
                targetLanguageName: this.targetLanguageName,
            })
            .subscribe(res => {
                if (res) {
                    this.refresh();
                }
            });
    }
}
