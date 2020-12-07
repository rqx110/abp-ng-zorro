import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Injector,
} from '@angular/core';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import {
    OrganizationUnitServiceProxy,
    OrganizationUnitRoleListDto,
    PagedResultDtoOfOrganizationUnitRoleListDto
} from '@shared/service-proxies/service-proxies';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { finalize } from 'rxjs/operators';
import { AddRoleModalComponent } from './add-role-modal.component';

@Component({
    selector: 'organization-unit-roles',
    templateUrl: './organization-unit-roles.component.html',
    styles: [],
})
export class OrganizationUnitRolesComponent extends PagedListingComponentBase<OrganizationUnitRoleListDto> implements OnInit {

    @Output() roleRemoved = new EventEmitter<number[]>();
    @Output() rolesAdded = new EventEmitter<number[]>();

    filterText = '';
    private _organizationUnit: NzTreeNode = null;

    get organizationUnit(): NzTreeNode {
        return this._organizationUnit;
    }

    set organizationUnit(ou: NzTreeNode) {
        if (this._organizationUnit === ou) {
            return;
        }
        this._organizationUnit = ou;
        if (ou) {
            this.refresh();
        }
    }

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
    ) {
        super(injector);
    }
    ngOnInit() { }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        if (!this._organizationUnit) {
            return;
        }

        this._organizationUnitService
            .getOrganizationUnitRoles(
                parseInt(this._organizationUnit.key, 10),
                request.sorting,
                request.maxResultCount,
                request.skipCount,
            )
            .pipe(finalize(finishedCallback))
            .subscribe((result: PagedResultDtoOfOrganizationUnitRoleListDto) => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    removeRole(role: OrganizationUnitRoleListDto): void {
        const _ouId = parseInt(this.organizationUnit.key);
        this._organizationUnitService.removeRoleFromOrganizationUnit(role.id, _ouId).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyRemoved'));
            this.roleRemoved.emit([role.id]);
        });
    }

    addRoles(): void {
        this.modalHelper
            .createStatic(AddRoleModalComponent, {
                organizationUnitId: parseInt(this.organizationUnit.key),
            })
            .subscribe((res: number[]) => {
                if (res) {
                    this.rolesAdded.emit(res);
                    this.refresh();
                }
            });
    }
}
