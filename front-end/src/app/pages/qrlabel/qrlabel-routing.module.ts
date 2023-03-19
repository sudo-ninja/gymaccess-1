import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrlabelPage } from './qrlabel.page';

const routes: Routes = [
  {
    path: '',
    component: QrlabelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrlabelPageRoutingModule {}
