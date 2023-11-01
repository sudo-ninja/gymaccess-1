
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http'; // HTTP_INTERCEPTORS added here 
import { ReactiveFormsModule } from '@angular/forms';

import {MemberserviceService} from './services/memberservice.service';

import { IonicStorageModule } from '@ionic/storage-angular';

// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
// import both main and modal page here 

import { FormsModule } from '@angular/forms';

// custom schema for swiper js
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// import HTTP_INTERCEPTORS here so that can be used gloablly 
// import { HttpConfigInterceptor } from '../app/interceptors/httpConfig.interceptor';
import { AuthInterceptor } from './guards/auth.interceptors';

// import auth guard
import { AuthGuard } from './guards/auth.guard';
import { UserService } from './services/user.service';

//cordova plugin import and then inject in providers
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { CustomFilterPipe } from './custom-filter-pipe.pipe';

//to kno wnetwork IP address and details
//to know network ip 
import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';
//for modal controller
import { ModaldayscheduleComponent } from './pages/attendances/modaldayschedule/modaldayschedule.component';
import { AddholidaymodalComponent } from './pages/holidays/addholidaymodal/addholidaymodal.component';
import { UpdateholidaymodalComponent } from './pages/holidays/updateholidaymodal/updateholidaymodal.component';
 

import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@NgModule({
  declarations: [
    AppComponent, 
    CustomFilterPipe,
    ModaldayscheduleComponent,
    AddholidaymodalComponent,
    UpdateholidaymodalComponent,
  ],
  imports: [BrowserModule, 
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    // NativeGeocoder, 
    IonicStorageModule.forRoot(), 
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [AuthGuard,UserService,Storage,
    MemberserviceService,  NetworkInterface,
    
    { 
    provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy,
        },AppVersion,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpConfigInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // EmailComposer,
    ],

    // exports: [
    //   CustomFilterPipe
    // ],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
