import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddjoinPage } from './addjoin.page';

const routes: Routes = [
  {
    path: '',
    component: AddjoinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddjoinPageRoutingModule {}
