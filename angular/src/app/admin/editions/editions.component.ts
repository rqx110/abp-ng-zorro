import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditionListDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditEditionModalComponent } from './create-or-edit-edition-modal.component';
import { finalize } from 'rxjs/operators';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/common/paged-listing-component-base';

@Component({
    templateUrl: './editions.component.html',
    animations: [appModuleAnimation()]
})
export class EditionsComponent extends PagedListingComponentBase<EditionListDto>  {

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy
    ) {
        super(injector);
    }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this._editionService.getEditions()
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
            });
    }

    createEdition(): void {
        this.modalHelper.createStatic(CreateOrEditEditionModalComponent, null, { size: 'md' }).subscribe(res => {
            if (res) {
                this.refresh();
            }
        });
    }

    editEdition(edtion: EditionListDto): void {
        this.modalHelper.createStatic(CreateOrEditEditionModalComponent, {
            editionId: edtion.id
        }, { size: 'md' })
            .subscribe(() => { this.refresh(); });
    }

    deleteEdition(edition: EditionListDto): void {
        this._editionService.deleteEdition(edition.id).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }
}
