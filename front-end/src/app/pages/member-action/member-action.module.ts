import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberActionPageRoutingModule } from './member-action-routing.module';

import { MemberActionPage } from './member-action.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    MemberActionPageRoutingModule
  ],
  declarations: [MemberActionPage]
})
export class MemberActionPageModule {}
