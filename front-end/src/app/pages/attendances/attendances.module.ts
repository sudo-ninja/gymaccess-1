import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendancesPageRoutingModule } from './attendances-routing.module';

import { AttendancesPage } from './attendances.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AttendancesPageRoutingModule
  ],
  declarations: [AttendancesPage]
})
export class AttendancesPageModule {}
