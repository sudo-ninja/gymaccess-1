import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { MemberListPageRoutingModule } from './member-list-routing.module';

import { MemberListPage } from './member-list.page';

import{DirectivesModule} from './../../directives/directives.module';
import { QRCodeModule } from 'angularx-qrcode';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import{ScrollingModule} from '@angular/cdk/scrolling';
// import{DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    RouterModule,
    MemberListPageRoutingModule,
    QRCodeModule
  ],
  declarations: [MemberListPage]
})
export class MemberListPageModule {}
