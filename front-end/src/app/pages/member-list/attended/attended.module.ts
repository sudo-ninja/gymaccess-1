import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendedPageRoutingModule } from './attended-routing.module';

import { AttendedPage } from './attended.page';

import { Routes, RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    AttendedPageRoutingModule
  ],
  declarations: [AttendedPage]
})
export class AttendedPageModule {}
