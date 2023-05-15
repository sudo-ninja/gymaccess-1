import { SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';

import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {GymService} from './../../services/gym.service';
import { Gym } from 'src/app/models/gym.model';

import { MemberserviceService } from 'src/app/services/memberservice.service';

import { GymDetailsPage } from '../gym-details/gym-details.page';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-gym-list',
  templateUrl: './gym-list.page.html',
  styleUrls: ['./gym-list.page.scss'],
})
export class GymListPage implements OnInit {
  public qrcode_data: string;
  public qrCodeDownloadLink: SafeUrl = "";

  gyms:Gym[]=[];
  _id :string; // This is an gym ID 

  searchTerm: string; // for search filter on page
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  loggeduserName:any;

   gymsResult:any;

   


  // Used to store the retrieved documents from the 
  // MongoDB database
//   public items : Array<any>;
//   private _HOST : string = "http://localhost:3000/api/v1/" || "http://ENTER-YOUR-NETWORK-IP-ADDRESS-HERE:8080/";

  constructor(
   public navCtrl       : NavController,
   private _MODAL       : ModalController,
   private _TOAST       : ToastController,
   private _HTTP        : HttpClient,
   public router :Router,
   public route :ActivatedRoute,
   public gymApi:GymService,
   private memberApi:MemberserviceService,
   public loadingController:LoadingController,
   private modalCtrl: ModalController,
   private cd: ChangeDetectorRef, 
   private _user:UserService,
   private alertCtrl: AlertController, 

   private storageService :StorageService, // storage service is used insted of get set method

  ) { 
    const user = localStorage.getItem('User');
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);
    this.loggeduserName = this.loggeduser.username;
    this.storageService.store('loggeduser_id',this.loggeduser._id);
     this.storageService.get('loggeduser_id').then((val)=>{
      console.log(val);
     });

    this.gymApi.wildSearch(this.loggeduser._id).subscribe((data:any)=>{
      try {
        if(data){
          console.log(data.length);
          this.storageService.store('gymList',data);
          console.log(data[0].gym_name); // use this info to make default select GYM value and refer this further https://forum.ionicframework.com/t/ion-select-and-default-values-ionic-4-solved/177550/5
          localStorage.setItem('DefaultGym',JSON.stringify(data[0]));
          this.router.navigateByUrl('/gymtabs/member-list',{replaceUrl:true})
        }      
      } catch (error) {
        throw error;
      }
    });
    }

    first:boolean = true; // this to fetch data first time from DB

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  ngOnInit() {
    //  to get added gym detail on this page 
    const gym_added = localStorage.getItem('GYM')
    // this.addName(user);
    console.log(gym_added); // here user info is being display after login successfull
    console.log(this._id);
   //  this.retrieve();
   const user = localStorage.getItem('User')
   if(user==null){
    this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
  }else{
    console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
    this.loggeduser=JSON.parse(user!);
    console.log('Ng On IT consol', this.loggeduser._id , this.loggeduser.username , this.loggeduser.email , this.loggeduser.mobile); // convert back user info into object so that we can use this info
    
  }

    this.getGyms(this.loggeduser._id);

  }

  async getGyms(id:any){
   const loading = await this.loadingController.create({
     message: 'Loading....'
   });
   await loading.present();
   if(this.first){
        this.gymApi.wildSearch(id).subscribe(res => {
       this.gyms = res;
       console.log(this.gyms);
       loading.dismiss();
       this.storageService.store('gymResult', res); // data stored in storage service 
     }),err=>{
        console.log(err);
        loading.dismiss();
      };             
    this.first = false;                    
    }else{
      await this.storageService.get('gymResult').then((val)=>{
          console.log(val);
          this.gymsResult = val;
          console.log(this.gymsResult);
          this.gyms = this.gymsResult;
          loading.dismiss();
      });
    }
   }

   ngViewwillenter(){}
   
   addGym(){
    this.router.navigate(['/gym-add']);
   }

  addMember(gid:string){
    this.router.navigate(['/member-add']);
    localStorage.setItem('gymID',gid);
    console.log(gid);
  }

  async updateGym(gid:string){
    console.log(gid);
    localStorage.setItem('gymID',gid);
     const modal = await this.modalCtrl.create({
      component: GymDetailsPage,
      componentProps:{id:gid},
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8,      
    });
    console.log(res => {
      this.gymApi.getGym(res.id);});
    await modal.present();
  }

  deleteGym(gid) {
    if(window.confirm('Are you sure? this will Delete all associated members also!!')) {
        this.memberApi.deleteAllofThisGymID(gid).subscribe(()=>{
          console.log( "All member deleted associated with this gy ID")
        });
        this.gymApi.delete(gid).subscribe((data) => {
          console.log(" Gym also deleted now .")
        });    
    }
  }

  async qrcode(gid:string,url: SafeUrl){
    console.log(JSON.stringify(gid));

    this.qrCodeDownloadLink = url;

    this.qrcode_data=JSON.stringify(gid);
      //  const modal = await this.modalCtrl.create({
      // component: GymDetailsPage,
      // componentProps:{id:gid},
      // breakpoints: [0, 0.5, 0.8],
      // initialBreakpoint: 0.8,});

    console.log(res => {
      this.gymApi.getGym(res.id);});
    // await modal.present();
  }


  handleRefresh(event) {
    setTimeout(() => {
      this.getGyms(this.loggeduser._id);
      event.target.complete();
    }, 2000);
  };



  // Gym Location on External Google Mape only for display purpose 
  // no editing work 
  gymLat:any;
  gymLng:any;
