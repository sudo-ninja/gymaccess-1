import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MemberAddPageRoutingModule } from './member-add-routing.module';

import { MemberAddPage } from './member-add.page';

const routes: Routes = [
  {
    path: '',
    component: MemberAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    // RouterModule.forChild(routes),
    RouterModule,
    MemberAddPageRoutingModule
  ],
  declarations: [MemberAddPage]
})
export class MemberAddPageModule {}
