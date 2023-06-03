import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedbackAlertPageRoutingModule } from './feedback-alert-routing.module';

import { FeedbackAlertPage } from './feedback-alert.page';

import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    ReactiveFormsModule,
    FeedbackAlertPageRoutingModule
  ],
  declarations: [FeedbackAlertPage]
})
export class FeedbackAlertPageModule {}
