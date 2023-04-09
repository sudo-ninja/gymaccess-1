import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymtabsPageRoutingModule } from './gymtabs-routing.module';

import { GymtabsPage } from './gymtabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GymtabsPageRoutingModule
  ],
  declarations: [GymtabsPage]
})
export class GymtabsPageModule {}
