import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembercontrolPageRoutingModule } from './membercontrol-routing.module';

import { MembercontrolPage } from './membercontrol.page';
import { RouterModule } from '@angular/router';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    MembercontrolPageRoutingModule
  ],
  declarations: [MembercontrolPage,DateTimePickerComponent]
  // declared here components, other wise page will not be able to know about it 
})
export class MembercontrolPageModule {}
