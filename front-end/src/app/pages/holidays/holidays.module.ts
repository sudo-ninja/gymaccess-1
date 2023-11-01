import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolidaysPageRoutingModule } from './holidays-routing.module';

import { HolidaysPage } from './holidays.page';

// import { AddholidaymodalComponent } from './addholidaymodal/addholidaymodal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HolidaysPageRoutingModule
  ],
  declarations: [HolidaysPage,
  // AddholidaymodalComponent
]
})
export class HolidaysPageModule {}
