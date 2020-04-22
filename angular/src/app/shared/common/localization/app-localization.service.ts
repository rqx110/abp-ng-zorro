import { LocalizationService } from 'abp-ng2-module';
import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

@Injectable()
export class AppLocalizationService extends LocalizationService {

    l(key: string, ...args: any[]): string {
        args.unshift(key);
        args.unshift(AppConsts.localization.defaultLocalizationSourceName);
        return this.ls.apply(this, args);
    }

    ls(sourcename: string, key: string, ...args: any[]): string {
        let localizedText = this.localize(key, sourcename);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }
}
