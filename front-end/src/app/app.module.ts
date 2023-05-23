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

// custom schema for swiper js
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// import HTTP_INTERCEPTORS here so that can be used gloablly 
// import { HttpConfigInterceptor } from '../app/interceptors/httpConfig.interceptor';
import { AuthInterceptor } from './guards/auth.interceptors';

// import auth guard
import { AuthGuard } from './guards/auth.guard';
import { UserService } from './services/user.service';

//cordova plugin import and then inject in providers
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    // NativeGeocoder, 
    IonicStorageModule.forRoot(), 
    ReactiveFormsModule,
  ],
  providers: [AuthGuard,UserService,Storage,
    MemberserviceService,
    { 
    provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy 
    },
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
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
