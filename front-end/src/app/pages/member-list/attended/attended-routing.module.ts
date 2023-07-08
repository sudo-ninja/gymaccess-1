import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendedPage } from './attended.page';

const routes: Routes = [
  {
    path: '',
    component: AttendedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendedPageRoutingModule {}
