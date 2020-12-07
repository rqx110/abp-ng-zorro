import { AppConsts } from '@shared/AppConsts';
import { filter as _filter } from 'lodash-es';

export class LocaleMappingService {
    map(mappingSource: string, locale: string): string {
        if (!AppConsts.localeMappings && !AppConsts.localeMappings[mappingSource]) {
            return locale;
        }

        const localeMappings = _filter(AppConsts.localeMappings[mappingSource], { from: locale });
        if (localeMappings && localeMappings.length) {
            return localeMappings[0]['to'];
        }

        return locale;
    }
}
