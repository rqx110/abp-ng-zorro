import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';

import { Injectable } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';
import { Menu, MenuService } from '@delon/theme';
import { AppLocalizationService } from '@appshared/common/localization/app-localization.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Injectable()
export class AppNavigationService {

    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _featureCheckerService: FeatureCheckerService,
        private _appSessionService: AppSessionService,
        private _localizationService: AppLocalizationService,
        private _ngAlainMenuService: MenuService,
    ) {

    }

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Notifications', 'Pages.Notifications', 'anticon anticon-bell', '/app/notifications'),
            new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'anticon anticon-dashboard', '/app/admin/hostDashboard'),
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'anticon anticon-dashboard', '/app/main/dashboard'),
            new AppMenuItem('Tenants', 'Pages.Tenants', 'anticon anticon-bars', '/app/admin/tenants'),
            // new AppMenuItem('Editions', 'Pages.Editions', 'flaticon-app', '/app/admin/editions'),
            new AppMenuItem('Administration', '', 'anticon anticon-appstore', '', [
                new AppMenuItem('OrganizationUnits', 'Pages.Administration.OrganizationUnits', 'anticon anticon-team', '/app/admin/organization-units'),
                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'anticon anticon-safety', '/app/admin/roles'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'anticon anticon-user', '/app/admin/users'),
                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'anticon anticon-global', '/app/admin/languages'),
                new AppMenuItem('LanguageTexts', 'Pages.Administration.LanguageTexts', 'anticon anticon-global', '/app/admin/languagetexts'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'anticon anticon-book', '/app/admin/auditLogs'),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'anticon anticon-lock', '/app/admin/maintenance'),
                // new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                // new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'anticon anticon-setting', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'anticon anticon-setting', '/app/admin/tenantSettings')
            ]),
            // new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }

    mapToNgAlainMenu() {
        let menu = this.getMenu();
        let ngAlainRootMenu = <Menu>{
            text: this._localizationService.l(menu.name),
            group: false,
            hideInBreadcrumb: true,
            children: []
        };
        this.generateNgAlainMenus(ngAlainRootMenu.children, menu.items);

        let ngAlainMenus = [
            ngAlainRootMenu
        ];
        this._ngAlainMenuService.add(ngAlainMenus);
    }

    generateNgAlainMenus(ngAlainMenus: Menu[], appMenuItems: AppMenuItem[]) {
        appMenuItems.forEach(item => {
            let ngAlainMenu: Menu;

            ngAlainMenu = {
                text: this._localizationService.l(item.name),
                link: item.route,
                icon: `${item.icon}`,
                hide: !this.showMenuItem(item)
            };

            if (item.items && item.items.length > 0) {
                ngAlainMenu.children = [];
                this.generateNgAlainMenus(ngAlainMenu.children, item.items);
            }

            ngAlainMenus.push(ngAlainMenu);
        });
    }

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
            hideMenuItem = true;
        }

        if (hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }
}
