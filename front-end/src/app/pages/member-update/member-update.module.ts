import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberUpdatePageRoutingModule } from './member-update-routing.module';

import { MemberUpdatePage } from './member-update.page';

import { Routes, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    MemberUpdatePageRoutingModule
  ],
  declarations: [MemberUpdatePage]
})
export class MemberUpdatePageModule {}
