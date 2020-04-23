import { Component, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { timer, Subscription } from 'rxjs';
import { AppAuthService } from '../auth/app-auth.service';
import { SessionServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'session-timeout-modal',
    templateUrl: './session-timeout-modal.component.html'
})
export class SessionTimeoutModalComponent extends AppComponentBase implements OnDestroy {

    timeOutSecond = parseInt(this.s('App.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond')); // show inactivity modal when TimeOutSecond passed
    currentSecond: number;
    progresbarPercent = 100;
    private subscription: Subscription;
    isVisible = false;

    constructor(
        injector: Injector,
        private _appAuthService: AppAuthService,
        private _sessionService: SessionServiceProxy
    ) {
        super(injector);
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    start(): void {
        this.currentSecond = this.timeOutSecond;
        this.subscription = timer(0, 1000).subscribe(() => {
            this.changeNotifyContent();
        });
        this.isVisible = true;
    }

    stop(): void {
        this.currentSecond = this.timeOutSecond;
        if(this.subscription){
            this.subscription.unsubscribe();
        }
        this.isVisible = false;
    }

    private done(): void {
        this.stop();

        let isSessionLockScreenEnabled = abp.setting.getBoolean('App.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut');
        if (isSessionLockScreenEnabled) {
            this.redirectToLockScreen();
        } else {
            this._appAuthService.logout(true);
        }
    }

    private changeNotifyContent(): void {
        this.currentSecond--;
        if (this.currentSecond <= 0) {
            this.progresbarPercent = 0;
            this.done();
        } else {
            this.progresbarPercent = this.currentSecond / this.timeOutSecond * 100;
        }
    }

    private redirectToLockScreen(): void {
        this._sessionService.getCurrentLoginInformations()
            .subscribe(
                (info) => {
                    if (info) {
                        abp.utils.setCookieValue('userInfo', JSON.stringify(
                            {
                                userName: info.user.userName,
                                profilePictureId: info.user.profilePictureId,
                                tenant: info.tenant ? info.tenant.tenancyName : 'Host'
                            }), null, abp.appPath);
                        this._appAuthService.logout(true, '/account/session-locked');
                    } else {
                        this._appAuthService.logout(true);
                    }
                },
                () => {
                    this._appAuthService.logout(true);
                });
    }
}
