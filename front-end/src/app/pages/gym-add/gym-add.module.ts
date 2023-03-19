import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymAddPageRoutingModule } from './gym-add-routing.module';

import { GymAddPage } from './gym-add.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    GymAddPageRoutingModule
  ],
  declarations: [GymAddPage]
})
export class GymAddPageModule {}
