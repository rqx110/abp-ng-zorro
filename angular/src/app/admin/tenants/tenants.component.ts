import { Component, Injector } from '@angular/core';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import {
    TenantServiceProxy,
    TenantListDto,
    EntityDtoOfInt64,
} from '@shared/service-proxies/service-proxies';
import { CreateTenantModalComponent } from './create-tenant-modal.component';
import { finalize } from 'rxjs/operators';
import { EditTenantModalComponent } from './edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenant-features-modal.component';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    selector: 'app-tenants',
    templateUrl: './tenants.component.html',
    styles: [],
})
export class TenantsComponent extends PagedListingComponentBase<TenantListDto> {
    advancedFiltersVisible = false;
    
    subscriptionDateRange = [];
    creationDateRange = [];

    filters: {
        filterText: string;
        creationDateRangeActive: boolean;
        subscriptionEndDateRangeActive: boolean;
        selectedEditionId: number;
    } = <any>{};

    constructor(injector: Injector, 
        private _tenantService: TenantServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this._tenantService
            .getTenants(
                this.filters.filterText,
                this.filters.subscriptionEndDateRangeActive ? this._dateTimeService.getStartOfDayForDate(this.subscriptionDateRange[0]) : undefined,
                this.filters.subscriptionEndDateRangeActive ? this._dateTimeService.getEndOfDayForDate(this.subscriptionDateRange[1]) : undefined,
                this.filters.creationDateRangeActive ? this._dateTimeService.getStartOfDayForDate(this.creationDateRange[0]) : undefined,
                this.filters.creationDateRangeActive ? this._dateTimeService.getEndOfDayForDate(this.creationDateRange[1]) : undefined,
                this.filters.selectedEditionId,
                this.filters.selectedEditionId !== undefined && (this.filters.selectedEditionId + '') !== '-1',
                request.sorting,
                request.maxResultCount,
                request.skipCount,
            )
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    unlockUser(tenant: TenantListDto): void {
        this._tenantService.unlockTenantAdmin(new EntityDtoOfInt64({ id: tenant.id })).subscribe(() => {
            this.notify.success(this.l('UnlockedTenandAdmin', tenant.name));
        });
    }

    changeFeatures(tenant: TenantListDto): void {
        this.modalHelper.createStatic(TenantFeaturesModalComponent, {
            tenantId: tenant.id,
            tenantName: tenant.name
        }, {size: 'md'})
            .subscribe(() => { this.refresh(); });
     }

    editTenant(tenant: TenantListDto): void {
        this.modalHelper.createStatic(EditTenantModalComponent, {
            tenantId: tenant.id
        }, {size: 'md'})
            .subscribe(() => { this.refresh(); });
    }

    delete(tenant: TenantListDto): void {
        this._tenantService.deleteTenant(tenant.id).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }
    create(): void {
        this.modalHelper.createStatic(CreateTenantModalComponent, null, {size: 'md'}).subscribe(res => {
            if (res) {
                this.refresh();
            }
        });
    }

    batchDelete(): void {
        this.message.warn('method not implement!');
    }
}
