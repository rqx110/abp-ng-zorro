import { finalize } from 'rxjs/operators';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import {
    RoleEditDto,
    RoleServiceProxy,
    CreateOrUpdateRoleInput,
    UserEditDto,
} from '@shared/service-proxies/service-proxies';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree/permission-tree.component';

import { ModalComponentBase } from '@shared/common/modal-component-base';

@Component({
    selector: 'createOrEditRoleModal',
    templateUrl: './create-or-edit-role-modal.component.html',
    styles: [],
})
export class CreateOrEditRoleModalComponent extends ModalComponentBase implements OnInit {
    @ViewChild('permissionTree', { static: true })
    permissionTree: PermissionTreeComponent;

    roleId?: number;
    user: UserEditDto = new UserEditDto();
    role: RoleEditDto = new RoleEditDto();
    saving = false;

    constructor(injector: Injector, private _roleService: RoleServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.init();
    }

    init(): void {
        const self = this;

        self._roleService.getRoleForEdit(self.roleId).subscribe(result => {
            self.role = result.role;

            self.permissionTree.editData = result;
        });
    }

    save(): void {
        const input: CreateOrUpdateRoleInput = new CreateOrUpdateRoleInput();
        input.role = this.role;
        input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
        this.saving = true;
        this._roleService
            .createOrUpdateRole(input)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.success();
            });
    }
}
