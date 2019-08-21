import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { ComboboxItemDto, UpdateEditionDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { FeatureTreeComponent } from '../shared/feature-tree/feature-tree.component';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';


@Component({
    selector: 'editEditionModal',
    templateUrl: './edit-edition-modal.component.html'
})
export class EditEditionModalComponent extends ModalComponentBase implements OnInit {

    @ViewChild('featureTree', { static: true }) featureTree: FeatureTreeComponent;

    saving = false;
    editionId?: number;
    edition: UpdateEditionDto = new UpdateEditionDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = false;
    isTrialActive = false;
    isWaitingDayActive = false;

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.init();
    }

    init(): void {

        this._editionService.getEditionForEdit(this.editionId).subscribe(editionResult => {
            this.featureTree.editData = editionResult;
            this.edition.edition = editionResult.edition;
        });
    }

    save(): void {
        const input = new UpdateEditionDto();
        input.edition = this.edition.edition;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._editionService.updateEdition(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();
            });
    }
}
