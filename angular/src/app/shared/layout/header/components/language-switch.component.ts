import { Component, OnInit, Injector } from '@angular/core';
import {
    ChangeUserLanguageDto,
    ProfileServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { filter as _filter } from 'lodash-es';

@Component({
    selector: 'language-switch',
    template: `
    <div nz-dropdown class="alain-default__nav-item" nzPlacement="bottomRight" [nzDropdownMenu]="languageMenuTpl">
        <i class="anticon {{currentLanguage.icon}}"></i>
        {{currentLanguage.displayName}}
        <i nz-icon nzType="down" style="font-size: 12px !important"></i>
    </div>
    <nz-dropdown-menu #languageMenuTpl="nzDropdownMenu">
        <ul nz-menu>
            <li nz-menu-item *ngFor="let language of languages"
                [nzSelected]="language.name == currentLanguage.name"
                (click)="changeLanguage(language.name)">
                <i class="anticon {{language.icon}}"></i>
                {{language.displayName}}
            </li>
        </ul>
    </nz-dropdown-menu>
    `
})
export class LanguageSwitchComponent extends AppComponentBase
    implements OnInit {
    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.languages = _filter(this.localization.languages, l => !l.isDisabled);
        this.currentLanguage = this.localization.currentLanguage;
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileService.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
                abp.appPath,
            );

            window.location.reload();
        });
    }
}
