import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberAddPage } from './member-add.page';

const routes: Routes = [
  {
    path: '',
    component: MemberAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberAddPageRoutingModule {}
