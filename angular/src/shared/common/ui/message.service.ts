import { Injectable } from "@angular/core";
import { AppConsts } from "@shared/AppConsts";
import { NzModalService } from "ng-zorro-antd/modal";

@Injectable()
export class NgZorroMessageService {
    constructor(private _modalService: NzModalService) {}

    init() {
        abp.message.info = (message: string, title?: string, options?: any) => {
            let displayTitle = title == null ? message : title;
            this._modalService.info({
                nzTitle: displayTitle,
                nzContent: message,
            });
        };

        abp.message.success = (
            message: string,
            title?: string,
            options?: any
        ) => {
            let displayTitle = title == null ? message : title;
            this._modalService.success({
                nzTitle: displayTitle,
                nzContent: message,
            });
        };

        abp.message.warn = (message: string, title?: string, options?: any) => {
            let displayTitle = title == null ? message : title;
            this._modalService.warning({
                nzTitle: displayTitle,
                nzContent: message,
            });
        };

        abp.message.error = (
            message: string,
            title?: string,
            options?: any
        ) => {
            let displayTitle = title == null ? message : title;
            this._modalService.error({
                nzTitle: displayTitle,
                nzContent: message,
            });
        };

        abp.message.confirm = (
            message: string,
            title?: string,
            callback?: (result: boolean) => void,
            options?: any
        ) => {
            this._modalService.confirm({
                nzTitle: <any>(
                    abp.localization.localize(
                        "AreYouSure",
                        AppConsts.localization.defaultLocalizationSourceName
                    )
                ),
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
}
