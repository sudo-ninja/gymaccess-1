import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymDetailsPageRoutingModule } from './gym-details-routing.module';

import { GymDetailsPage } from './gym-details.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    GymDetailsPageRoutingModule
  ],
  declarations: [GymDetailsPage]
})
export class GymDetailsPageModule {}
