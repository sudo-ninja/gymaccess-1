import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
//for app version
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { MemberserviceService } from 'src/app/services/memberservice.service';
import { UserService } from 'src/app/services/user.service';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {


    
  appInfo:any;
  keys:string[] = [];
  clientId: any;
  MemberId: any;
  user: any;
  loggeduser: any;
  loggedUserEmail: any;


  constructor(
    private alertCtrl: AlertController,
    private router :Router,
    private memberApi :MemberserviceService,
    private userApi :UserService,
    private jwtService:JwtService,
  ) { 
    this.getAppVersion();

    let decodedToken = this.jwtService.DecodeToken(this.userApi.getToken());
    decodedToken = JSON.stringify(decodedToken);
    console.log(decodedToken);
    // Parse the JSON string into a JavaScript object
    this.user = JSON.parse(decodedToken);

      // const user = localStorage.getItem('User')
      this.loggeduser=JSON.parse(decodedToken);
      this.loggedUserEmail = this.loggeduser.email;
    this.userApi.getUserbyEmail(this.loggedUserEmail).subscribe({
      next:res=>{
        this.clientId = res._id;
      },
      error:err=>{}
    })
    this.memberApi.getMemberByEmail(this.loggedUserEmail).subscribe({
      next:res=>{

      },
      error:err=>{}
    })
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
      message:`App Version : ${this.appVersion}, Client ID: ${this.clientId},`,
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

  appVersion: string;

  async getAppVersion() {
    try {
      const result = await App.getInfo();
      this.appVersion = result.version;
    } catch (error) {
      console.error('Error getting app version:', error);
    }
  }

}
