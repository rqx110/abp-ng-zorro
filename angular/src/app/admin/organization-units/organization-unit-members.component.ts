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
    OrganizationUnitUserListDto,
    OrganizationUnitServiceProxy,
    PagedResultDtoOfOrganizationUnitUserListDto
} from '@shared/service-proxies/service-proxies';
import { NzTreeNode } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AddMemberModalComponent } from './add-member-modal.component';

@Component({
    selector: 'organization-unit-members',
    templateUrl: './organization-unit-members.component.html',
    styles: [],
})
export class OrganizationUnitMembersComponent extends PagedListingComponentBase<OrganizationUnitUserListDto> implements OnInit {

    @Output() memberRemoved = new EventEmitter<number[]>();
    @Output() membersAdded = new EventEmitter<number[]>();

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
            .getOrganizationUnitUsers(
                parseInt(this._organizationUnit.key, 10),
                request.sorting,
                request.maxResultCount,
                request.skipCount,
            )
            .pipe(finalize(finishedCallback))
            .subscribe((result: PagedResultDtoOfOrganizationUnitUserListDto) => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    removeMember(user: OrganizationUnitUserListDto): void {
        const _ouId = parseInt(this.organizationUnit.key);
        this._organizationUnitService.removeUserFromOrganizationUnit(user.id, _ouId).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyRemoved'));
            this.memberRemoved.emit([user.id]);
        });
    }

    batchDelete(): void {
        this.message.warn('method not implement!');
        // const selectCount = this.selectedDataItems.length;
        // if (selectCount <= 0) {
        //     abp.message.warn(this.l('SelectAnItem'));
        //     return;
        // }
        // this.message.confirm(
        //     this.l('<b class="text-red">{0}</b> items will be removed.', selectCount),
        //     this.l('AreYouSure'),
        //     res => {
        //         if (res) {
        //             const _ouId = parseInt(this.organizationUnit.key);
        //             const ids = _.map(this.selectedDataItems, 'id');
        //             const input: UsersToOrganizationUnitInput = new UsersToOrganizationUnitInput();
        //             input.userIds = ids;
        //             input.organizationUnitId = _ouId;
        //             this._organizationUnitService
        //                 .batchRemoveUserFromOrganizationUnit(input)
        //                 .subscribe(() => {
        //                     this.refresh();
        //                     this.notify.success(this.l('SuccessfullyDeleted'));
        //                     this.memberRemoved.emit(ids);
        //                 });
        //         }
        //     },
        // );
    }

    addMembers(): void {
        this.modalHelper
            .createStatic(AddMemberModalComponent, {
                organizationUnitId: parseInt(this.organizationUnit.key),
            })
            .subscribe((res: number[]) => {
                if (res) {
                    this.membersAdded.emit(res);
                    this.refresh();
                }
            });
    }
}
