import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

//for gym select
import { GymService } from 'src/app/services/gym.service';
import { Gym } from 'src/app/models/gym.model';
// to get members infor for perticular gymid
import { MemberserviceService } from 'src/app/services/memberservice.service';
// to store once fetched data from DB to store locally
import { StorageService } from 'src/app/services/storage.service';
import { SafeUrl } from '@angular/platform-browser';

import { Router } from '@angular/router';

import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { GymDetailsPage } from '../gym-details/gym-details.page';



@Component({
  selector: 'app-infor',
  templateUrl: './infor.page.html',
  styleUrls: ['./infor.page.scss'],
})
export class InforPage implements OnInit {

  // for gym selection 
  gyms:Gym[]=[];
  currentGym :any;
  MyDefaultGymValue:any;
  compareWith:any;
  _gym_id:any;
  gymsResult:any;

  // to get members count
  memberResults:any;
  totalMembers:any;
  paidMembers:any;
  freeMembers:any;
  goingtoEndResults:any;
  goingtoExpire:any;
  paidMemberResults:any;
  freeMemberResults:any;
  _daysAfter:any;

  //lock ID toggle set as momentry trigger only
  lockIDtoggleTrigger:boolean = false;

  //listen button event
  // @ViewChild('toggleBtn')
    // public toggleBtn: ButtonComponent;



  constructor(
    public gymApi:GymService, // for Gym selection 
    public memberApi:MemberserviceService, // to get total numer of members
  // to store daa once fetch
    private storageService :StorageService, // storage service is used insted of get set method
    // for alert controller
    public alertController :AlertController,
    // to navigate page to qr code page
    private router: Router,
    //tostcontrole
    private toastCtrl: ToastController,
    //modal controller
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,
    public loadingController:LoadingController,


    ) { 
    // for select default gym in gym selector
    const defaultGym = localStorage.getItem('DefaultGym'); // got default GYM value from Gym list page
    this.MyDefaultGymValue = (JSON.parse(defaultGym))._id;
    this._gym_id=this.MyDefaultGymValue;
    console.log(this._gym_id); // this default Gym got from Gym List page ( first added Gym become Default Gym)
    this.storageService.get('gymList').then((val)=>{
      console.log(val); // here we store once fetched gym data
          this.gymsResult = val;
          console.log(this.gymsResult);
          this.gyms = this.gymsResult;
    });

   
    // Java code for date calculation 
    var date = new Date();
    date.setDate(date.getDate() + 7);
    console.log(date.getTime());
    this._daysAfter = date.getTime();
    console.log(this._daysAfter);

  }

//to prevent double click on submit button 
  // @HostListener('dblclick', ['$event'])
  //   clickEvent(event) {
  //     event.srcElement.setAttribute('disabled', true);
  //     }
  handleRefresh(event) {
        setTimeout(() => {
          this.getMembersData();
          event.target.complete();
        }, 2000);
      };

  ngOnInit() {
    this.getMembersData();

    this.compareWith = this.compareWithFn;     

  }

  ionViewWillEnter(){
  }

  logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

   
  selecthandleChange(ev){
    this.currentGym = ev.target.value;
    this.MyDefaultGymValue = ev.target.value;
    // console.log(this.currentGym);
    this._gym_id = this.currentGym;
    console.log(this._gym_id);
    this.getMembersData();
    this.compareWithFn(this._gym_id,ev.target.value);
    }

  // selecthandleChange(ev){
  //   this.currentGym = ev.target.value;
  //   this.MyDefaultGymValue = ev.target.value;
  //   // console.log(this.currentGym);
  //   this._gym_id = this.currentGym;
  //   console.log(this._gym_id);
    
  //   this.compareWithFn(this._gym_id,ev.target.value);
  //   console.log(this.compareWithFn(this._gym_id,ev.target.value));
  //   }

    compareWithFn(o1, o2) {
      return o1 === o2;
    };

