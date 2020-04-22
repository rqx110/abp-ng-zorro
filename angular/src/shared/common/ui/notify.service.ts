import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NotifyService } from 'abp-ng2-module';

@Injectable()
export class NgZorroNotifyService extends NotifyService {

    constructor(
        private _notifyService: NzNotificationService
    ) {
        super();
    }

    normalize(message: string, title?: string) {
        if (!title) {
            title = message;
            message = '';
        }

        return { message_normalize: message, title_normalize: title };
    }

    info(message: string, title?: string, options?: any): void {
        const { title_normalize, message_normalize } = this.normalize(message, title);
        this._notifyService.info(title_normalize, message_normalize, options);
    }

    success(message: string, title?: string, options?: any): void {
        const { title_normalize, message_normalize } = this.normalize(message, title);
        this._notifyService.success(title_normalize, message_normalize, options);
    }

    warn(message: string, title?: string, options?: any): void {
        const { title_normalize, message_normalize } = this.normalize(message, title);
        this._notifyService.warning(title_normalize, message_normalize, options);
    }

    error(message: string, title?: string, options?: any): void {
        const { title_normalize, message_normalize } = this.normalize(message, title);
        this._notifyService.error(title_normalize, message_normalize, options);
    }
}
