import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinGymPageRoutingModule } from './join-gym-routing.module';

import { JoinGymPage } from './join-gym.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinGymPageRoutingModule
  ],
  declarations: [JoinGymPage]
})
export class JoinGymPageModule {}
