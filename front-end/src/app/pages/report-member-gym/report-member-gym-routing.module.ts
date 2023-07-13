import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportMemberGymPage } from './report-member-gym.page';

const routes: Routes = [
  {
    path: '',
    component: ReportMemberGymPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportMemberGymPageRoutingModule {}
