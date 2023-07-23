import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddlockPageRoutingModule } from './addlock-routing.module';

import { AddlockPage } from './addlock.page';



 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddlockPageRoutingModule,
    
  ],
  providers: [
   
],
 
  declarations: [AddlockPage]
})
export class AddlockPageModule {}
