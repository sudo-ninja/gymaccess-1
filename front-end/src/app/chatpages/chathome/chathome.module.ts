import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChathomePageRoutingModule } from './chathome-routing.module';

import { ChathomePage } from './chathome.page';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChathomePageRoutingModule
  ],
  declarations: [ChathomePage,UserListComponent]
})
export class ChathomePageModule {}
