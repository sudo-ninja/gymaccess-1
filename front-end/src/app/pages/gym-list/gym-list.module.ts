import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymListPageRoutingModule } from './gym-list-routing.module';

import { GymListPage } from './gym-list.page';
import { QRCodeModule } from 'angularx-qrcode';

import{DirectivesModule} from './../../directives/directives.module';
// import { AppModule } from "../../app.module";


@NgModule({
    declarations: [GymListPage],
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        IonicModule,
        GymListPageRoutingModule,
        // Ng2SearchPipeModule,
        QRCodeModule,
        // AppModule
    ]
})
export class GymListPageModule {}