    async getMembersData(){
      const loading = await this.loadingController.create({
        message: 'Loading....'
      });
      await loading.present();
      // to store gym id as same will be used to add member page to add member in perticular gym
      this.storageService.store('defaultGymId',this._gym_id);
      localStorage.setItem('gymID',this._gym_id);
      console.log(this._gym_id);
      
    await this.memberApi.getMemberType(this._gym_id,"free").subscribe((data)=>{
      console.log(this._gym_id);
      this.freeMemberResults = data;
      this.freeMembers = this.freeMemberResults.length;
      loading.dismiss();
    });

   await this.memberApi.getMemberType(this._gym_id,"paid").subscribe((data)=>{
      this.paidMemberResults = data;
      this.paidMembers = this.paidMemberResults.length;
      this.totalMembers = this.freeMembers + this.paidMembers;
      console.log((data));
      loading.dismiss();
    });

    
    await this.memberApi.getGoingtoEndMember(this._gym_id,this._daysAfter).subscribe((data)=>{
      console.log(data);
      this.goingtoEndResults = data;
      this.goingtoExpire = this.goingtoEndResults.length; 
      loading.dismiss();     
    }); 

      
    }

gymIdQrCodeDownload(){
  // from here pass gym id to Qr code page which will generate QR code for download
}

// for QR code generation of gym ID and then download welcome gym QR code page ..
// here we need to make one designer page with center having QR code ..
// download in pdf file with file name as gymID.
  public qrcode_data: string;
  public qrCodeDownloadLink: SafeUrl = "";

    downloadQrCode(gid:any,url:SafeUrl){
      this.qrCodeDownloadLink = url;
      this.qrcode_data=JSON.stringify(gid);

    }

    onChangeURL(url: SafeUrl) {
      this.qrCodeDownloadLink = url;
    }

// lock ID toggle 
lockIdToggle($event:any){
  // console.log("i m in lock id toggle method")
    this.lockIDinputAlert(this._gym_id);
    this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;

}

// alert controller for Lock ID input 
async lockIDinputAlert(gymid:any){  
  const alert = await this.alertController.create({
    header :'Enter New Lock ID',
    inputs: [
    {
        name: 'lock_id',
        type: 'text'
    }],    
    buttons: [
        {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
                console.log('Confirm Cancel');
                this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
            }
        }, 
        {
            text: 'Ok',
            handler: (alertData) => { //takes the data 
              // let validateObj = this.validateEmail(data);
              if(!alertData.lock_id){
                this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
                return;
              }else{
                // console.log(alertData.lock_id);
                this.gymApi.update(gymid,{"gym_lockId":alertData.lock_id}).subscribe((data)=>{
                  console.log("Lock Id Updated as",data.gym_lockId );
                });
              };
                this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
            }
        }
    ]
});
await alert.present();
}

QrCodeDownLoad(){
  this.router.navigate(['/qrlabel/',this._gym_id]);
}

addmoregym(){
  this.router.navigate(['/gym-add/']),{replaceurl:true};
}

async gymUpdate(){
  console.log(this._gym_id);
  this.router.navigate(['/gym-details/',this._gym_id]);
  // here can not use modal controller to update gym dat as with in thos modal gmap modal is used
    //   const modal = await this.modalCtrl.create({
    //   component: GymDetailsPage,
    //   componentProps:{id:this._gym_id},
    //   breakpoints: [0, 0.5, 0.8],
    //   initialBreakpoint: 0.8,      
    // });
    // await modal.present();
  }



async showErrorToast(data: any) {
  let toast = await this.toastCtrl.create({
    message: data,
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss();

  await toast.present();
}

removeGym(){
  // present alert for gym selectionwith two button delet or cancel
  // now check if gym have members .. if gym have memberes then dont delet 
  //show alert contact to app admin as gym have members 
  // if no members in gym then delet and show toast deleted successfully .
}


}
