import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymListPageRoutingModule } from './gym-list-routing.module';

import { GymListPage } from './gym-list.page';
import { QRCodeModule } from 'angularx-qrcode';
// filter on list page 
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GymListPageRoutingModule,
    Ng2SearchPipeModule,
    QRCodeModule
  ],
  declarations: [GymListPage]
})
export class GymListPageModule {}
