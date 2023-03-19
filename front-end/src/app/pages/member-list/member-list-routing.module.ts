import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberListPage } from './member-list.page';

const routes: Routes = [
  {
    path: '',
    component: MemberListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberListPageRoutingModule {}
