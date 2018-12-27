import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { ComboboxItemDto, CommonLookupServiceProxy, CreateOrUpdateEditionDto, EditionEditDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { FeatureTreeComponent } from '../shared/feature-tree/feature-tree.component';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';


@Component({
    selector: 'createOrEditEditionModal',
    templateUrl: './create-or-edit-edition-modal.component.html'
})
export class CreateOrEditEditionModalComponent extends ModalComponentBase implements OnInit {

    @ViewChild('featureTree') featureTree: FeatureTreeComponent;

    saving = false;
    editionId?: number;
    edition: EditionEditDto = new EditionEditDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = false;
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
                this.edition = editionResult.edition;
                this.featureTree.editData = editionResult;

                if (this.edition.expiringEditionId === null) {
                    this.edition.expiringEditionId = 0;
                }

                this.expireAction = this.edition.expiringEditionId > 0 ? AppEditionExpireAction.AssignToAnotherEdition : AppEditionExpireAction.DeactiveTenant;

                this.isFree = !editionResult.edition.monthlyPrice && !editionResult.edition.annualPrice;
                this.isTrialActive = editionResult.edition.trialDayCount > 0;
                this.isWaitingDayActive = editionResult.edition.waitingDayAfterExpire > 0;
            });
        });
    }

    resetPrices(isFree) {
        if (isFree) {
            this.edition.annualPrice = undefined;
            this.edition.monthlyPrice = undefined;
        }
    }

    removeExpiringEdition(expireAction: AppEditionExpireAction) {
        if (expireAction === AppEditionExpireAction.DeactiveTenant) {
            this.edition.expiringEditionId = null;
        }
    }

    save(): void {
        if (!this.featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }

        if (this.edition.expiringEditionId === 0) {
            this.edition.expiringEditionId = null;
        }

        const input = new CreateOrUpdateEditionDto();
        input.edition = this.edition;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._editionService.createOrUpdateEdition(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();
            });
    }
}
