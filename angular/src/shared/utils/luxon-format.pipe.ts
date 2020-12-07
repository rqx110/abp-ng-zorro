import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'luxonFormat' })
export class LuxonFormatPipe implements PipeTransform {
    transform(value: DateTime, format: string) {
        if (!value) {
            return '';
        }

        return value.toFormat(format);
    }
}
