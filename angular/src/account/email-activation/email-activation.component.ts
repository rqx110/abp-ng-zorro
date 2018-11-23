import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, SendEmailActivationLinkInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './email-activation.component.html'
})
export class EmailActivationComponent extends AppComponentBase {

    model: SendEmailActivationLinkInput = new SendEmailActivationLinkInput();
    saving = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    save(): void {
        this.saving = true;
        this._accountService.sendEmailActivationLink(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
                    this._router.navigate(['account/login']);
                });
            });
    }
}
