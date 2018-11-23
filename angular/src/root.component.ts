import { Component, OnInit } from '@angular/core';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { MessageProviderHelper } from '@shared/helpers/MessageProviderHelper';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
})
export class RootComponent implements OnInit {
    constructor(
        private _modalService: NzModalService,
        private _messageService: NzMessageService,
        private _notifyService: NzNotificationService,
    ) {}

    ngOnInit(): void {
        MessageProviderHelper.useNgZorroMessage(this._messageService, this._modalService);
        MessageProviderHelper.useNgZorroNotify(this._notifyService);
    }
}
