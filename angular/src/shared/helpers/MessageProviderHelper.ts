import { NzMessageService, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { AppConsts } from '@shared/AppConsts';

export class MessageProviderHelper {
    static useNgZorroMessage(_nzMessageService: NzMessageService, _nzModalService?: NzModalService) {
        if (_nzModalService) {
            if ((<any>abp).nzModal) {
                return;
            }

            (<any>abp).nzModal = _nzModalService;
        }

        if ((<any>abp).nzMessage) {
            return;
        }
        (<any>abp).nzMessage = _nzMessageService;

        abp.message.info = (message: string, title?: string) => {
            (<any>abp).nzMessage.info(message);
        };

        abp.message.warn = (message: string, title?: string) => {
            (<any>abp).nzMessage.warning(message);
        };
        abp.message.error = (message: string, title?: string) => {
            (<any>abp).nzMessage.error(message);
        };
        abp.message.success = (message: string, title?: string) => {
            (<any>abp).nzMessage.success(message);
        };
        abp.message.confirm = MessageProviderHelper.confirm;
    }

    static replaceAbpMessageByNgModal(_nzModalService: NzModalService) {
        if ((<any>abp).nzModal) {
            return;
        }

        (<any>abp).nzModal = _nzModalService;

        abp.message.info = (message: string, title?: string) => {
            (<any>abp).nzModal.info({
                nzTitle: title,
                nzContent: message,
                nzMask: true,
            });
        };

        abp.message.warn = (message: string, title?: string) => {
            (<any>abp).nzModal.warning({
                nzTitle: title,
                nzContent: message,
                nzMask: true,
            });
        };
        abp.message.error = (message: string, title?: string) => {
            (<any>abp).nzModal.error({
                nzTitle: title,
                nzContent: message,
                nzMask: true,
            });
        };
        abp.message.success = (message: string, title?: string) => {
            (<any>abp).nzModal.success({
                nzTitle: title,
                nzContent: message,
                nzMask: true,
            });
        };
        abp.message.confirm = MessageProviderHelper.confirm;
    }

    static useNgZorroNotify(_nzNotificationService: NzNotificationService) {
        if ((<any>abp).nzNotify) {
            return;
        }

        (<any>abp).nzNotify = _nzNotificationService;

        abp.notify.info = (message: string, title?: string, options?: any) => {
            (<any>abp).nzNotify.info(message, title, options);
        };
        abp.notify.warn = (message: string, title?: string, options?: any) => {
            (<any>abp).nzNotify.warning(message, title, options);
        };
        abp.notify.error = (message: string, title?: string, options?: any) => {
            (<any>abp).nzNotify.error(message, title, options);
        };
        abp.notify.success = (message: string, title?: string, options?: any) => {
            (<any>abp).nzNotify.success(message, title, options);
        };
    }

    private static confirm(message: string, titleOrCallback?: string | ((result: boolean) => void), callback?: (result: boolean) => void): any {
        if (titleOrCallback && !(typeof titleOrCallback === 'string')) {
            callback = titleOrCallback;
        }

        (<any>abp).nzModal.confirm({
            nzTitle: titleOrCallback || <any>abp.localization.localize('AreYouSure', AppConsts.localization.defaultLocalizationSourceName),
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
    }
}