async gymLocationOnMap(gid:string){
   this.gymApi.getGym(gid).subscribe((data)=>{
    // console.log(data);
    this.gymLat = data.gym_address_lat;
    this.gymLng = data.gym_address_long;
    window.location.href =`https://www.google.com/maps/@${this.gymLat},${this.gymLng},21z`;
    // https://www.google.com/maps/@26.8539768,75.7255187,15z
  });
}

//double to update or delet
onDoubleTap(uid:string,event: any) {
  console.log('double tap: ', event);
  console.log(uid);
  this.presentAlert("Want to Update or Delete?",uid);
}
 
// Alert for Update and Delet of Gym
async presentAlert(header:string , gid:any) {
  const alert = await this.alertCtrl.create({
    header:header,    
    buttons: [{
      text: 'Delete',
      role: 'delete',
      handler: () => { this.deleteGym(gid);   }
    },
    {
      text: 'Update',
      role: 'update',
      handler: () => { this.updateGym(gid);  }
    }],
  });
  await alert.present();
}
  

}


// ****************************************************

// retrieve() : void
// {
//    this._HTTP.get(this._HOST + "gyms").subscribe((data : any) =>
//    {
//       // If the request was successful notify the user
//       this.items = data.records; 
//       console.log(this.items);    
//    },
//    (error : any) =>
//    {
//       console.dir(error);
//    });
// }

// deleteRecord(item : any) : void
// {
//    // Retrieve the document ID from the supplied parameter and 
//    // define the URL which triggers the node route for deleting the document
//    let recordID      : string        = item._id,
//        url           : any           = this._HOST + "api/gallery/" + recordID;

//    // Use Angular's Http module's delete method 
//    this._HTTP
//    .delete(url)
//    .subscribe((data : any) =>
//    {
//       // If the request was successful notify the user
//       this.retrieve(); 
//       this.displayNotification(data.records.name + ' was successfully deleted');      
//    },
//    (error : any) =>
//    {
//       console.dir(error);
//    });
// }

// async displayNotification(message : string) : Promise<void>
// {
//    let toast = await this._TOAST.create({
//      message: message,
//      duration: 3000
//    });
//    toast.present();
// }

// updateRecord(item : any) : void
// {
//    // this.navCtrl.push('manage-gallery', { record : item });
// }

// addRecord() : void
// {
//  console.log("in add record function");
//  // this.navCtrl.push('manage-gallery');
// }

// //  async viewRecord(item : any): Promise<none>
// //  {
// //     let modal = await this._MODAL.create('view-gallery', { record: item });
// //     modal.present();
// //  }
