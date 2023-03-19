import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrlabelPageRoutingModule } from './qrlabel-routing.module';

import { QrlabelPage } from './qrlabel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrlabelPageRoutingModule
  ],
  declarations: [QrlabelPage]
})
export class QrlabelPageModule {}
