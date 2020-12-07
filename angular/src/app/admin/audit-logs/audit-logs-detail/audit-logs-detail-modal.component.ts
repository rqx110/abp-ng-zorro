import { Component, OnInit, Input, Injector } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { AuditLogListDto } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'auditLogDetailModal',
  templateUrl: './audit-logs-detail-modal.component.html',
  styles: []
})
export class AuditLogDetailModalComponent extends ModalComponentBase {

  @Input() auditLog: AuditLogListDto;

  constructor(
    injector: Injector,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  getExecutionTime(): string {
    const self = this;
    return this._dateTimeService.fromNow(self.auditLog.executionTime) + ' (' + this._dateTimeService.formatDate(self.auditLog.executionTime, 'yyyy-LL-dd HH:mm:ss') + ')';
  }

  getDurationAsMs(): string {
    const self = this;
    return self.l('Xms', self.auditLog.executionDuration);
  }

  getFormattedParameters(): string {
    const self = this;
    try {
      const json = JSON.parse(self.auditLog.parameters);
      return JSON.stringify(json, null, 4);
    } catch (e) {
      return self.auditLog.parameters;
    }
  }

}
