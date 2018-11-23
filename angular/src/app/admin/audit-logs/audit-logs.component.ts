import { Component, OnInit, Injector } from '@angular/core';
import {
    AuditLogListDto,
    AuditLogServiceProxy,
} from '@shared/service-proxies/service-proxies';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import { AuditLogDetailModalComponent } from './audit-logs-detail/audit-logs-detail-modal.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-audit-logs',
    templateUrl: './audit-logs.component.html',
    styles: [`
        .ant-calendar-picker
        {
            width:100%;
        }
    `],
})
export class AuditLogsComponent extends PagedListingComponentBase<AuditLogListDto> implements OnInit {
    startToEndDate: Date[] = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];
    advancedFiltersVisible = false;
    username: string;
    serviceName: string;
    methodName: string;
    browserInfo: string;
    hasException: boolean = undefined;
    minExecutionDuration: number;
    maxExecutionDuration: number;
    exporting = false;

    constructor(
        injector: Injector,
        private _auditLogService: AuditLogServiceProxy,
        private _fileDownloadService: FileDownloadService
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
        this._auditLogService
            .getAuditLogs(
                moment(this.startToEndDate[0]),
                moment(this.startToEndDate[1]),
                this.username,
                this.serviceName,
                this.methodName,
                this.browserInfo,
                this.hasException,
                this.minExecutionDuration,
                this.maxExecutionDuration,
                undefined,
                request.maxResultCount,
                request.skipCount,
            )
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    showDetails(item: AuditLogListDto): void {
        this.modalHelper
            .create(AuditLogDetailModalComponent, { auditLog: item })
            .subscribe(result => { });
    }

    exportToExcelAuditLogs(): void {
        const self = this;
        this.exporting = true;
        self._auditLogService.getAuditLogsToExcel(
            moment(self.startToEndDate[0]),
            moment(self.startToEndDate[1]),
            self.username,
            self.serviceName,
            self.methodName,
            self.browserInfo,
            self.hasException,
            self.minExecutionDuration,
            self.maxExecutionDuration,
            undefined,
            1,
            0)
            .pipe(finalize(() => this.exporting = false))
            .subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }
}
