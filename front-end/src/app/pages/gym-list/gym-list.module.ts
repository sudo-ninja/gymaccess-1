import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymListPageRoutingModule } from './gym-list-routing.module';

import { GymListPage } from './gym-list.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GymListPageRoutingModule,
    QRCodeModule
  ],
  declarations: [GymListPage]
})
export class GymListPageModule {}
