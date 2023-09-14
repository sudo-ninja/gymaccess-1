import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendancesPage } from './attendances.page';

const routes: Routes = [
  {
    path: '',
    component: AttendancesPage
  },
  {
    path: 'holidays',
    loadChildren: () => import('./holidays/holidays.module').then( m => m.HolidaysPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendancesPageRoutingModule {}
