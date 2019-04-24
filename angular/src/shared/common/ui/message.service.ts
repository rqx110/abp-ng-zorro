import { Injectable } from '@angular/core';
import { MessageService } from '@abp/message/message.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConsts } from '@shared/AppConsts';

@Injectable()
export class NgZorroMessageService extends MessageService {

    constructor(private _modalService: NzModalService, private _messageService: NzMessageService) {
        super();
    }

    info(message: string, title?: string): any {
        this._messageService.info(message);
    }

    success(message: string, title?: string): any {
        this._messageService.success(message);
    }

    warn(message: string, title?: string): any {
        this._messageService.warning(message);
    }

    error(message: string, title?: string): any {
        this._messageService.error(message);
    }

    confirm(message: string, titleOrCallBack?: string | ((result: boolean) => void), callback?: (result: boolean) => void): any {
        if (typeof titleOrCallBack === 'string') {
            this._modalService.confirm({
                nzTitle: titleOrCallBack,
                nzContent: message,
                nzOnOk() {
                    if (callback) { callback(true); }
                },
                nzOnCancel() {
                    if (callback) { callback(false); }
                }
            });
        } else {
            this._modalService.confirm({
                nzTitle: <any>abp.localization.localize('AreYouSure', AppConsts.localization.defaultLocalizationSourceName),
                nzContent: message,
                nzOnOk() {
                    if (titleOrCallBack) { titleOrCallBack(true); }
                },
                nzOnCancel() {
                    if (titleOrCallBack) { titleOrCallBack(false); }
                }
            });
        }
    }
}
