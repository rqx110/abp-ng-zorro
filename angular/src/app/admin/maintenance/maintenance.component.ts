import { Component, OnInit, Injector } from '@angular/core';
import { CachingServiceProxy, EntityDtoOfString, WebLogServiceProxy, CacheDto } from '@shared/service-proxies/service-proxies';
import { escape as _escape } from 'lodash-es';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.less'],
})
export class MaintenanceComponent extends PagedListingComponentBase<CacheDto> implements OnInit {
    logs: any = '';
    constructor(
        injector: Injector,
        private cacheService: CachingServiceProxy,
        private _webLogService: WebLogServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
        this.getWebLogs();
    }
    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this.cacheService
            .getAllCaches()
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
            });
    }

    clearCache(cacheName): void {
        const input = new EntityDtoOfString();
        input.id = cacheName;

        this.cacheService.clearCache(input).subscribe(() => {
            this.notify.success(this.l('CacheSuccessfullyCleared'));
        });
    }

    clearAllCaches(): void {
        this.cacheService.clearAllCaches().subscribe(() => {
            this.notify.success(this.l('AllCachesSuccessfullyCleared'));
        });
    }

    getWebLogs(): void {
        this._webLogService.getLatestWebLogs().subscribe(result => {
            this.logs = result.latestWebLogLines;
        });
    }

    downloadWebLogs = function () {
        this._webLogService.downloadWebLogs().subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    };

    getLogClass(log: string): string {
        if (log.startsWith('DEBUG')) {
            return 'badge badge-grey';
        }

        if (log.startsWith('INFO')) {
            return 'badge badge-success';
        }

        if (log.startsWith('WARN')) {
            return 'badge badge-warning';
        }

        if (log.startsWith('ERROR') || log.startsWith('FATAL')) {
            return 'badge badge-error';
        }

        return '';
    }

    getLogType(log: string): string {
        if (log.startsWith('DEBUG')) {
            return 'DEBUG';
        }

        if (log.startsWith('INFO')) {
            return 'INFO';
        }

        if (log.startsWith('WARN')) {
            return 'WARN';
        }

        if (log.startsWith('ERROR')) {
            return 'ERROR';
        }

        if (log.startsWith('FATAL')) {
            return 'FATAL';
        }

        return '';
    }

    getRawLogContent(log: string): string {
        return _escape(log)
            .replace('DEBUG', '')
            .replace('INFO', '')
            .replace('WARN', '')
            .replace('ERROR', '')
            .replace('FATAL', '');
    }
}
