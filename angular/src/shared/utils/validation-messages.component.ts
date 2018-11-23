import { Component, Input } from '@angular/core';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import * as _ from 'lodash';

class ErrorDef {
    error: string;
    localizationKey: string;
    errorProperty: string;
}

@Component({
    selector: '<validation-messages>',
    template: `
        <ng-container *ngIf="formCtrl.invalid && (formCtrl.dirty || formCtrl.touched)">
            <div *ngFor="let errorDef of errorDefsInternal">
                <span *ngIf="getErrorDefinitionIsInValid(errorDef)">
                    {{getErrorDefinitionMessage(errorDef)}}
                </span>
            </div>
        </ng-container>
    `,
})
export class ValidationMessagesComponent {

    _errorDefs: ErrorDef[] = [];

    @Input() formCtrl;
    @Input() set errorDefs(value: ErrorDef[]) {
        this._errorDefs = value;
    }

    readonly standartErrorDefs: ErrorDef[] = [
        { error: 'required', localizationKey: 'ThisFieldIsRequired' } as ErrorDef,
        { error: 'minlength', localizationKey: 'PleaseEnterAtLeastNCharacter', errorProperty: 'requiredLength' } as ErrorDef,
        { error: 'maxlength', localizationKey: 'PleaseEnterNoMoreThanNCharacter', errorProperty: 'requiredLength' } as ErrorDef,
        { error: 'email', localizationKey: 'InvalidEmailAddress' } as ErrorDef,
        { error: 'pattern', localizationKey: 'InvalidPattern', errorProperty: 'requiredPattern' } as ErrorDef
    ];

    get errorDefsInternal(): ErrorDef[] {
        let standarts = _.filter(this.standartErrorDefs, (ed) => !_.find(this._errorDefs, (edC) => edC.error === ed.error));
        let all = <ErrorDef[]>_.concat(standarts, this._errorDefs);

        return all;
    }

    constructor(
        private appLocalizationService: AppLocalizationService
    ) { }

    getErrorDefinitionIsInValid(errorDef: ErrorDef): boolean {
        return !!this.formCtrl.errors[errorDef.error];
    }

    getErrorDefinitionMessage(errorDef: ErrorDef): string {
        const errorRequirement = this.formCtrl.errors[errorDef.error][errorDef.errorProperty];
        return !!errorRequirement
            ? this.appLocalizationService.l(errorDef.localizationKey, errorRequirement)
            : this.appLocalizationService.l(errorDef.localizationKey);
    }
}
