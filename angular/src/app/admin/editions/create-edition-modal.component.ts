import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { ComboboxItemDto, CommonLookupServiceProxy, CreateEditionDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { FeatureTreeComponent } from '../shared/feature-tree/feature-tree.component';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';


@Component({
    selector: 'createEditionModal',
    templateUrl: './create-edition-modal.component.html'
})
export class CreateEditionModalComponent extends ModalComponentBase implements OnInit {

    @ViewChild('featureTree', { static: true }) featureTree: FeatureTreeComponent;

    saving = false;
    editionId?: number;
    edition: CreateEditionDto = new CreateEditionDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = true;
    isTrialActive = false;
    isWaitingDayActive = false;

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.init();
    }

    init(): void {

        this._commonLookupService.getEditionsForCombobox(true).subscribe(editionsResult => {
            this.expiringEditions = editionsResult.items;
            this.expiringEditions.unshift(new ComboboxItemDto({ value: '0', displayText: this.l('NotAssigned'), isSelected: true }));

            this._editionService.getEditionForEdit(this.editionId).subscribe(editionResult => {
                this.featureTree.editData = editionResult;
            });
        });
    }

    resetPrices(isFree) {
        if (isFree) {
            this.edition.edition.annualPrice = undefined;
            this.edition.edition.monthlyPrice = undefined;
        }
    }

    removeExpiringEdition(expireAction: AppEditionExpireAction) {
        if (expireAction === AppEditionExpireAction.DeactiveTenant) {
            this.edition.edition.expiringEditionId = null;
        }
    }

    save(): void {
        if (!this.featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }

        if (this.edition.edition.expiringEditionId === 0) {
            this.edition.edition.expiringEditionId = null;
        }

        const input = new CreateEditionDto();
        input.edition = this.edition.edition;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._editionService.createEdition(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();
            });
    }
}
