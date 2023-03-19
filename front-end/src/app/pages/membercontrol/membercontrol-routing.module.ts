import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MembercontrolPage } from './membercontrol.page';

const routes: Routes = [
  {
    path: '',
    component: MembercontrolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembercontrolPageRoutingModule {}
