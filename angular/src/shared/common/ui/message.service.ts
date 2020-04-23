import { Injectable } from "@angular/core";
import { AppConsts } from "@shared/AppConsts";
import { NzModalService } from "ng-zorro-antd/modal";

@Injectable()
export class NgZorroMessageService {
    constructor(private _modalService: NzModalService) {}

    init() {
        abp.message.info = (message: string, title?: string, options?: any) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._modalService.info({
                nzTitle: title_normalize,
                nzContent: message_normalize,
            });
        };

        abp.message.success = (
            message: string,
            title?: string,
            options?: any
        ) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._modalService.success({
                nzTitle: title_normalize,
                nzContent: message_normalize,
            });
        };

        abp.message.warn = (message: string, title?: string, options?: any) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._modalService.warning({
                nzTitle: title_normalize,
                nzContent: message_normalize,
            });
        };

        abp.message.error = (
            message: string,
            title?: string,
            options?: any
        ) => {
            const { title_normalize, message_normalize } = this.normalize(message, title);
            this._modalService.error({
                nzTitle: title_normalize,
                nzContent: message_normalize,
            });
        };

        abp.message.confirm = (
            message: string,
            title?: string,
            callback?: (result: boolean) => void,
            options?: any
        ) => {
            const title_normalize = title ?? <any>(
                abp.localization.localize(
                    "AreYouSure",
                    AppConsts.localization.defaultLocalizationSourceName
                )
            );
            this._modalService.confirm({
                nzTitle: title_normalize,
                nzContent: message,
                nzOnOk() {
                    if (callback) {
                        callback(true);
                    }
                },
                nzOnCancel() {
                    if (callback) {
                        callback(false);
                    }
                },
            });
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
