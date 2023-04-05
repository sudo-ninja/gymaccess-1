import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { MemberListPageRoutingModule } from './member-list-routing.module';

import { MemberListPage } from './member-list.page';

import{DirectivesModule} from './../../directives/directives.module';
import { QRCodeModule } from 'angularx-qrcode';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// import{ScrollingModule} from '@angular/cdk/scrolling';
// import{DragDropModule} from '@angular/cdk/drag-drop';
// swiper module
// import {SwiperModule} from 'swiper/angular';
// custom schema for swiper js
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    Ng2SearchPipeModule,
    RouterModule,
    ReactiveFormsModule,
    MemberListPageRoutingModule,
    QRCodeModule
  ],
  declarations: [MemberListPage],
  // exports:[MemberListPage], // to use footer tab at this page
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MemberListPageModule {}
