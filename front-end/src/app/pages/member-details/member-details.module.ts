import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberDetailsPageRoutingModule } from './member-details-routing.module';

import { MemberDetailsPage } from './member-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberDetailsPageRoutingModule
  ],
  declarations: [MemberDetailsPage]
})
export class MemberDetailsPageModule {}
