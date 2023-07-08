import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberListPage } from './member-list.page';

const routes: Routes = [
  {
    path: '',
    component: MemberListPage,
  },
  {
    path: 'member-list:/id',
    loadChildren: () => import('./attended/attended.module').then( m => m.AttendedPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberListPageRoutingModule {}
