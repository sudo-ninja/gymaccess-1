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
// this is used for custom search at memeber list page 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { AppModule } from "../../app.module";

import { BannerComponent } from './../../components/banner/banner.component';

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
        BannerComponent, // component call in module this way , refrence this https://angular.io/guide/standalone-components
        RouterModule,
        ReactiveFormsModule,
        MemberListPageRoutingModule,
        QRCodeModule,
        // AppModule
        //import here search component
        //below code added due to tab function 
        RouterModule.forChild([{ path: '', component: MemberListPage }])
    ]
})
export class MemberListPageModule {}
