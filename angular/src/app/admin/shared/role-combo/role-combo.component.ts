import {
    Component,
    OnInit,
    Injector,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    RoleServiceProxy,
    RoleListDto,
    GetRolesInput,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'role-combo',
    templateUrl: './role-combo.component.html',
})
export class RoleComboComponent extends AppComponentBase implements OnInit {
    roles: RoleListDto[] = [];

    @Input()
    dropDownStyle: any = null;

    @Input()
    selectMode: 'multiple' | 'tags' | 'default' = 'multiple';

    @Input()
    selectedRole: any = undefined;

    @Output()
    selectedRoleChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _roleService: RoleServiceProxy, injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this._roleService.getRoles(new GetRolesInput({permissions: []})).subscribe(result => {
            this.roles = result.items;
        });
    }

    selectedChange(selectKey: any) {
        this.selectedRoleChange.emit(selectKey);
    }
}
