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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { AppModule } from "../../app.module";



@NgModule({
    declarations: [MemberListPage],
    // exports:[MemberListPage], // to use footer tab at this page
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DirectivesModule,
        // Ng2SearchPipeModule,
        RouterModule,
        ReactiveFormsModule,
        MemberListPageRoutingModule,
        QRCodeModule,
        // AppModule
    ]
})
export class MemberListPageModule {}
