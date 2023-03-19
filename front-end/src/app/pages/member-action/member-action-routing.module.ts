import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberActionPage } from './member-action.page';

const routes: Routes = [
  {
    path: '',
    component: MemberActionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberActionPageRoutingModule {}
