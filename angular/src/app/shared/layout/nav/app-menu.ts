import { AppMenuItem } from './app-menu-item';

export class AppMenu {
    name = '';
    displayName = '';
    items: AppMenuItem[];

    constructor(name: string, displayName: string, items: AppMenuItem[]) {
        this.name = name;
        this.displayName = displayName;
        this.items = items;
    }
}
