import { ModalComponentBase } from '@shared/common/modal-component-base';
import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree/permission-tree.component';
import {
    UserServiceProxy,
    UpdateUserPermissionsInput,
    EntityDtoOfInt64,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'editUserPermissionsModal',
    templateUrl: './edit-user-permissions-modal.component.html',
    styles: [],
})
export class EditUserPermissionsModalComponent extends ModalComponentBase implements OnInit {
    @ViewChild('permissionTree', { static: true }) permissionTree: PermissionTreeComponent;

    userId: number;
    userName?: string;

    saving = false;
    resettingPermissions = false;

    constructor(injector: Injector, private _userService: UserServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        const self = this;

        self._userService
            .getUserPermissionsForEdit(self.userId)
            .subscribe(result => {
                this.permissionTree.editData = result;
            });
    }

    save(): void {
        this.saving = true;
        const input = new UpdateUserPermissionsInput();
        input.id = this.userId;
        input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();

        this._userService
            .updateUserPermissions(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.success();
            });
    }

    resetPermissions(): void {
        const input = new EntityDtoOfInt64();
        input.id = this.userId;

        this.resettingPermissions = true;
        this._userService
            .resetUserSpecificPermissions(input)
            .pipe(finalize(() => this.resettingPermissions = false))
            .subscribe(() => {
                this.notify.info(this.l('ResetSuccessfully'));
                this._userService
                    .getUserPermissionsForEdit(this.userId)
                    .subscribe(result => {
                        this.permissionTree.editData = result;
                    });
            });
    }
}
