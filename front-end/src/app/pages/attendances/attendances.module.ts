import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendancesPageRoutingModule } from './attendances-routing.module';

import { AttendancesPage } from './attendances.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendancesPageRoutingModule
  ],
  declarations: [AttendancesPage]
})
export class AttendancesPageModule {}
