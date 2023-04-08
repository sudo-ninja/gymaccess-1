import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberinforPage } from './memberinfor.page';

const routes: Routes = [
  {
    path: '',
    component: MemberinforPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberinforPageRoutingModule {}
