import { Component, OnInit, Injector } from '@angular/core';
import { UserLoginServiceProxy, UserLoginAttemptDto } from '@shared/service-proxies/service-proxies';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { DateTimeService } from '../common/timing/date-time.service';

@Component({
  selector: 'app-login-attempts-modal',
  templateUrl: './login-attempts-modal.component.html',
  styles: []
})
export class LoginAttemptsModalComponent extends ModalComponentBase implements OnInit {

  userLoginAttempts: UserLoginAttemptDto[];

  constructor(
    _injector: Injector,
    private userLoginService: UserLoginServiceProxy,
    private _dateTimeService: DateTimeService
  ) {
    super(_injector);
  }

  ngOnInit() {
    this.userLoginService.getRecentUserLoginAttempts()
      .subscribe(result => {
        this.userLoginAttempts = result.items;
      });
  }

  getLoginAttemptTime(userLoginAttempt: UserLoginAttemptDto): string {
    return this._dateTimeService.fromNow(userLoginAttempt.creationTime) + ' (' + this._dateTimeService.formatDate(userLoginAttempt.creationTime, 'yyyy-LL-dd hh:mm:ss') + ')';
  }

}
