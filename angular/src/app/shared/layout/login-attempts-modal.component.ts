import { Component, OnInit, Injector } from '@angular/core';
import { UserLoginServiceProxy, UserLoginAttemptDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { ModalComponentBase } from '@shared/common/modal-component-base';

@Component({
  selector: 'app-login-attempts-modal',
  templateUrl: './login-attempts-modal.component.html',
  styles: []
})
export class LoginAttemptsModalComponent extends ModalComponentBase implements OnInit {

  userLoginAttempts: UserLoginAttemptDto[];

  constructor(
    _injector: Injector,
    private userLoginService: UserLoginServiceProxy
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
    return moment(userLoginAttempt.creationTime).fromNow() + ' (' + moment(userLoginAttempt.creationTime).format('YYYY-MM-DD hh:mm:ss') + ')';
  }

}
