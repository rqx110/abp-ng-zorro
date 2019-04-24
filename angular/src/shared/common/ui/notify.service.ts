import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { NotifyService } from '@abp/notify/notify.service';

@Injectable()
export class NgZorroNotifyService extends NotifyService {

    constructor(
        private _notifyService: NzNotificationService
    ) {
        super();
    }

    info(message: string, title?: string, options?: any): void {
        this._notifyService.info(title, message, options);
    }

    success(message: string, title?: string, options?: any): void {
        this._notifyService.success(title, message, options);
    }

    warn(message: string, title?: string, options?: any): void {
        this._notifyService.warning(title, message, options);
    }

    error(message: string, title?: string, options?: any): void {
        this._notifyService.error(title, message, options);
    }
}
