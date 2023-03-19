import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberUpdatePage } from './member-update.page';

const routes: Routes = [
  {
    path: '',
    component: MemberUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberUpdatePageRoutingModule {}
