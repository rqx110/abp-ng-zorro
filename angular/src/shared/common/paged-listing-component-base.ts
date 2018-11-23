import { AppComponentBase } from '@shared/common/app-component-base';
import { Injector, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

export class PagedResultDto {
    items: any[];
    totalCount: number;
}

export class EntityDto {
    id: number;
}

export class PagedRequestDto {
    skipCount: number;
    maxResultCount: number;
    sorting: string;
}

export abstract class PagedListingComponentBase<EntityDto> extends AppComponentBase implements OnInit {

    public pageSize = AppConsts.grid.defaultPageSize;
    public pageNumber = 1;
    public totalPages = 1;
    public totalItems: number;
    public isTableLoading = true;
    public allChecked = false;
    public allCheckboxDisabled = false;
    public checkboxIndeterminate = false;
    public selectedDataItems: any[] = [];
    public sorting: string = undefined;
    filterText = '';
    dataList: EntityDto[] = [];

    public booleanFilterList: any[] = [
        { text: this.l('All'), value: 'All' },
        { text: this.l('Yes'), value: true },
        { text: this.l('No'), value: false },
    ];

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

    public getDataPage(page: number): void {
        const req = new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        req.skipCount = (page - 1) * this.pageSize;
        req.sorting = this.sorting;
        this.isTableLoading = true;
        this.fetchDataList(req, page, () => {
            this.isTableLoading = false;
            // 更新全选框禁用状态
            this.refreshAllCheckBoxDisabled();
        });
    }

    refreshAllCheckBoxDisabled(): void {
        this.allCheckboxDisabled = this.dataList.length <= 0;
    }
    public pageNumberChange(): void {
        if (this.pageNumber > 0) {
            this.restCheckStatus(this.dataList);
            this.getDataPage(this.pageNumber);
        }
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

    public showPaging(result: PagedResultDto): void {
        this.totalItems = result.totalCount;
    }

    gridSort(sort: { key: string; value: string }) {
        this.sorting = undefined;
        let ascOrDesc = sort.value; // 'ascend' or 'descend' or null
        const filedName = sort.key;
        if (ascOrDesc) {
            ascOrDesc = abp.utils.replaceAll(ascOrDesc, 'end', '');
            const args = ['{0} {1}', filedName, ascOrDesc];
            const sortingStr = abp.utils.formatString.apply(this, args);
            this.sorting = sortingStr;
        }
        this.refresh();
    }

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }
        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }
        return false;
    }

    protected abstract fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void;
}
