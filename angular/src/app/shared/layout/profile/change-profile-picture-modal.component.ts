import { TokenService, IAjaxResponse } from 'abp-ng2-module';

import { Component, Injector, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { ProfileServiceProxy, UpdateProfilePictureInput } from '@shared/service-proxies/service-proxies';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
    selector: 'changeProfilePictureModal',
    templateUrl: './change-profile-picture-modal.component.html'
})
export class ChangeProfilePictureModalComponent extends ModalComponentBase implements OnInit {

    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving = false;

    maxProfilPictureBytesUserFriendlyValue = 5;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};

    imageChangedEvent: any = '';

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _tokenService: TokenService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.initializeModal();
    }

    initializeModal(): void {
        this.temporaryPictureUrl = '';
        this.temporaryPictureFileName = '';
        this.initFileUploader();
    }

    close(): void {
        this.imageChangedEvent = '';
        this.uploader.clearQueue();
        this.success();
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCroppedFile(event: ImageCroppedEvent) {
        this.uploader.clearQueue();
        this.uploader.addToQueue([<File>base64ToFile(event.base64)]);
    }

    initFileUploader(): void {
        this.uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture' });
        this._uploaderOptions.autoUpload = false;
        this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        this._uploaderOptions.removeAfterUpload = true;
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
            form.append('FileType', fileItem.file.type);
            form.append('FileName', 'ProfilePicture');
            form.append('FileToken', this.guid());
        };

        this.uploader.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                this.updateProfilePicture(resp.result.fileToken);
            } else {
                this.message.error(resp.error.message);
            }
        };

        this.uploader.setOptions(this._uploaderOptions);
    }

    updateProfilePicture(fileToken: string): void {
        const input = new UpdateProfilePictureInput();
        input.fileToken = fileToken;
        input.x = 0;
        input.y = 0;
        input.width = 0;
        input.height = 0;

        this.saving = true;
        this._profileService.updateProfilePicture(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                abp.event.trigger('profilePictureChanged');
                this.close();
            });
    }

    guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    save(): void {
        this.uploader.uploadAll();
    }
}
