import { Component, Injector, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SessionTimeoutModalComponent } from './session-timeout-modal-component';
import { timer, fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { LocalStorageService } from '@shared/utils/local-storage.service';

@Component({
  selector: 'session-timeout',
  template: '<session-timeout-modal></session-timeout-modal>'
})
export class SessionTimeoutComponent extends AppComponentBase implements AfterViewInit, OnDestroy {

  @ViewChild(SessionTimeoutModalComponent, { static: false })
  private sessionTimeOutModal: SessionTimeoutModalComponent;

  destroy$ = new Subject();

  private timeOutSecond = parseInt(this.s('App.UserManagement.SessionTimeOut.TimeOutSecond')); // show inactivity modal when TimeOutSecond passed
  private lastActivityTimeStorageKey = 'Abp.SessionTimeOut.UserLastActivityTime';

  private IsUserActive = true;
  private notifierIsOpened = false;
  private subscriptions: Subscription[] = [];

  constructor(
    injector: Injector,
    private _localStorageService: LocalStorageService
  ) {
    super(injector);
  }

  ngAfterViewInit() {
    this.bindActions();
    this.writeToStorage(); // initialize store
    this.subscriptions.push(timer(1000, 1000).subscribe(() => {
      this.control();
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private bindActions(): void {
    this.subscriptions.push(fromEvent(window, 'mousemove')
      .pipe(takeUntil(this.destroy$), debounceTime(350))
      .subscribe(() => {
        this.setUserActivity();
      }));

    this.subscriptions.push(fromEvent(window, 'mousedown')
      .pipe(takeUntil(this.destroy$), debounceTime(350))
      .subscribe(() => {
        this.setUserActivity();
      }));

    this.subscriptions.push(fromEvent(window, 'click')
      .pipe(takeUntil(this.destroy$), debounceTime(350))
      .subscribe(() => {
        this.setUserActivity();
      }));

    this.subscriptions.push(fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$), debounceTime(350))
      .subscribe(() => {
        this.setUserActivity();
      }));

    this.subscriptions.push(fromEvent(window, 'keypress')
      .pipe(takeUntil(this.destroy$), debounceTime(350))
      .subscribe(() => {
        this.setUserActivity();
      }));
  }

  private setUserActivity(): void {
    this.IsUserActive = true;
  }

  private control(): void {
    this.writeToStorage();
    this.controlStorage();
  }

  private writeToStorage(): void {
    if (this.IsUserActive) {
      if (localStorage) {
        this._localStorageService.setItem(this.lastActivityTimeStorageKey, Date.now().toString());
      } else {
        abp.utils.setCookieValue(this.lastActivityTimeStorageKey, Date.now().toString());
      }
    }
    this.IsUserActive = false;
  }

  private controlStorage(): void {
    if (localStorage) {
      this._localStorageService.getItem(this.lastActivityTimeStorageKey, (err, data) => {
        if (data) {
          let lastActivityTime = parseInt(data);
          this.controlValue(lastActivityTime);
        }
      });
    } else {
      let lastActivityTime = parseInt(abp.utils.getCookieValue(this.lastActivityTimeStorageKey));
      this.controlValue(lastActivityTime);
    }
  }
  private controlValue(lastActivityTime) {
    if (Date.now() - lastActivityTime <= this.timeOutSecond * 1000) {
      if (this.notifierIsOpened) {
        this.sessionTimeOutModal.stop();
        this.notifierIsOpened = false;
      }
      return;
    }

    if (!this.notifierIsOpened) {
      this.sessionTimeOutModal.start();
      this.notifierIsOpened = true;
    }
  }
}
