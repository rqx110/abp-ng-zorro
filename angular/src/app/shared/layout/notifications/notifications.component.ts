import { Component, Injector, ViewEncapsulation, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { NotificationServiceProxy, UserNotification, UserNotificationState } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { IFormattedUserNotification, UserNotificationHelper } from './UserNotificationHelper';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class NotificationsComponent extends PagedListingComponentBase<any> implements OnInit {

    readStateFilter = 'ALL';
    dateRange: Date[] = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper,
    ) {
        super(injector);
    }

    onSearch(): void {
        this.refresh();
    }

    setAsRead(record: any): void {
        this.setNotificationAsRead(record, () => {
            this.refresh();
        });
    }

    isRead(record: any): boolean {
        return record.formattedNotification.state === 'READ';
    }

    fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }

    formatRecord(record: any): IFormattedUserNotification {
        return this._userNotificationHelper.format(record, false);
    }

    formatNotification(record: any): string {
        const formattedRecord = this.formatRecord(record);
        return abp.utils.truncateStringWithPostfix(formattedRecord.text, 120);
    }

    formatNotifications(records: any[]): any[] {
        const formattedRecords = [];
        for (const record of records) {
            record.formattedNotification = this.formatRecord(record);
            formattedRecords.push(record);
        }
        return formattedRecords;
    }

    truncateString(text: any, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this._notificationService.getUserNotifications(
            this.readStateFilter === 'ALL' ? undefined : UserNotificationState.Unread,
            moment(this.dateRange[0]),
            moment(this.dateRange[1]).endOf('day'),
            request.maxResultCount,
            request.skipCount,
        )
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = this.formatNotifications(result.items);
                this.showPaging(result);
            });
    }

    setAllNotificationsAsRead(): void {
        this._userNotificationHelper.setAllAsRead(() => {
            this.refresh();
        });
    }

    openNotificationSettingsModal(): void {
        this._userNotificationHelper.openSettingsModal();
    }

    setNotificationAsRead(userNotification: UserNotification, callback: () => void): void {
        this._userNotificationHelper
            .setAsRead(userNotification.id, () => {
                if (callback) {
                    callback();
                }
            });
    }

    deleteNotification(userNotification: UserNotification): void {
        this._notificationService.deleteNotification(userNotification.id)
            .subscribe(() => {
                this.refresh();
                this.notify.success(this.l('SuccessfullyDeleted'));
            });
    }

    public getRowClass(formattedRecord: IFormattedUserNotification): string {
        return formattedRecord.state === 'READ' ? 'notification-read' : '';
    }
}
