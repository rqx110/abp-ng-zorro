import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'edition-combo',
    template:
    `<nz-select [(ngModel)]="selectedEdition" (ngModelChange)="selectedEditionChange.emit($event)">
        <nz-option *ngFor="let edition of editions" [nzLabel]="edition.displayText" [nzValue]="edition.value"></nz-option>
    </nz-select>`
})
export class EditionComboComponent extends AppComponentBase implements OnInit {

    editions: ComboboxItemDto[] = [];

    @Input() selectedEdition: string = undefined;
    @Output() selectedEditionChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private _editionService: EditionServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this._editionService.getEditionComboboxItems(0, true, false).subscribe(editions => {
            this.editions = editions;
        });
    }
}
