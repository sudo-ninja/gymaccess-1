import { ChangeDetectorRef, Component, OnInit,ViewChild  } from '@angular/core';
// call attendance services
import { AttendanceService } from 'src/app/services/attendance.service';

//to get current location Lattitude and Longitude
import { Geolocation } from '@capacitor/geolocation';

//call recharge service
import { RechargeService } from 'src/app/services/recharge.service';

// call storage service
import { StorageService } from 'src/app/services/storage.service';

// loading control and modal controller 
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

// call member service
import { MemberserviceService } from 'src/app/services/memberservice.service';


// call gmap page for location update 
import { GmapPage } from '../gmap/gmap.page';

 

@Component({
  selector: 'app-memberinfor',
  templateUrl: './memberinfor.page.html',
  styleUrls: ['./memberinfor.page.scss'],
})
export class MemberinforPage implements OnInit {

  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  loggeduserName:any;

  memberAttendances:any;
  memberBalanceDays:any;
  memberEndDate:any;
  memberStartDate:any;
  

  messageReminder:boolean = false;
  isToggleOn:boolean;


  // member ID
  memberId:string;
  memberID:any;
// for gmap 
  @ViewChild(GmapPage, {static : true}) gmap : GmapPage;
  
  gymId: any;
  lastDate: any;

  constructor(
    private AttendanceApi:AttendanceService,
    private RechargeApi: RechargeService,
    private memberApi:MemberserviceService,

    public route :ActivatedRoute,
    public router :Router,
    public loadingController:LoadingController,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private cd: ChangeDetectorRef,
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
     this.isUserMember(this.loggeduser.email);

// get member by email , get ID from here 

// get member end date
// this.getMemberEndDate(this.loggeduser.email);
// fetch member current location as soon as page is open
this.fetchLocation();

   
    // to update adress give link of google map and fetch lat long and pass them to update based on id.

    // add loading controller so that after refresh ..fresh data can come from DB 

    // for recharge request .. call rechargeAPI 
    // make alert controller
    // pass in handle API to add days to DB and status NOT
    // as soon as success saved in DB , pass message to admin in message center
    // if try to again request for recharge , check if status NOT then send alert 
    // if status Yes , then delet old request and add new 
    // status to be made Yes , if admin open message as alert controller and click on ok
    // and incresed validy end date by sent days and update member by id recharge status Yes.
    //

  }

  ngOnInit() {
    //get confirmation of user if he is member or not 
// this.isUserMember(this.loggeduser.email);
console.log(this.memberID);
// this.getMemberAttendances(this.memberId);
  }

  // logs: string[] = [];

  // pushLog(msg) {
  //   this.logs.unshift(msg);
  // }

  // handleChange(e) {
  //   this.pushLog('ionChange fired with value: ' + e.detail.value);
  // }

  
  
  // download data in CSV form , make function and get data from DB in CSV form




Start_Date:any;

Start_Date_ISO:any;
//check if user exist as member or not ?
// if he is not member or deleted by gym then page must route back to home page 
isUserMember(email){
  //search member DB for this email 
  this.memberApi.getMemberByEmail(email).subscribe((data:any)=>{
    console.log(new Date(data.m_startdate*1));
    console.log(this.Start_Date);
      console.log(this.Start_Date_ISO);
      console.log(this.memberStartDate);
    this.memberID = data._id;
    if(!data){      
      this.router.navigateByUrl('/home',{replaceUrl: true,});
    }else{
      console.log(data._id);
      this.memberId = data._id;
      this.memberEndDate = data.m_enddate*1; // in Unix millisecond formate
      // this.memberOutTime = data.m_outtime*1 // in Unix milisecond
      // this.memberInTime = data.m_intime*1// in unix milisecond
      this.gymId = data.gym_id // get gym ID
      this.lastDate = this.memberEndDate;
      this.isToggleOn = data.isSetReminder;
      this.memberStartDate = data.m_startdate;
      this.Start_Date = this.toISOStringWithTimezone(new Date(this.memberStartDate*1));
      this.Start_Date_ISO =  new Date(this.memberStartDate*1);
       
      this.lastDate = this.toISOStringWithTimezone(new Date(this.lastDate*1));
      const Time = (this.memberEndDate)-(new Date().getTime())
      // this.daysLeft = Math.floor(Time / (1000 * 3600 * 24)) + 1;
      // this.checkinTime = this.memberInTime;
      // this.checkinTime = new Date(this.checkinTime);
      // this.checkoutTime = this.memberOutTime;
      // this.checkoutTime  = new Date(this.checkoutTime);
      // this.firstAttendance = data.isAttended;

      this.getMemberAttendances(this.memberId);

    }
      
  });
  
      
}

// get members attendnace 
getMemberAttendances(mId:any){
  console.log(mId);
this.AttendanceApi.getMemberAttendance(mId).subscribe((data:any)=>{
  console.log(data.length);
  this.memberAttendances = data.length;
});
}



changeToggle(event:any){
  console.log(event.detail.checked)
  if(event.detail.checked){
    
    this.memberApi.update(this.memberID,{"isSetReminder":true}).subscribe((res)=>{
      console.log(res);
    });
    // event.target.checked = false;
  }else{
    
    this.memberApi.update(this.memberID,{"isSetReminder":false}).subscribe((res)=>{
      console.log(res);
    });
  }
}

Reminder(){
  if(this.isToggleOn){
    this.setReminder(this.loggeduser.email,7)
  }
}

setReminder(email:any,days:any){
  // Java code for date calculation
  var reminderDate ; 
  var date = new Date();
  date.setDate(date.getDate() + days);
  console.log(date.getDate());
  reminderDate = date.getDate();
  console.log(reminderDate);
  var dbEndDate;
  var toDay;
  const sevenDaysAgo: Date = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  
      dbEndDate=  new Date(this.memberEndDate).getTime();
      toDay= Date.now();
      if(dbEndDate < sevenDaysAgo){
        console.log(this.memberEndDate,`End Date is less then reminder date`,);
        this.messageReminder = true;
        console.log(this.messageReminder);
      }else {
        console.log("End Date is far away from reminder date ");
      }
     
    
  
}

async presentAlert(header:string,subheader:string, message:string) {
  const alert = await this.alertController.create({
    header:header,
    subHeader: subheader,
    message:message,
    buttons: ['OK'],
  });
  await alert.present();
}

// to fetch member location
current_lat:any
current_long:any
async fetchLocation(){
  const _geoLocation = Geolocation.getCurrentPosition();
  console.log('current location =', _geoLocation);
  const coordinates = await Geolocation.getCurrentPosition();    
  console.log('Current position:--', coordinates.coords.latitude,coordinates.coords.longitude);
  this.current_lat=coordinates.coords.latitude;
  this.current_long=coordinates.coords.longitude;
  localStorage.setItem('current_lat',this.current_lat);
  localStorage.setItem('current_long',this.current_long);
}

// use to set google map location of user
async getLocation()
      // this.router.navigateByUrl("/gmap",{replaceUrl:true});

