import { Component, ViewChild } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import{AlertController, IonRouterOutlet, Platform} from '@ionic/angular';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { environment } from 'src/environments/environment';

//to get app version using cordova plugin 
import { HttpClientModule } from '@angular/common/http';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AppUpdate } from '@capawesome/capacitor-app-update';


//swiper 
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { UpdateService } from './services/update.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
@ViewChild(IonRouterOutlet,{static:false}) routerOutlet:IonRouterOutlet; // this will give access of current router outlet

  constructor(
    private storage: Storage,
    private platform:Platform,
    private alertController:AlertController,
    private router:Router,
    // private appVersion: AppVersion
    private updateService:UpdateService,
  
    ) {
    this.storage.create();
    
    this.platform.ready().then(()=>{
      this.updateService.checkForUpdate();
    });

// console.log(this.appVersion.getAppName());
// console.log(this.appVersion.getPackageName());
// console.log(this.appVersion.getVersionCode());
// console.log(this.appVersion.getVersionNumber());  
const getCurrentAppVersion = async () => {
  const result = await AppUpdate.getAppUpdateInfo();
  console.log(result);
  return result.currentVersion;
};

// console.log(this.getCurrentAppVersion);
    
    
    this.initializeApp();
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
    
  }

  initializeApp(){
    this.platform.ready().then(()=>{
     
//catch backbutton of device and add code here to get desired action
      this.platform.backButton.subscribeWithPriority(0,async()=>{

        if(this.routerOutlet && this.routerOutlet.canGoBack()){
          this.routerOutlet.pop();
        }else if (this.router.url === "/home" || this.router.url === "/gymtabs/member-list" || this.router.url === "/tabs/member-action" || this.router.url === "/login"){
          const alert = await this.alertController.create({
            header:"Close App",
            message:"Do you really want to close app?",
            buttons:[
              {
                text:"Cancel",
                role:"cancel"
              },
              {
                text:"Close App",
                handler: () => {
                  navigator["app"].exitApp();

                }
              }
            ]
          });
          await alert.present();
        } 

      });      
    })

//for google login
    this.platform.ready().then(() => {
      console.log('READY!')
      GoogleAuth.initialize(
        {
        clientId:environment.androidClientId,
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      }
      )
    });
  }
  


}
