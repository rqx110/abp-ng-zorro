import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TransferService } from './transfer.service';
import { InstallServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './install.component.html',
    styleUrls: ['./install.component.less'],
    providers: [TransferService]
})
export class InstallComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _installSettingService: InstallServiceProxy,
        public item: TransferService
    ) {
        super(injector);
    }

    init(): void {
        this._installSettingService.checkDatabase()
            .subscribe(result => {
                if (result.isDatabaseExist) {
                    window.location.href = '/';
                }
            });
    }

    ngOnInit(): void {
        let self = this;
        self.init();
    }
}
