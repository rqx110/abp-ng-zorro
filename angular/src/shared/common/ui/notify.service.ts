import { Injectable } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Injectable()
export class NgZorroNotifyService {
    constructor(private _notifyService: NzNotificationService) {}

    init() {
        abp.notify.info = (message: string, title?: string) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._notifyService.info(title_normalize, message_normalize);
        };

        abp.notify.success = (message: string, title?: string) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._notifyService.success(title_normalize, message_normalize);
        };

        abp.notify.warn = (message: string, title?: string) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._notifyService.warning(title_normalize, message_normalize);
        };
        abp.notify.error = (message: string, title?: string) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._notifyService.error(title_normalize, message_normalize);
        };
    }

    normalize(message: string, title?: string) {
        if (!title) {
            title = message;
            message = "";
        }

        return { message_normalize: message, title_normalize: title };
    }
}
