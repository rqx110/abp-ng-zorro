import { Component, OnInit, Injector } from '@angular/core';
import {
    PagedListingComponentBase,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';
import {
    UserListDto,
    UserServiceProxy,
    EntityDtoOfInt64,
    PagedResultDtoOfUserListDto,
} from '@shared/service-proxies/service-proxies';
import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './edit-user-permissions-modal.component';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import * as _ from 'lodash';
import { AppConsts } from '@shared/AppConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { LocalStorageService } from '@shared/utils/local-storage.service';
@Component({
    templateUrl: './users.component.html',
    styles: [],
})
export class UsersComponent extends PagedListingComponentBase<UserListDto> implements OnInit {

    filterText = '';
    advancedFiltersVisible = false;
    selectedPermissions = [];
    role = '';
    onlyLockedUsers = false;

    constructor(
        injector: Injector,
        private _userServiceProxy: UserServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute,
        private _localStorageService: LocalStorageService
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    onSearch(): void {
        this.refresh();
    }

    getRolesAsString(roles): string {
        let roleNames = '';
        for (let j = 0; j < roles.length; j++) {
            if (roleNames.length) {
                roleNames = roleNames + ', ';
            }
            roleNames = roleNames + roles[j].roleName;
        }
        return roleNames;
    }

    createOrEdit(id?: number): void {
        this.modalHelper
            .createStatic(CreateOrEditUserModalComponent, { userId: id }, { size: 'md', includeTabs: true })
            .subscribe(res => {
                if (res) {
                    this.refresh();
                }
            });
    }

    editUserPermissions(record): void {
        this.modalHelper
            .createStatic(EditUserPermissionsModalComponent, {
                userId: record.id,
                userName: record.userName,
            }, { size: 'md' })
            .subscribe(result => { });
    }

    unlockUser(record): void {
        this._userServiceProxy.unlockUser(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
            this.notify.success(this.l('UnlockedTheUser', record.userName));
        });
    }

    protected fetchDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void {
        this._userServiceProxy
            .getUsers(
                this.filterText,
                this.selectedPermissions,
                this.role !== '' ? parseInt(this.role) : undefined,
                this.onlyLockedUsers,
                request.sorting,
                request.maxResultCount,
                request.skipCount,
            )
            .pipe(finalize(finishedCallback))
            .subscribe((result: PagedResultDtoOfUserListDto) => {
                this.dataList = result.items;
                this.setUsersProfilePictureUrl(this.dataList);
                this.showPaging(result);
            });
    }

    batchDelete(): void {
        this.message.warn('method not implement!');
        // const selectCount = this.selectedDataItems.length;
        // if (selectCount <= 0) {
        //     this.message.warn(this.l('SelectAnItem'));
        //     return;
        // }
        // this.message.confirm(
        //     this.l('<b class="text-red">{0}</b> items will be removed.', selectCount),
        //     this.l('AreYouSure'),
        //     res => {
        //         if (res) {
        //             let deletedIds = _.map(this.selectedDataItems, (item) => new EntityDtoOfInt64({ id: item.id }));
        //             this._userServiceProxy.batchDeleteUsers(deletedIds).subscribe(() => {
        //                 this.refresh();
        //                 this.notify.success(this.l('SuccessfullyDeleted'));
        //             });
        //         }
        //     },
        // );
    }
    exportToExcel(): void {
        this._userServiceProxy.getUsersToExcel(
            this.filterText,
            this.selectedPermissions,
            this.role !== '' ? parseInt(this.role) : undefined,
            this.onlyLockedUsers,
            undefined)
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }

    deleteUser(user: UserListDto): void {
        if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
            this.message.warn(this.l('{0}UserCannotBeDeleted', AppConsts.userManagement.defaultAdminUserName));
            return;
        }

        this._userServiceProxy.deleteUser(user.id).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }

    setUsersProfilePictureUrl(users: UserListDto[]): void {
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            this._localStorageService.getItem(AppConsts.authorization.encrptedAuthTokenName, function (err, value) {
                let profilePictureUrl = AppConsts.remoteServiceBaseUrl + '/Profile/GetProfilePictureByUser?userId=' + user.id + '&' + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(value.token);
                (user as any).profilePictureUrl = profilePictureUrl;
            });
        }
    }
}
