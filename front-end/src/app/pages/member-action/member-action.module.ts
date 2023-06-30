import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberActionPageRoutingModule } from './member-action-routing.module';

import { MemberActionPage } from './member-action.page';
import { QRCodeModule } from 'angularx-qrcode';
import { BannerComponent } from './banner/banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    BannerComponent, // component call in module this way , refrence this https://angular.io/guide/standalone-components
    MemberActionPageRoutingModule
  ],
  declarations: [MemberActionPage]
})
export class MemberActionPageModule {}
