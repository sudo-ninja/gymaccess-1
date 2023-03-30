import { SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';

import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GymService} from './../../services/gym.service';
import { Gym } from 'src/app/models/gym.model';
import { GymDetailsPage } from '../gym-details/gym-details.page';
import { UserService } from 'src/app/services/user.service';


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


  // Used to store the retrieved documents from the 
  // MongoDB database
//   public items : Array<any>;
//   private _HOST : string = "http://localhost:3000/" || "http://ENTER-YOUR-NETWORK-IP-ADDRESS-HERE:8080/";

  constructor(
   public navCtrl       : NavController,
   private _MODAL       : ModalController,
   private _TOAST       : ToastController,
   private _HTTP        : HttpClient,
   public router :Router,
   public route :ActivatedRoute,
   public gymApi:GymService,
   public loadingController:LoadingController,
   private modalCtrl: ModalController,
   private cd: ChangeDetectorRef, 
   private _user:UserService,

  ) { 
    const user = localStorage.getItem('User');
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);
    }

  

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
   await this.gymApi.wildSearch(id)
   .subscribe(res=>{
     this.gyms=res;
     //  localStorage.setItem('thisGym',JSON.stringify(res));
     loading.dismiss();
   }),err=>{
     console.log(err);
     loading.dismiss();
     }
   }

   ngViewwillenter(){
    
   }
   addGym(){
    this.router.navigate(['/gym-add']);
   }

  addMember(gid:string){
    this.router.navigate(['/member-add']);
    localStorage.setItem('gymID',gid);
    console.log(gid);
  }

  async updateGym(gid:string){
    // to update gym info by long press change event
    // redirect to gym-detail page that consists
    // update and delete
    // same can be done by modal controller also 
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

  removeGym(gym, index) {
    if(window.confirm('Are you sure?')) {
        this.gymApi.delete(gym._id).subscribe((data) => {
          this.gyms.splice(index, 1);
        }
      )    
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
