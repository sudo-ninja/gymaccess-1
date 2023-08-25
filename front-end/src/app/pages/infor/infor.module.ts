import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InforPageRoutingModule } from './infor-routing.module';

import { InforPage } from './infor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InforPageRoutingModule
  ],
  declarations: [InforPage]
})
export class InforPageModule {}
