import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GymAddPage } from './gym-add.page';

const routes: Routes = [
  {
    path: '',
    component: GymAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GymAddPageRoutingModule {}
