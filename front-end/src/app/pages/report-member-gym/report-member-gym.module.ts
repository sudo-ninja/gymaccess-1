import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportMemberGymPageRoutingModule } from './report-member-gym-routing.module';

import { ReportMemberGymPage } from './report-member-gym.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportMemberGymPageRoutingModule
  ],
  declarations: [ReportMemberGymPage]
})
export class ReportMemberGymPageModule {}
