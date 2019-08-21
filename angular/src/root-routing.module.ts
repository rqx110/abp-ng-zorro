import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' },
  {
    path: 'account',
    loadChildren: () => import('account/account.module').then(m => m.AccountModule), // Lazy load account module
    data: { preload: true },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class RootRoutingModule { }
