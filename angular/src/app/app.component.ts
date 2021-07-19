import { Component, OnInit, NgZone, Injector } from '@angular/core';
import { environment } from '@env/environment';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SignalRHelper } from '@shared/helpers/SignalRHelper';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';

@Component({
    selector: 'app-app',
    templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
    installationMode = true;
    IsSessionTimeOutEnabled: boolean = this.setting.getBoolean('App.UserManagement.SessionTimeOut.IsEnabled') && this.appSession.userId != null;

    options: LayoutDefaultOptions = {
        logoExpanded: `./assets/logo-full.svg`,
        logoCollapsed: `./assets/logo.svg`,
      };
    showSettingDrawer = !environment.production;

    constructor(
        injector: Injector,
        public _zone: NgZone,
        _appNavigationService: AppNavigationService
    ) {
        super(injector);

        _appNavigationService.mapToNgAlainMenu();
    }

    ngOnInit(): void {
        this.installationMode = UrlHelper.isInstallUrl(location.href);

        if (this.appSession.application) {
            SignalRHelper.initSignalR(() => {
                this._zone.runOutsideAngular(() => {
                    abp.signalr.connect();
                });
            });
        }
    }
}
