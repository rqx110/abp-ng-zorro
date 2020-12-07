import { Component, Injector, OnInit } from '@angular/core';
import { GetNotificationSettingsOutput, NotificationServiceProxy, NotificationSubscriptionDto, UpdateNotificationSettingsInput } from '@shared/service-proxies/service-proxies';
import { map as _map } from 'lodash-es';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';

@Component({
    selector: 'notificationSettingsModal',
    templateUrl: './notification-settings-modal.component.html'
})
export class NotificationSettingsModalComponent extends ModalComponentBase implements OnInit {

    saving = false;

    settings: GetNotificationSettingsOutput;

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getSettings(() => {
        });
    }

    save(): void {
        const input = new UpdateNotificationSettingsInput();
        input.receiveNotifications = this.settings.receiveNotifications;
        input.notifications = _map(this.settings.notifications,
            (n) => {
                let subscription = new NotificationSubscriptionDto();
                subscription.name = n.name;
                subscription.isSubscribed = n.isSubscribed;
                return subscription;
            });

        this.saving = true;
        this._notificationService.updateNotificationSettings(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();
            });
    }

    private getSettings(callback: () => void) {
        this._notificationService.getNotificationSettings().subscribe((result: GetNotificationSettingsOutput) => {
            this.settings = result;
            callback();
        });
    }
}
