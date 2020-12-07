import { Component, OnInit, Injector } from '@angular/core';

import { filter as _filter } from 'lodash-es';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'language-switch',
    templateUrl: './language-switch.component.html'
})
export class LanguageSwitchComponent extends AppComponentBase    implements OnInit {
    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.languages = _filter(this.localization.languages, l => !l.isDisabled);
        this.currentLanguage = this.localization.currentLanguage;
    }

    changeLanguage(languageName: string): void {
        abp.utils.setCookieValue(
            'Abp.Localization.CultureName',
            languageName,
            new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
            abp.appPath,
        );

        location.reload();
    }
}
