import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InforPage } from './infor.page';

const routes: Routes = [
  {
    path: '',
    component: InforPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InforPageRoutingModule {}
