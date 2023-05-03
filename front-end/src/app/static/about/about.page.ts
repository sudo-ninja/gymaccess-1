import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
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

}
