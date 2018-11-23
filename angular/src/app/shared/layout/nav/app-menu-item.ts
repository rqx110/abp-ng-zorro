export class AppMenuItem {
    name = '';
    permissionName = '';
    icon = '';
    route = '';
    items: AppMenuItem[];
    external: boolean;
    requiresAuthentication: boolean;
    featureDependency: any;
    parameters: {};
    reuseClosable = true;
    reuse = true;
    hideInBreadcrumb = false;

    constructor(
        name: string,
        permissionName: string,
        icon: string,
        route: string,
        items?: AppMenuItem[],
        external?: boolean,
        parameters?: Object,
        featureDependency?: any,
        requiresAuthentication?: boolean,
        reuse = true,
        reuseClosable = true,
        hideInBreadcrumb = false) {
        this.name = name;
        this.permissionName = permissionName;
        this.icon = icon;
        this.route = route;
        this.external = external;
        this.parameters = parameters;
        this.featureDependency = featureDependency;

        if (items === undefined) {
            this.items = [];
        } else {
            this.items = items;
        }

        if (this.permissionName) {
            this.requiresAuthentication = true;
        } else {
            this.requiresAuthentication = requiresAuthentication ? requiresAuthentication : false;
        }

        this.reuse = reuse;
        this.reuseClosable = reuseClosable;
        this.hideInBreadcrumb = hideInBreadcrumb;
    }

    hasFeatureDependency(): boolean {
        return this.featureDependency !== undefined;
    }

    featureDependencySatisfied(): boolean {
        if (this.featureDependency) {
            return this.featureDependency();
        }

        return false;
    }
}
