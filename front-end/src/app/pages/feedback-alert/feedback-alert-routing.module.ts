import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackAlertPage } from './feedback-alert.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackAlertPageRoutingModule {}
