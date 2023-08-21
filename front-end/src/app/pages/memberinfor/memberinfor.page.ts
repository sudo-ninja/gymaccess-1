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

// add recharge request in feedback service 
import { FeedbackserviceService } from 'src/app/services/feedbackservice.service';
import { Feedback } from 'src/app/models/feedback';
import { highlighteDate } from 'src/app/models/highlighteDate';
import { GymService } from 'src/app/services/gym.service';

 

@Component({
  selector: 'app-memberinfor',
  templateUrl: './memberinfor.page.html',
  styleUrls: ['./memberinfor.page.scss'],
})
export class MemberinforPage implements OnInit {

  currentGym : any;
  defaultJoinedGym :any;
  joinedGyms:any[] =[];

  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  loggeduserName:any;

  memberAttendances:any;
  memberBalanceDays:any;
  memberEndDate:any;
  memberStartDate:any;
  // to store dates of QrUnlock
  attendedDates:[];
  // to highlight dates 
  highlightedDates:any ;
  highlightedDates_m:highlighteDate[]=[];
  

  messageReminder:boolean = false;
  isToggleOn:boolean;


  // member ID
  memberId:string;
  memberID:any;
// for gmap 
  @ViewChild(GmapPage, {static : true}) gmap : GmapPage;
  
  gymId: any;
  lastDate: any;
  MyDefaultGymValue:any;
  _gym_id: any;
  MyDefaultGymValueId: any;
  MyDefaultJoinedGymValue: any;

  constructor(
    private AttendanceApi:AttendanceService,
    private RechargeApi: RechargeService,
    private feedbackApi : FeedbackserviceService,
    private memberApi:MemberserviceService,
    private gymApi:GymService,
    private router :Router,
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

    this.storageService.get('defaultjoinedGymId').then(value=>{
      this.MyDefaultGymValue = value;  
    });
    this.MyDefaultGymValue = localStorage.getItem('defaultjoinedGymId');
    console.log("My Default Gym value",this.MyDefaultGymValue);

   

    //     this.storageService.get('joinedGymList').then((val)=>{
      
    //   this.joinedGyms.push(val);
    //   console.log("line number 103 XXXXXXXXXXXXXXXXXXXXXXX ", this.joinedGyms);
    //  });
    //  this.isUserMember(this.loggeduser.email,this.MyDefaultGymValue);

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

    this.MyDefaultJoinedGymValue = localStorage.getItem('defaultjoinedGymId'); // got default GYM value from Add Gym as soon as Gym Added first gym become Gym list page
    //  this.MyDefaultJoinedGymValue = JSON.parse(defaultGym)._id; // key value saved as string so parse this to get object data
     this._gym_id = this.MyDefaultJoinedGymValue; // intial value of gym is taken as default value 
     console.log("this gym id ***** constructor 137",this._gym_id);
   

  }

  ngOnInit() {
    //get confirmation of user if he is member or not 
// this.isUserMember(this.loggeduser.email);
console.log(this.memberID);
// this.getMemberAttendances(this.memberId);
  }

  ionViewWillEnter(){
    // this.savedJoinedGyms(this.loggeduser.email);
    this.getGyms();
    this.isUserMember(this.loggeduser.email,this.MyDefaultGymValue);
    console.log("Ion View WIll Enter in Member infor page");
  }
 

  
  
  // download data in CSV form , make function and get data from DB in CSV form




Start_Date:any;

Start_Date_ISO:any;
//check if user exist as member or not ?
// if he is not member or deleted by gym then page must route back to home page 
isUserMember(email,gymid){
  this.memberApi.getMemberByEmailOfGymId(email,gymid).subscribe((data:any)=>{
      if(!data){      
      this.router.navigateByUrl('/home',{replaceUrl: true,});
    }else{
      this.memberID = data._id;
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
  console.log("Attendance Data KKKKKKKKKKGGGGGGGGGGGGHHHJJ****************",data.length);
  if(data.length===0){
    console.log("Not Yet Attended");
  }else{ 
  this.attendedDates = data[0].checkin_date;
  console.log(this.attendedDates);
  this.memberAttendances = data.length;
// to spread attended days over calender by yellow color
  for (let i = 0; i < data.length; i++) {
    this.highlightedDates_m.push(
      {
        date:this.toISOStringWithTimezone(new Date(+data[i].checkin_date)).split("T")[0],
        textColor: 'var(--ion-color-warning-contrast)',
        backgroundColor:'var(--ion-color-warning)',
      }
    );
   }
   this.highlightedDates = this.highlightedDates_m;

  } 
});

console.log(this.highlightedDates_m);

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
    this.updatememberLocation(this.memberId);
    }

   
  
  memberLat:any;
  memberLng:any;
    updatememberLocation(id:any){
      this.memberLat = localStorage.getItem('gymLat');
      this.memberLng = localStorage.getItem('gymLng');
      console.log(this.memberLat,this.memberLng);
      this.memberApi.update(id,{"m_address_lat":this.memberLat,"m_address_long":this.memberLng}).subscribe((res)=>{
        console.log(res);
      })
      
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
                    this.feedbackApi.addFeedback({"gym_id":this.gymId,"sender_id":this.memberId,"message":`Extention Request for ${alertData.recharge_days} Days`,"isValidityRequestAlert":true}).subscribe((res)=>{
                      console.log(res);
                    });
        
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

 async getGyms(){
  this.memberApi.getMemberByEmail(this.loggeduser.email).subscribe( // search member by email ID
    (data:any)=>{
      console.log(data.slice());
      this.joinedGyms = data.slice(); // from here passing data to gym selector  for list of gyms   
  }
  );    
}  
 //joined gymlist save in array 
//joined gymlist save in array 
async savedJoinedGyms(email){
  console.log("+++++++++++++++++++");
  this.memberApi.getMemberByEmail(email).subscribe((res)=>{
    for (let i = 0; i <res.length; i++) {
         this.gymApi.getGym(res[i].gym_id).subscribe((data)=>{
          if(!this.joinedGyms.includes(data)){
            console.log("DATA FROM SAVED JOINED GYM ******",data);
            this.joinedGyms.push(data); 
          } return;    
          });
    };
  });
  console.log("UUUUUUUU****",this.joinedGyms);

}

selecthandleChange(ev){
  console.log("ev.target.value====",ev.target.value);
  this.currentGym = ev.target.value;
  console.log("this.currentGym:--",this.currentGym);
  this.MyDefaultJoinedGymValue = ev.target.value;
  console.log("Select Handle Change event",this.MyDefaultJoinedGymValue);
  this._gym_id = this.currentGym;
  console.log(this._gym_id);
  this.getMembers();
  this.compareWithFn(this._gym_id,ev.target.value);
  }

compareWithFn(o1, o2) {
    return o1 && o2 ? o1._id == o2._id : o1 == o2;
    // return o1 === o2;
  }

  async getMembers() {
    console.log('get data from member list');
    this.storageService.store('defaultjoinedGymId',this._gym_id);
    localStorage.setItem('defaultjoinedGymId',this._gym_id);
    console.log("default gym id send by getmembers() method",this._gym_id);
    this.getMemberofGymId(this._gym_id);
   
  }

  
  async getMemberofGymId(gymid){
    console.log("GYM ID from getMemberbyGymID : 275 ",gymid);
    localStorage.setItem('defaultjoinedGymId',gymid);
    this.storageService.store('defaultjoinedGymId',gymid);
      this.isUserMember(this.loggeduser.email,gymid);
      // this.popover.dismiss(); // to close popover
      // loading.dismiss();
    }


}
