import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { AppComponent } from '@app/app.component';
import { NotificationsComponent } from '@appshared/layout/notifications/notifications.component';

const routes: Routes = [
    {
        path: 'app',
        component: AppComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'notifications', component: NotificationsComponent },
                    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
                ]
            },
            {
                path: 'main',
                loadChildren: () => import('app/main/main.module').then(m => m.MainModule), // Lazy load main module
                data: { preload: true },
            },
            {
                path: 'admin',
                loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard]
            },

            {
                path: '**',
                redirectTo: 'notifications',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
    constructor(
        private router: Router
    ) {

    }
}
