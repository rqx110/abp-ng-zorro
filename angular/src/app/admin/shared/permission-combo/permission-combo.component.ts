import {
    OnInit,
    Component,
    Input,
    Output,
    EventEmitter,
    Injector,
} from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    FlatPermissionWithLevelDto,
    PermissionServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { ArrayService } from '@delon/util';

@Component({
    selector: 'permission-combo',
    templateUrl: './permission-combo.component.html',
})
export class PermissionComboComponent extends AppComponentBase implements OnInit {
    permissions: FlatPermissionWithLevelDto[] = [];

    @Input()
    multiple = false;

    @Input()
    dropDownStyle: any = null;

    @Input()
    selectedPermission: any = undefined;

    @Output()
    selectedPermissionChange: EventEmitter<any> = new EventEmitter<any>();

    loading = false;

    _treeData: NzTreeNode[] = [];

    constructor(
        private _permissionService: PermissionServiceProxy,
        private _arrayService: ArrayService,
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._permissionService.getAllPermissions().subscribe(result => {
            this.permissions = result.items;
            this.arrToTreeNode();
        });
    }

    arrToTreeNode(): void {
        this.loading = true;
        this._treeData = this._arrayService.arrToTreeNode(this.permissions, {
            idMapName: 'name',
            parentIdMapName: 'parentName',
            titleMapName: 'displayName',
            cb: (item) => { item.expanded = true }
        });

        setTimeout(() => {
            this.loading = false;
        }, 500);
    }

    selectedChange(selectKey: any) {
        this.selectedPermissionChange.emit(selectKey || undefined);
    }
}
