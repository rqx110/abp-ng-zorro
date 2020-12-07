import { Component, OnInit, Injector } from '@angular/core';
import {
    EntityChangeListDto,
    NameValueDto,
    AuditLogServiceProxy,
} from '@shared/service-proxies/service-proxies';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';
import { EntityChangeDetailModalComponent } from './entity-change-detail/entity-change-detail-modal.component';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    selector: 'app-entity-change',
    templateUrl: './entity-change.component.html',
    styles: [`
        .ant-calendar-picker
        {
            width:100%;
        }
    `],
})
export class EntityChangeComponent extends PagedListingComponentBase<EntityChangeListDto> implements OnInit {
    startToEndDate: Date[] = [this._dateTimeService.getStartOfDay().toJSDate(), this._dateTimeService.getEndOfDay().toJSDate()];
    username: string;
    minExecutionDuration: number;
    maxExecutionDuration: number;

    entityTypeFullName: string;
    objectTypes: NameValueDto[];

    exporting = false;

    constructor(
        injector: Injector,
        private _auditLogService: AuditLogServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this._auditLogService.getEntityHistoryObjectTypes()
            .subscribe((result) => {
                this.objectTypes = result;
            });

        this._auditLogService
            .getEntityChanges(
                this._dateTimeService.getStartOfDayForDate(this.startToEndDate[0]),
                this._dateTimeService.getEndOfDayForDate(this.startToEndDate[1]),
                this.username,
                this.entityTypeFullName,
                this.sorting,
                request.maxResultCount,
                request.skipCount,
            )
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    showEntityChangeDetails(item: EntityChangeListDto): void {
        this.modalHelper
            .create(EntityChangeDetailModalComponent, { entityChange: item })
            .subscribe(result => { });
    }

    exportToExcelEntityChanges(): void {
        const self = this;

        this.exporting = true;
        self._auditLogService.getEntityChangesToExcel(
            this._dateTimeService.getStartOfDayForDate(this.startToEndDate[0]),
            this._dateTimeService.getEndOfDayForDate(this.startToEndDate[1]),
            self.username,
            self.entityTypeFullName,
            undefined,
            1,
            0)
            .pipe(finalize(() => this.exporting = false))
            .subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
    }

}
