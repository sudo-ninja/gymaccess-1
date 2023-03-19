import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GmapPageRoutingModule } from './gmap-routing.module';

import { GmapPage } from './gmap.page';

// for capacitor google map 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GmapPageRoutingModule
  ],
  declarations: [GmapPage]
})
export class GmapPageModule {}
