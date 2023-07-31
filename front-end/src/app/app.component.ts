import { Component, ViewChild } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import{AlertController, IonRouterOutlet, Platform} from '@ionic/angular';


//swiper 
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
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

    ) {
    this.storage.create();
    // to know app version 
    
    
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
        }else if (this.router.url === "/home" || this.router.url === "/gymtabs/member-list" || this.router.url === "/tabs/member-action"){
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
  }
  


}
