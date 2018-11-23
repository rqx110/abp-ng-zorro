import { Injectable } from '@angular/core';
import { MenuService, Menu } from '@delon/theme';

@Injectable()
export class AbpMenuService extends MenuService {
    getPathByUrl(url: string, recursive = false): Menu[] {
        const ret: Menu[] = [];
        let item = this.getHitEx(url, recursive);

        if (!item) { return ret; }

        do {
            ret.splice(0, 0, item);
            item = item.__parent;
        } while (item);

        return ret;
    }

    private getHitEx(url: string, recursive = false, cb: (i: Menu) => void = null) {
        let item: Menu = null;

        while (!item && url) {
            this.visit(i => {
                if (cb) {
                    cb(i);
                }
                if ((i.link != null && i.link === url) || (!(i.children && i.children.length) && url.startsWith(i.link))) {
                    item = i;
                }
            });

            if (!recursive) { break; }

            url = url
                .split('/')
                .slice(0, -1)
                .join('/');
        }

        return item;
    }

}
