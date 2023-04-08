import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembertabsPageRoutingModule } from './membertabs-routing.module';

import { MembertabsPage } from './membertabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MembertabsPageRoutingModule
  ],
  declarations: [MembertabsPage]
})
export class MembertabsPageModule {}