      // this.gmap.locate();
      {
        const modal = await this.modalCtrl.create({
        component: GmapPage,
        // componentProps:{id:uid},
        // breakpoints: [0, 0.5, 0.8],
        // initialBreakpoint: 0.8,      
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.message = `Hello, ${data}!`;
    }
    }



    // recharge request alert
rechargeRequestAlert(){
  this.RechargeApi.getRechargeRequestMadeByMemberId(this.memberId).subscribe((data) => {
    console.log(data.length);
   if(!data.length){
      this.rechargeRequestAlertFirst();
    }else{
      this.rechargeRequestMessageAlert("Already Request Sent","Please wait for request approval ..")

   }
 });
}
    async rechargeRequestAlertFirst(){  
      const alert = await this.alertController.create({
        header :'Enter Days for Recharge',
        inputs: [
        {
            name: 'recharge_days',
            type: 'number'
        }],    
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    console.log('Confirm Cancel');
                }
            }, 
            {
                text: 'Ok',
                handler: (alertData) => { //takes the data 
                    console.log(alertData.recharge_days);
                     this.RechargeApi.addRecharge({"member_id":this.memberId,"days":alertData.recharge_days,"isAccepted": "0"}).subscribe((data)=>{
                      console.log(data);
                     });
                }
            }
        ]
    });
    await alert.present();
    }


    async rechargeRequestMessageAlert(header:string, message:string) {
      const alert = await this.alertController.create({
        header:header,
      
        message:message,
        buttons: ['OK'],
      });
      await alert.present();
    }


    // async handleChange(e) {
    //   if(e.detail.checked) {
    //     this.presentPrompt(data => {
    //       const todoName = data.todo;
    //       console.log('Todo submitted:', todoName);
    //       if(!todoName) {
    //         e.target.checked = false;
    //       }
    //     }, () => {
    //       console.log('Prompt cancelled');
    //       e.target.checked = false;
    //     });
    //   }
    // }
     
      highlightedDates = (isoString) => {
        const date = new Date(isoString);
        const utcDay = date.getUTCDate();
    
        if(utcDay % 5 === 0) {
          return {
            textColor: '#800080',
            backgroundColor: '#ffc0cb',
          };
        }
    
        if(utcDay % 3 === 0) {
          return {
            textColor: 'var(--ion-color-secondary-contrast)',
            backgroundColor: 'var(--ion-color-secondary)',
          };
        }
    
        return undefined;
      };


      // convert date to ISO string with timezone
  toISOStringWithTimezone(date)
  {
   const tzOffset = -date.getTimezoneOffset();
   const diff = tzOffset >= 0 ? '+' : '-';
   const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
   return date.getFullYear() +
     '-' + pad(date.getMonth() + 1) +
     '-' + pad(date.getDate()) +
     'T' + pad(date.getHours()) +
     ':' + pad(date.getMinutes()) +
     ':' + pad(date.getSeconds()) +
     diff + pad(tzOffset / 60) +
     ':' + pad(tzOffset % 60);
 };

}
