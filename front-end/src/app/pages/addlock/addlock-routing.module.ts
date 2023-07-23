import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddlockPage } from './addlock.page';

const routes: Routes = [
  {
    path: '',
    component: AddlockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddlockPageRoutingModule {}
