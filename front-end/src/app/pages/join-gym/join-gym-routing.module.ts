import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinGymPage } from './join-gym.page';

const routes: Routes = [
  {
    path: '',
    component: JoinGymPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinGymPageRoutingModule {}
