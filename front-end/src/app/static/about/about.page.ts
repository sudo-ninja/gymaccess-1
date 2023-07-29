import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
//for app version
import { App } from '@capacitor/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {


    
  appInfo:any;
  keys:string[] = [];


  constructor(
    private alertCtrl: AlertController,
    private router :Router,
  ) { 
    
  }

  ngOnInit() {
    // for app version 
     App.getInfo().then((obj)=>{
    this.appInfo = obj;
    this.keys = Object.keys(obj);
  });
  console.log("nnnnn",this.keys);   


  }

  uploadlogAlert(){
    this.presentAlert("Upload Log","if the app malfunction or crashes, upload logs to help us and resolve the issue.")
  }

  async presentAlert(header:string,subheader:string) {
    const alert = await this.alertCtrl.create({
      header:header,
      subHeader: subheader,
      message:"App Version :    , SDK Version:   , Client ID:     , User Account:      ",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { 
                        }
        },
        {
          text: 'Upload Log',
          role: 'upload-log',
          handler: () => {  
            
          }
        }
      ]
    });
    await alert.present();
  }

  backToSettings(){
    // navigate back to setting .
    this.router.navigateByUrl('/settings',{replaceUrl:true});
  }

}
