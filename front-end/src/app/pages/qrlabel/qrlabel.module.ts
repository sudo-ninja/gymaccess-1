import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrlabelPageRoutingModule } from './qrlabel-routing.module';

import { QrlabelPage } from './qrlabel.page';
// to display genrated qr code 
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule, // qr code display 
    QrlabelPageRoutingModule
  ],
  declarations: [QrlabelPage]
})
export class QrlabelPageModule {}
