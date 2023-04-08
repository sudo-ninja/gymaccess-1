import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberinforPageRoutingModule } from './memberinfor-routing.module';

import { MemberinforPage } from './memberinfor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberinforPageRoutingModule
  ],
  declarations: [MemberinforPage]
})
export class MemberinforPageModule {}
