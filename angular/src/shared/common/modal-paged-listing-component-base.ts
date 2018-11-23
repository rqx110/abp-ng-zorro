import { ModalComponentBase } from '@shared/common/modal-component-base';
import { OnInit, Injector } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    PagedResultDto,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';

export abstract class ModalPagedListingComponentBase<EntityDto> extends ModalComponentBase implements OnInit {
    dataList: EntityDto[] = [];
    public pageSize = AppConsts.grid.defaultPageSize;
    public pageNumber = 1;
    public totalPages = 1;
    public totalItems: number;
    public sorting: string = undefined;
    filterText = '';
    public isTableLoading = false;
    public allChecked = false;
    public allCheckboxDisabled = false;
    public checkboxIndeterminate = false;
    public selectedDataItems: any[] = [];

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.pageNumber = 1;
        this.restCheckStatus(this.dataList);
        this.getDataPage(this.pageNumber);
    }

    public showPaging(result: PagedResultDto): void {
        this.totalItems = result.totalCount;
    }

    public getDataPage(page: number): void {
        const req = new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        req.skipCount = (page - 1) * this.pageSize;
        req.sorting = this.sorting;

        this.isTableLoading = true;
        this.getDataList(req, page, () => {
            this.isTableLoading = false;
            this.refreshAllCheckBoxDisabled();
        });
    }

    checkAll(value: boolean): void {
        this.dataList.forEach(data => ((<any>data).checked = this.allChecked));
        this.refreshCheckStatus(this.dataList);
    }

    refreshCheckStatus(entityList: any[]): void {
        // 是否全部选中
        const allChecked = entityList.every(value => value.checked === true);
        // 是否全部未选中
        const allUnChecked = entityList.every(value => !value.checked);
        // 是否全选
        this.allChecked = allChecked;
        // 全选框样式控制
        this.checkboxIndeterminate = !allChecked && !allUnChecked;
        // 已选中数据
        this.selectedDataItems = entityList.filter(value => value.checked);
    }

    restCheckStatus(entityList: any[]): void {
        this.allChecked = false;
        this.checkboxIndeterminate = false;
        // 已选中数据
        this.selectedDataItems = [];
        // 设置数据为未选中状态
        entityList.forEach(value => (value.checked = false));
    }

    refreshAllCheckBoxDisabled(): void {
        this.allCheckboxDisabled = this.dataList.length <= 0;
    }

    protected abstract getDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void;
}
