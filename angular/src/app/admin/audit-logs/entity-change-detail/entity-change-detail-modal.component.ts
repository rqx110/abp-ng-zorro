import { Component, OnInit, Input, Injector } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { EntityPropertyChangeDto, EntityChangeListDto, AuditLogServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'entityChangeDetailModal',
    templateUrl: './entity-change-detail-modal.component.html',
    styles: []
})
export class EntityChangeDetailModalComponent extends ModalComponentBase implements OnInit {

    @Input() entityChange: EntityChangeListDto;

    entityPropertyChanges: EntityPropertyChangeDto[];

    constructor(
        injector: Injector,
        private _auditLogService: AuditLogServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.init();
    }

    init(): void {
        const self = this;

        this._auditLogService.getEntityPropertyChanges(self.entityChange.id).subscribe((result) => {
            self.entityPropertyChanges = result;
        });
    }

    getPropertyChangeValue(propertyChangeValue, propertyTypeFullName) {
        if (!propertyChangeValue) {
            return propertyChangeValue;
        }
        propertyChangeValue = propertyChangeValue.replace(/^['"]+/g, '').replace(/['"]+$/g, '');
        if (this.isDate(propertyChangeValue, propertyTypeFullName)) {
            return this._dateTimeService.formatDate(propertyChangeValue, 'yyyy-LL-dd HH:mm:ss');
        }

        if (propertyChangeValue === 'null') {
            return '';
        }

        return propertyChangeValue;
    }

    isDate(date, propertyTypeFullName): boolean {
        return propertyTypeFullName.includes('DateTime') && !isNaN(Date.parse(date).valueOf());
    }
}
