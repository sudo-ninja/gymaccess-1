import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddjoinPageRoutingModule } from './addjoin-routing.module';

import { AddjoinPage } from './addjoin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddjoinPageRoutingModule
  ],
  declarations: [AddjoinPage]
})
export class AddjoinPageModule {}
