import { Component, Injector } from '@angular/core';
import { ProfileServiceProxy, VerifySmsCodeInputDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';

@Component({
    selector: 'smsVerificationModal',
    templateUrl: './sms-verification-modal.component.html'
})
export class SmsVerificationModalComponent  extends ModalComponentBase {
    public active = false;
    public saving = false;
    public verifyCode: VerifySmsCodeInputDto = new VerifySmsCodeInputDto();

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    save(): void {
        this.saving = true;
        this._profileService.verifySmsCode(this.verifyCode)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.success();
            });
    }
}
