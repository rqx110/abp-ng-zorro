import { Component, OnInit, ElementRef, Renderer2, Inject, OnDestroy, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { SignalRHelper } from '@shared/helpers/SignalRHelper';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Injector } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationError, NavigationCancel, RouteConfigLoadStart } from '@angular/router';
import { TitleService, SettingsService, ScrollService } from '@delon/theme';
import { DOCUMENT } from '@angular/common';
import { updateHostClass } from '@delon/util';
import { Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { SettingDrawerComponent } from '@appshared/layout/setting-drawer/setting-drawer.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppNavigationService } from '@appshared/layout/nav/app-navigation.service';

@Component({
    selector: 'app-app',
    templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    private notify$: Subscription;
    isFetching = false;
    @ViewChild('settingHost', { read: ViewContainerRef, static: true })
    settingHost: ViewContainerRef;
    installationMode = true;

    constructor(
        injector: Injector,
        private settings: SettingsService,
        private router: Router,
        scroll: ScrollService,
        private titleSrv: TitleService,
        private el: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private doc: any,

        private resolver: ComponentFactoryResolver,
        _appNavigationService: AppNavigationService
    ) {
        super(injector);

        _appNavigationService.mapToNgAlainMenu();

        // scroll to top in change page
        router.events.subscribe(evt => {
            if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
                this.isFetching = true;
            }
            if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
                this.isFetching = false;
                return;
            }
            if (evt instanceof NavigationEnd) {
                this.titleSrv.suffix = 'AbpZeroTemplate';
                this.titleSrv.setTitle();
            }
            setTimeout(() => {
                scroll.scrollToTop();
                this.isFetching = false;
            }, 100);
        });
    }

    private setClass() {
        const { el, doc, renderer, settings } = this;
        const layout = settings.layout;
        updateHostClass(
            el.nativeElement,
            renderer,
            {
                ['alain-default']: true,
                [`alain-default__fixed`]: layout.fixed,
                [`alain-default__collapsed`]: layout.collapsed,
            },
            true,
        );

        doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak');
    }

    ngOnInit(): void {
        this.installationMode = UrlHelper.isInstallUrl(location.href);

        if (this.appSession.application) {
            SignalRHelper.initSignalR(() => { });
        }

        this.notify$ = this.settings.notify.subscribe(() => this.setClass());
        this.setClass();
    }

    ngAfterViewInit(): void {
        // Setting componet for only developer
        if (!environment.production) {
            setTimeout(() => {
                const settingFactory = this.resolver.resolveComponentFactory(
                    SettingDrawerComponent,
                );
                this.settingHost.createComponent(settingFactory);
            }, 22);
        }
    }

    ngOnDestroy() {
        this.notify$.unsubscribe();
    }
}
