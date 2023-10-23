import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController,Platform } from '@ionic/angular';
// import { AppVersion } from '@ionic-native/app-version/ngx';
// import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

interface AppUpdate{
  current:string;
  enabled:boolean;
  msg?:{
    title:string;
    msg:string;
    btn:string;
  };
  majorMsg?:{
    title:string;
    msg:string;
    btn:string;
  };
  minorMs?:{
    title:string;
    msg:string;
    btn:string;
  }
}


@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  maintenanceExample: string; // json data string from back end

  constructor(private http:HttpClient,
    private alertCtrl:AlertController,
    // private appVersion: AppVersion,
    private plt:Platform,
    // private iab: InAppBrowser,
    ) { }

    async checkForUpdate(){
      //  this.http.get(this.maintenanceExample).subscribe((info:AppUpdate)=>{
      //   console.log("result:", info);
      //   if(!info.enabled){
      //     this.presentAlert(info.msg.title,info.msg.msg);
      //   }
      //  });

    }

    openAppStoreEntry(){

    }

    async presentAlert(header,message, buttonText='',allowClose=false){
      const buttons = [];
      if(buttonText!= ''){
        buttons.push({
          text: buttonText,
          handler:()=>{

          }
           
        });

      }
      if(allowClose){
        buttons.push({
          text:'Close',
          role:'cancle'
        });
      }
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons,
        backdropDismiss:allowClose,
      });
      await alert.present();
    }
}
