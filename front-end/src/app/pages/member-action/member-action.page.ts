import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//to get current location Lattitude and Longitude
import { Geolocation } from '@capacitor/geolocation';
import { Gym } from 'src/app/models/gym.model';

//call service for attendance here
import { Member } from 'src/app/models/member.model';
import {MemberserviceService} from 'src/app/services/memberservice.service';

import {AttendanceService} from 'src/app/services/attendance.service';
import { AlertController, IonModal, LoadingController, ModalController, PopoverController } from '@ionic/angular';
// call service for lock open 
import { MqttService } from 'src/app/services/mqtt.service';
// call service of gym for gym lock id
import { GymService } from 'src/app/services/gym.service';
import { CancelOptions, Channel, LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

//call fedback service to send subscription expiry alert
import { FeedbackserviceService } from 'src/app/services/feedbackservice.service';

// to call components here 
import { IonicModule } from '@ionic/angular';
import { BannerComponent } from '../../components/banner/banner.component';
//call banner service 
// call banner service 
import { BannerService } from 'src/app/services/banner.service';
import { environment } from 'src/environments/environment.prod';
//for google login
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { StorageService } from 'src/app/services/storage.service';
import { McontrolService } from 'src/app/services/mcontrol.service';
import { JwtService } from 'src/app/services/jwt.service';

// for overlay display when modal is dismissed
import { OverlayEventDetail } from '@ionic/core/components';

//for log 
import {LogsService} from 'src/app/services/logs.service'


@Component({
  selector: 'app-member-action',
  templateUrl: './member-action.page.html',
  styleUrls: ['./member-action.page.scss'],
  
})
export class MemberActionPage implements OnInit {
//get control of popover as used in ng template 
  @ViewChild('popover') popover: PopoverController;

  
  baseUri : string = environment.SERVER;
  //slide show 
  slides: any[] = [];

  loggedUserEmail:any;
  loggedUserName:any;
  isloggedUserMember:boolean;

  scannedResult:any;
  content_visibility = '';
  ishidden : boolean = true;


  dateTime;

  attendanceForm!: FormGroup;
  isLoadingResults = false;

  lastAttendance: any;
  attendance_lat:any;
  attendance_lon:any;
  todayAttendance:boolean = false;
  firstAttendance:boolean;

  memberId:any;
  memberEndDate:any;
  memberOutTime:any;
  memberInTime:any

  unixCurrentDateTime:any;
  
  username:String='';

  daysLeft:any;
  lastDate:any;
  checkinTime:any;
  checkoutTime:any;

  gymId:any;
  lockId:any;
  gymName:any;
  compareWith:any;
  joinedGyms:any[]=[];
  defaultGymId:any;


  serviceProviders: any; // serviceprovider means admin as he is providing service to members.
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  // usersUrl:string='http://localhost:3000/api/v1/users';// URL at postman from where all user are fetched
  usersUrl:string=this.baseUri+'/users';// URL at postman from where all user are fetched
  
  originalserviceProvider:any;
  selectedService:any;
  scanActive: boolean = false;
  currentGym: any;
  MyDefaultJoinedGymValue: any;
  _gym_id: any;
  userProfileImage: string;
  user: null;
  
  memberForm!: FormGroup;
  userMobile: string;
  defaultGymId_store: any;
  joiningGymName: string;
  firstMemberId: any;
  firstJoinedGym:Gym[];

  // ion modal data
  enteredCode: string;
  InvitationCodes:any;

  // install https://github.com/capacitor-community/barcode-scanner plugin 

  constructor(
    private router:Router,
    private http:HttpClient,
    private attenApi:AttendanceService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController, 
  
    private memberApi:MemberserviceService,
    private lockApi:MqttService,
    private gymApi:GymService,
    private feedbackApi:FeedbackserviceService,
    public loadingController:LoadingController,
    // banner service api
    private bannerApi:BannerService,
    //log serice
    private logService:LogsService,
   
//user api
      private userApi:UserService,
      private jwtService:JwtService,
      // member control service to check if user is invited or not
      private memberControlApi: McontrolService,

  private storageService :StorageService, // storage service is used insted of get set method

  ) {
    let decodedToken = this.jwtService.DecodeToken(this.userApi.getToken());
    decodedToken = JSON.stringify(decodedToken);
    console.log(decodedToken);
    // Parse the JSON string into a JavaScript object
    this.user = JSON.parse(decodedToken);

      const user = localStorage.getItem('User')
      this.loggeduser=JSON.parse(decodedToken);
      this.loggedUserEmail = this.loggeduser.email;
      // console.log(this.loggedUserEmail);
      // this.loggedUserName = this.loggeduser.username;
      //this block is used if user deleted by himself or by gym admin then go back to home page
      this.userApi.getUserbyEmail(this.loggedUserEmail).subscribe(
        res=>{
          // this.addName(res),
          console.log(res);
          this.isloggedUserMember = res.isMember;
          this.loggedUserName = res.username;
          this.userProfileImage = res.profile_image;
          this.memberApi.getMemberByEmail(this.loggedUserEmail).subscribe({
            next:res=>{
              if(!res){
                this.router.navigateByUrl('home', {replaceUrl: true});
              }else{
                return;
              }
            }
          });
        },
        error=>{
          // this.router.navigate(['/login'])
          console.log(error)
        }
       )
      // to get current user location as soon as page is opened
      this.fetchLocation();
      console.log(this.memberEndDate);
      //get default gym list data 
       console.log("DEFAULT GYM ID IN CONSTRUCTOR ",localStorage.getItem('defaultjoinedGymId'));
       this.storageService.get('defaultjoinedGymId').then(value=>{
        console.log(value);
        this.defaultGymId_store = value;
       });
      //  this.defaultGymId_store = localStorage.getItem('defaultjoinedGymId');
       

      this.storageService.get('joinedGymList').then((val)=>{
        console.log(val);
      this.firstJoinedGym.push(val);
         console.log("First Joined Gym ID =====",this.firstJoinedGym);
         
      this._gym_id = this.firstJoinedGym[0]._id;
    });

    this.storageService.get('joinedGymMemberId').then((val)=>{
      this.firstMemberId = val;
      console.log("Member ID accepting the Invitaion code", this.firstMemberId);
    });



    
    this.MyDefaultJoinedGymValue = localStorage.getItem('defaultjoinedGymId'); // got default GYM value from Add Gym as soon as Gym Added first gym become Gym list page
  //  this.MyDefaultJoinedGymValue = JSON.parse(defaultGym)._id; // key value saved as string so parse this to get object data
   
  this._gym_id = this.MyDefaultJoinedGymValue; // intial value of gym is taken as default value 
   console.log("this gym id ***** constructor 187",this._gym_id);
 

  }

  addName(data:any){
    this.username = data.username;
    // console.log(this.username);
  }

  ngOnInit() {
    // this.isUserMember(this.loggeduser.email);
    this.getMembers();
    // to get default data in ion select 
    this.compareWith = this.compareWithFn;
    // this.getMemberofGymId(this.defaultGymId_store);
    // slide show ..
    this.bannerApi.getImageByGymId(this.gymId).subscribe({
      next:res=>{
        console.log(res.length);
        if(!res.length){   // if no image uploaded by gym admin then show default images
          this.bannerApi.getImageByGymId("default_memberaction_page").subscribe({            
            next:dat=>{
              console.log(dat)
              for (let i = 0; i <dat.length; i++) {
                // make array of image objects
                this.slides.push(
                  {banner:this.baseUri+'/images/'+dat[i].image_path}
                );
              };
            },
            error:err=>{ console.log(err)}
          });
      //     this.slides = [
      //       {banner: 'assets/imgs/1.jpg'},
      //       {banner: 'assets/imgs/2.jpg'},
      //       {banner: 'assets/imgs/3.jpg'},
      //  ]        
      } else{ 
        for (let i = 0; i < res.length; i++) {
          // make array of image objects
          this.slides.push(
            {banner:this.baseUri+'/images/'+res[i].image_path}
          );
        };
      }
      },
      error:err=>{
        console.log(err);
      }
    });
//     

    setTimeout(() => {
      this.dateTime = new Date().toISOString();
    });

    // const token = localStorage.getItem('token');
    // //  to make sure only user can see this page by login so this is done 
    // const user = localStorage.getItem('User')
    // // this.addName(user);
    // console.log(user); // here user info is being display after login successfull
   
    // if(token==null){
    //   this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
    // }else{
    //   // console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
    //   this.loggeduser=JSON.parse(user);
    //   console.log(this.loggeduser._id);
    // }
  }

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({force: true });
      if (status.granted) {
      //   // the user granted permission
      const event = {
        "email":this.loggedUserEmail,
        "type":"Camera Permission",
        "timestamp":new Date().toISOString(),
        "details":"Camera Permission for Barcode Scan"
      }
       
      this.logService.logEvent(event).subscribe({
              next:response => console.log('Event logged successfully:', response),
              error:error => console.error('Error logging event:', error)
        });
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
    }
  }

  ngAfterViewInit(){
    // BarcodeScanner.prepare(); // this iwll startcamea as soon as page open so dont use this
  }

  ionViewWillEnter(){
     console.log("Ion View Will Enter");
     this.getMembers();
     this.getGyms();    
  }

  async getGyms(){
    this.memberApi.getMemberByEmail(this.loggeduser.email).subscribe( // search member by email ID
      (data:any)=>{
        // console.log(data.slice());
        this.joinedGyms = data.slice(); // from here passing data to gym selector  for list of gyms   
    }
    );    
  }  

  async getMemberofGymId(gymid){
    console.log("GYM ID from getMemberbyGymID : 275 ",gymid);
    localStorage.setItem('defaultjoinedGymId',gymid);
    this.storageService.store('defaultjoinedGymId',gymid);
      this.getMemberbyGymIdandEmail(gymid,this.loggedUserEmail);
      this.popover.dismiss(); // to close popover
      // loading.dismiss();
    }

  async getMemberbyGymIdandEmail(gymid,email){
    // console.log("🚀 ~ file: member-action.page.ts:281 ~ MemberActionPage ~ getMemberbyGym̥IdandEmail ~ getMemberbyGym̥IdandEmail:")
    // //set default GYM id from here to be used on other pages 
    // console.log("GYM ID in side GetMemberby Gym ID and Email 283- ",gymid,"Email:-",email);     
      this.memberApi.getMemberByEmailOfGymId(email,gymid).subscribe((data)=>{
      // console.log(data);
      this.memberId = data._id;
      this.memberEndDate = Number(data.m_enddate); // in Unix millisecond formate
      this.memberOutTime = Number(data.m_outtime);// in Unix milisecond
      this.memberInTime = Number(data.m_intime);// in unix milisecond
      this.gymId = data.gym_id; // get gym ID
      this.lastDate = this.memberEndDate;
      this.lastDate = new Date(this.lastDate);
      const Time = (this.memberEndDate)-(new Date().getTime())
      this.daysLeft = Math.floor(Time / (1000 * 3600 * 24)) + 1;
      this.checkinTime = this.memberInTime;
      this.checkinTime = new Date(this.checkinTime);
      this.checkoutTime = this.memberOutTime;
      this.checkoutTime  = new Date(this.checkoutTime);
      this.firstAttendance = data.isAttended;
      // get gym data like gym lock ID,Gym Name also etc.
      this.gymApi.getGym(this.gymId).subscribe((data:any)=>{
        this.lockId = data.lockId;
        this.gymName = data.gym_name;   
   });
      
  });
}

  async startScan() {    
    try {
      const permission = await this.checkPermission();
      if(!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();// make background of WebView transparent
      this.ishidden = false;
      this.scanActive = true; // this will impose new item as over page
      this.storageService.store("scanActive","true");

      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      this.ishidden = false;
      const result = await BarcodeScanner.startScan();
      // console.log(result);
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if(result?.hasContent) {
        // console.log(result.content);
        this.scannedResult = result.content;
        this.scanActive = false;
        /***** here below code working for attendance */
        if(this.scannedResult.includes(this.gymId)){
          this.attendance();//*call attendance */ */
        }else{
          // console.log("not valid qr code");
          this.presentAlert("Warning !","Not a Valid QR Code" , "Try with valid QR code")
          // here make alert showing that not a valid qr code ..
        }
        // console.log(this.scannedResult);
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }
    
  }
 

  stopScan() {
    // console.log("in stop scan");
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
    this.scanActive = false;
    this.ishidden = true;
    this.storageService.store("scanActive","false");
    this.storageService.removeItem("scanActive");
  }

  ngOnDestroy(): void {
      this.stopScan();
  }

  async attendance(){     
    this.attendanceForm = this.formBuilder.group({
      'member_id' : this.memberId,
      'checkin_date' : Date.now(),
      'checkin_time': new Date().toLocaleTimeString(),
      'lock_status' :['opened', [Validators.required ]] ,
      'att_lat': [this.attendance_lat, [Validators.required ]],
      'att_long':[this.attendance_lon, [Validators.required ]] ,
    });

    this.validAttendance(new Date(),new Date().toLocaleTimeString(),this.loggeduser.email);
   
  }

  async presentAlert(header:string,subheader:string, message:string) {
    const alert = await this.alertCtrl.create({
      header:header,
      subHeader: subheader,
      message:message,
      cssClass : 'customRedAlert',
      mode: 'ios',
      buttons: ['OK'],
    });
    await alert.present();
  }


async fetchLocation(){
    const _geoLocation = Geolocation.getCurrentPosition();
    // console.log('current location =', _geoLocation);
    const coordinates = await Geolocation.getCurrentPosition();    
    // console.log('Current position:--', coordinates.coords.latitude,coordinates.coords.longitude);
    this.attendance_lat=coordinates.coords.latitude;
    this.attendance_lon=coordinates.coords.longitude;
}

async validAttendance(current_date:any,current_time:any,email:any)
{
  
  // here we will first fetch member using email id as already done in constructor use that data only 
      // console.log((new Date(current_date)).getTime());  // to get current date in unix 
    this.unixCurrentDateTime = (new Date(current_date)).getTime();
    try {
          if((this.memberEndDate)>=(this.unixCurrentDateTime))
            {
            // console.log("End Date is Greater than current Date");
              // console.log("DB out time :", new Date(this.memberOutTime).getHours(), "current time:",new Date(this.unixCurrentDateTime).getHours());
                if((new Date(this.memberOutTime).getHours()+1)>=new Date(this.unixCurrentDateTime).getHours()) // if in time 7:40 and out time 9:50, then it will chech 7 in time and 10 out time
                {
                    // console.log("valid attendance in term of Hourly time but chech in time");
                    if(new Date(this.memberInTime).getHours()<=new Date(this.unixCurrentDateTime).getHours())
                    {
                      
                      if(!this.firstAttendance)
                      {
                        console.log("First Attendance");                        
                        this.attenApi.addAttendance(this.attendanceForm.value).subscribe((res:any)=>{                      // console.log(res); 
                              
                          this.openLock(email); // iff attendance saved then only open the lock
                            });
                            this.firstAttendance = true;
                            // once first attendenace made member updated as attended and every time it will b check
                           this.memberApi.update(this.memberId,{"isAttended":true}).subscribe((res:any)=>{
                            // console.log(res);
                            
                           });
                      }else{
                        console.log("Second Attendance"); 
                        // pass two query param , member id and today date and fetch data 
                        //if any data comes from DB then check its checkin date 
                        // if check it date same as today 
                        // update the data
                        // else add attendnace 
                        // this.attenApi.getMemberAttendance(this.memberId).subscribe((res)=>{
                        //   console.log(res);                            
                        // })
                        this.attenApi.getMemberAttendance(this.memberId).subscribe((data:any)=>{
                          this.lastAttendance = data[data.length-1].checkin_date;
                          // get date in last attendance 
                          this.lastAttendance = new Date(this.lastAttendance*1).getDate();
                          // compare that day with today 
                            if(this.lastAttendance === new Date(Date.now()).getDate()){
                                  console.log("Today again attendnace ");
                                    this.todayAttendance = true;
                                    // console.log(data[data.length-1]._id);
                                    this.todaySecondAttendance(data[data.length-1]._id,email);
                            } 
                            else{
                              this.attenApi.addAttendance(this.attendanceForm.value).subscribe((res:any)=>{
                              console.log(res);      
                              this.openLock(email); // iff attendance saved then only open the lock                              
                              });
                            }
                      
                      });
                      }

                          
                    
                    /* if this.attenAPI get member id and check in data is today is not eqaul to ttoday
                    then only allow add attendance otherwise if we got data with query of member id and today date
                    then only update data
                    for this make query param member_id and checkin_date */
                  }else{
                        // console.log("Not Allowed at this Time..Contact Admin");
                        this.presentAlert("Please Wait !","Contact Admin","Too Early");
                    }
                }else{
                      // console.log("Not Allowed at this Time..Contact Admin");
                      this.presentAlert("Not Allowed !","Contact Admin","Too Late ");
                      }

            }else {
                  // console.log("Time Expired Contact Admin to Increase Validity");
                  this.feedbackApi.addFeedback({"gym_id":this.gymId ,"sender_id":this.memberId,"message":"Validity Expired","isFeedback":false,"isExpiryAlert":true}).subscribe((res)=>{
                    console.log(res);
                  
                  });
                  this.presentAlert("Validity Expired","Contact Admin","");
                  };
        } catch (error) {
      throw error;
    }
  }

async todaySecondAttendance(data:any,email:any){
  const loading = await this.loadingController.create({
    message: 'Loading....'
  });
  await loading.present();
  this.attenApi.update(data,this.attendanceForm.value).subscribe((res:any)=>{
            console.log(res);
            loading.dismiss();
            this.openLock(email); // iff attendance saved then only open the lock
                });

}

openLock(email:any){
  console.log("Lock Open Comand Given");    
        //  this.gymApi.getGym(this.gymId).subscribe((data:any)=>{
        //       this.lockId = data.lockId;
        //       this.gymName = data.gym_name;
        //   });          

          this.lockApi.openLock(
            {
              topic:this.lockId,
              message:"1"
            }
          );
          console.log("Lock succesfull open");
          this.successAlert("ACCESS ALLOWED","Welcome","");
// need to pass unique Lock ID -- to pass unique lock is , use gym pi query using member email, and get lock ID assign that to unique lock id
// unique lock ID will be saved along with Gym Detail
// unique lock ID will be topic for that lock 
  // if valid attendance 
  // then only open lock 
  // if not valid ..show alert control .. 
  //contact Gym Administrator    
}


// to calculat distance betwwen two point
distance(lat1, lat2, lon1, lon2)
{
// The math module contains a function
// named toRadians which converts from
// degrees to radians.
lon1 =  lon1 * Math.PI / 180;
lon2 = lon2 * Math.PI / 180;
lat1 = lat1 * Math.PI / 180;
lat2 = lat2 * Math.PI / 180;

// Haversine formula
let dlon = lon2 - lon1;
let dlat = lat2 - lat1;
let a = Math.pow(Math.sin(dlat / 2), 2)
+ Math.cos(lat1) * Math.cos(lat2)
* Math.pow(Math.sin(dlon / 2),2);

let c = 2 * Math.asin(Math.sqrt(a));

// Radius of earth in kilometers. Use 3956
// for miles
let r = 6371;

// calculate the result
return(c * r);
}

//check if user exist as member or not ?
// if he is not member or deleted by gym then page must route back to home page 
async isUserMember(email){
  //search member DB for this email 
  this.getmemberbyEmail(email);
}

async getmemberbyEmail(email){
  this.memberApi.getMemberByEmail(email).subscribe((data:any)=>{
    console.log(data); // here in version two check with email and gym id 
    if(!data){      
      this.router.navigateByUrl('/home',{replaceUrl: true,});
    }else{
       this.savedJoinedGyms(email);
       this.getMemberbyGymIdandEmail(this.defaultGymId_store,email);
// now pass this lock ID to scanned result to check is its same or not. 
    }
  });
}

balanceDaysLeft(){
  console.log(this.memberEndDate);
  console.log(new Date().getTime());
  console.log(this.unixCurrentDateTime);
this.daysLeft = (this.memberEndDate)-(this.unixCurrentDateTime)
console.log(this.daysLeft);
}

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

// async validDaysCalc() {
//   console.log(this.Start_Date_UTC);
//   console.log(this.End_Date);
//   var _todayDate = moment(new Date());
//   var _StartDate = moment(new Date(this.Start_Date_UTC));
//   var _EndDate = moment(new Date(this.End_Date));

//   var _todayModified = new Date();
//   var _SDModified = new Date(this.Start_Date_UTC);
//   var _EDModified = new Date(this.End_Date);

//   const Time = _EDModified.getTime() - _SDModified.getTime();
//   this.BalanceDays = Math.floor(Time / (1000 * 3600 * 24)) + 1;
//   console.log('Duration Balance Days:', this.BalanceDays);
//   localStorage.setItem('balanceDays', this.BalanceDays);

// }

//https://www.youtube.com/watch?v=A3X0-ZgU-KI
// follow this video to know more about notifiction 

async isscheduleNotification(){
  let options:ScheduleOptions={
    notifications:[
      {
        id:111,
        title:"Reminder Notification",
        body:"Explore new offers",
        largeBody:"Get 30% Discount",
        summaryText:"Exciting Offers !!!!",
        largeIcon:'res://drawable/splash.png',
        smallIcon:'res://drawable/splash.png',
        channelId:"channel2",
        schedule:{every:'second'}
      },
      {
        id:222,
        title:"Upgrade Notification",
        body:"Upgrade Member Subscription",
        largeBody:"Get Discount on Long Period Subscription",
        summaryText:"required action !!!!",
        // largeIcon:'res://drawable/splash.png',
        // smallIcon:'res://drawable/splash.png',
        channelId:"channel1",
        schedule:{every:'second'}
      }
    ]
  }
  try{
    await LocalNotifications.schedule(options);
  }
  catch(ex)
  {
    alert(JSON.stringify(ex));
  }
}

async cancelNotification(){
    let op:CancelOptions={
      notifications:[{id:222}]
    }
    await LocalNotifications.cancel(op);
}

async removeAllDeliveredNotifications(){
   await LocalNotifications.removeAllDeliveredNotifications();
}


async getDeliveredNotifications(){
  LocalNotifications.getDeliveredNotifications().then((res)=>{
    alert(JSON.stringify(res));
  })
}

async createChannel(){

  let channel1:Channel={
    id:"channel1",
    description:"first channel",
    name:"Channel 1",
    visibility:1,
  }

  let channel2:Channel={
    id:"channel2",
    description:"first channel",
    name:"Channel 2",
    visibility:1,
  }

  try{
    await LocalNotifications.createChannel(channel1);
    await LocalNotifications.createChannel(channel2);
  }
  catch (exp){
    alert(exp)
  }
}

async listChannel(){
  await LocalNotifications.listChannels().then((res)=>{
    alert(JSON.stringify(res));
  })
}

memberActionSelected(){
  
}
// also get gym ID by QR scaner result and 
// using that search gym 
// cross verify if member have that gym id 
//if yes then check 
// gym location lat long and user him self lat long 
// compare them ( use some java script formula)
// set limit of verified location distance allowed

// make one more page for settings 
/*take following data from users
1. allowed disatnce that will be used for GPS location ( minimum 100m)
2. how many time user allowed to open lock in given time for paid memebr (minimum 6)
3. allow your gym location to be seen to non members of your gym 
4. allow your members location to be seen to other gyms
5. set reminder for balance days ( Minimum days 5)*/

/* menue page for admin 
1. get member attendance motnhly 
2. Print again QR code for gym 
3. Edit Gym Info ..  
4. logout 
5. non clickable  page 
5.1 Member Fees
5.2 total amount receivable per month / year 
5.3 amount received ?
5.4 amount balance  ?
6.0 set fees alert */

handleRefresh(event) {
  setTimeout(() => {
    // here write API 
    // this.isUserMember(this.loggedUserEmail);
    this.getMembers();
    event.target.complete();
  }, 2000);
};


// if succesfull lock open then show alert in green color "Access Allowed"
async successAlert(header:string,subheader:string, message:string) {
  const alert = await this.alertCtrl.create({
    header:header,
    subHeader: subheader,
    message:message,
    mode:'ios',
    cssClass : 'customGreenAlert',
    buttons: ['OK'],
  });
  await alert.present();
}
// if any other issue show alert "Access Denied"in red color background
// to select joined gym in ion select 

selecthandleChange(ev){
  this.currentGym = ev.target.value;
  this.MyDefaultJoinedGymValue = ev.target.value;
  console.log("Select Handle Change event",ev);
  this._gym_id = this.currentGym;
  console.log(this._gym_id);
  this.getMembers();
  this.compareWithFn(this._gym_id,ev.target.value);
  }


  compareWithFn(o1, o2) {
    return o1 === o2;
  };

  async getMembers() {
    console.log('get data from member list');
    this.storageService.store('defaultjoinedGymId',this._gym_id);
    localStorage.setItem('defaultjoinedGymId',this._gym_id);
    console.log(this._gym_id);
    this.getMemberofGymId(this._gym_id);
   
  }

  // route to person information page 
  personalInformation(){
    // console.log("this.memberId",this.memberId); // show personal information based on member ID 
    this.router.navigateByUrl('/personalinformation');
  }

  //joined gymlist save in array 
  async savedJoinedGyms(email){
    console.log("+++++++++++++++++++");
    this.memberApi.getMemberByEmail(email).subscribe((res)=>{
      //as of now it will show only 1 member ..but need to change at back end to show more members
      //make change and back end use find instead of findone.
      for (let i = 0; i <res.length; i++) {
        // make array of image objects
        // this.joinedGyms.push(
          this.gymApi.getGym(res[i].gym_id).subscribe((data)=>{
            if(!this.joinedGyms.includes(data)){
              // console.log("DATA FROM SAVED JOINED GYM ******",data);
              this.joinedGyms.push(data); 
            } return;
               
            });
        // );
      };
    });
    console.log("UUUUUUUU****",this.joinedGyms);
    this.defaultGymId_store = this.joinedGyms[0];
  }

  async joinMore(){
    console.log("join more ");
    this.fetchLocation(); // to fetch approx current location
    //present alert telling to join scan the QR code of Owner Property.
    this.presentJoinAlert("Joining New Property ","Select Method of Joining","");     
     this.popover.dismiss();
  }

  async presentJoinAlert(header,subheader,message){
    const alert = await this.alertCtrl.create({
      header:header,
      subHeader: subheader,
      message:message,
      mode:'ios',
      // cssClass : 'customGreenAlert',
      buttons: [
        {
          text: 'QR Scan',
          role: 'cancel',
          handler: () => {
            this.ScanToJoin();  
            // this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'Invitation Code',
          role: 'confirm',
          handler: () => {
            this.checkIfInvited(this.loggeduser.email);
            // this.handlerMessage = 'Alert confirmed';
          },
        },
      ],
    });
    await alert.present();

  }

  //to join more property 
  async ScanToJoin(){//based on this event check from where this coming
    this.startScantoJoin();
  }

  async startScantoJoin(){  
      try {
        const permission = await this.checkPermission();
        if(!permission) {
          return;
        }
        await BarcodeScanner.hideBackground();// make background of WebView transparent
        this.ishidden = false;
        this.scanActive = true;
        this.storageService.store("scanActive","true");
  
        document.querySelector('body').classList.add('scanner-active');
        this.content_visibility = 'hidden';
        this.ishidden = false;
        const result = await BarcodeScanner.startScan();
        console.log(result);
        BarcodeScanner.showBackground();
        document.querySelector('body').classList.remove('scanner-active');
        this.content_visibility = '';
        if(result?.hasContent) {
          console.log(result.content);
          this.scannedResult = result.content;
          this.scanActive = false;
           /** use this scanned result and pass add to by gym id */


          console.log(this.scannedResult);
          this.checkGymId(this.scannedResult);
        }
      } catch(e) {
        console.log(e);
        this.stopScan();
      }       

  }

  //search gymID based on scanned result 
  async checkGymId( scannedRes){
    
    this.gymApi.getGym(scannedRes).subscribe((res)=>{
      if(res==null){
        console.log("not valid qr code");
        this.presentAlert("Warning !","Not a Valid QR Code" , "Try with valid QR code");
        return;
      }else{
        //check if logged user is already member of this gym id
        this.addMebyGymId(res._id);        
      }

    });
  }

  //add member using gymID
  async addMebyGymId(gymid){
    this.userApi.getUserbyEmail(this.loggedUserEmail).subscribe((res)=>{
      this.userMobile = res.mobile;
    });
    //get gym name
    this.gymApi.getGym(gymid).subscribe((gym)=>{
      this.joiningGymName = gym.gym_name;
    });
    //to get mobile number either ask user to enter or get from previous joined information 
    //here using from previus joined gym and member id 
    this.memberForm = this.formBuilder.group({
      'gym_id' : [gymid, Validators.required],
      'gym_name':[this.joiningGymName],
      'm_name' : [this.loggedUserName, Validators.required],
      'Emergency_mobile': [this.userMobile, Validators.required],
      'mobile': [this.userMobile, Validators.required],
      'aadhar':['456'], // 456 means added by member , 123 means added by owner
      'email':[this.loggedUserEmail, Validators.required],
      'memberType': ['member',Validators.required],
      'm_joindate': [Date.now(), Validators.required],
      'm_accesstype': ['paid',Validators.required],
      'm_address_lat': [this.attendance_lat],
      'm_address_long': [this.attendance_lon],
        'm_startdate':[Date.now()],
        'm_enddate':[Date.now()],
        'm_validdays':['0'],
        'm_intime':[Date.now()],
        'm_outtime':[Date.now()],
        'isInviteAccepted':['No'], // here make it YES once Owner accepted it. 
         //date time all saved in Unix form in DB uniformaly accorss project 
         // as per need reverse calculation done 
    });

    this.memberApi.addMember(this.memberForm).subscribe(
      { next: res=>{
        if(res._id){
          this.successAlert("Successfully Added","Wait For Gym Admin Approval","");
        }
      },
        error:err=>{
          if(err.error.message.includes("user exist")){
           this.presentAlert(" Wrong Selection!","You Are Already Member of this Property","Contact Admin!");
          }else{
            this.presentAlert("Some Thing Went Wrong !",err.error.message,"Contact Admin!");
          }
        }
        
      // console.log(data[0].gym_name); // use this info to make default select GYM value and refer this further https://forum.ionicframework.com/t/ion-select-and-default-values-ionic-4-solved/177550/5
     
      }
    );
  }

 
  checkIfInvited(email:any){
    console.log(email);
    // member control api get detail by email id
    this.memberControlApi.getMcontrolEmail(email).subscribe(
      {
        next:(res:any)=>{
            console.log(res);
            if(!res){
              console.log("Please ask respective property owner to invite you to join property"); 
              this.presentAlert("No Invitation Found!","Please ask property owner to Invite to Join property","")
              return;
            }else{
              // if same joined gym invitaion code is there check that .
              if(res.member_id === this.memberId){
                //already member of this gym so dont take any action 
                // means same gym invite code still ther in DB remove this from DB 
                //but before that check if member is isInviteAccepted is Yes or not , if yes then delet the code
                //

              }
              console.log("Please Enter Invitaion Code");
              this.memberControlApi.getByEmail(this.loggedUserEmail).subscribe({
                next:res=>{
                  this.InvitationCodes = res;
                },
                error:err=>{}
              })
              this.isModalOpen = true; 
                // this.joinGymAlert();
            } },
       error:(err: any) => {
              console.log(err.error.message);
              if(err.error.message.includes("no data found with this ID")){
                this.presentAlert("No Invitation Yet !","Please ask property owner to Invite to Join property","")
              return;
              }
            }
    }
    );   

  }

   // for member join gym alert to get verification code 
   async joinGymAlert() {
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header: 'Please enter Verification Code',
      buttons: [
                {
                  text: 'Ok',
                  handler: (alertData) => { //takes the data 
                      const var_code= alertData.code_entered;
                      console.log(var_code);
                      // call mcontrol service 
                      console.log(this.loggeduser.email);
                       this.memberControlApi.getMcontrolEmail(this.loggeduser.email).subscribe((data)=>{
                        const invitationCode = data.inviteCode;
                        if(var_code === invitationCode){
                          this.memberApi.getMember(data.member_id).subscribe((res)=>{
                            localStorage.setItem('defaultjoinedGymId',res.gym_id);
                            this.gymApi.getGym(res.gym_id).subscribe((gym)=>{
                              localStorage.setItem('defaultjoinedGymId',gym._id);
                              this.storageService.store('defaultjoinedGymId',gym._id);
                              this.storageService.store('joinedGymList',gym);
                            });
                            
                          });
                          console.log("code matched");
                          // this.router.navigateByUrl('/tabs/member-action',{replaceUrl:true}); 
                          // this.updateUserToMember(); // here make back end table there insert joined GYm array 
                          this.updateMemberInvitedAccepted(data.member_id,"Yes",data._id);
                          //delete memberControlApi code as its purpose is solved
                        }
                       });            

                  }
              },
           
            ],
      inputs: [
        {
          name:'code_entered',
          placeholder: 'Verificaion Code',
          attributes: {
                        maxlength: 6,
                      },
        },
      ],
    });

    await alert.present();
  }

  async updateMemberInvitedAccepted(MemberId:any,Yes:any, MControlId:any)
  {
    console.log("in invitaion code setup");
    this.memberApi.update(MemberId,{
      "isInviteAccepted":Yes // Status Change to Yes
    }).subscribe({
      next: (res: any) => {
      const id = res._id;
      console.log('invitaion type change to Yes');
      if(res.isInviteAccepted == "Yes"){
      this.deletInvitationCodeData(MemberId,MControlId); //delet code once updated invitation accepted is updated
      }else{
        console.log("Member Data not Updated to Invitation Accepted");
        this.presentAlert("Invitation Not Accepted","Contact Admin","");
      }
    }, 
    error:(err: any) => { 
      this.presentAlert("Invitation Status Not Updated",err.error.message,"contact admin");
      console.log(err)  }
    });    
  }

  //delet invitiation code detail once member status is updated to accepted .
  async deletInvitationCodeData(MemberId,Mcontrolid){
    this.memberControlApi.delete(Mcontrolid).subscribe((res)=>{
        console.log(res);
    });
    this.memberControlApi.getMcontrolMemberId(MemberId).subscribe((res)=>{
      this.memberControlApi.delete(res._id)
    });
  }


  async logout(){
    // clear all local storage data
    localStorage.clear();
    this.userApi.deleteToken();
      this.router.navigate(['/login'],{replaceUrl:true});
    //google logout
    await GoogleAuth.signOut();
    this.user = null ;
    this.popover.dismiss();
  }


  @ViewChild(IonModal) modal: IonModal;
  isModalOpen = false;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    console.log(this.enteredCode);
    if(this.CodeVerification(this.RetrievedMemberCodeId,this.enteredCode)){
      //also show toast "successfull verification"
      //also update member status as invitaion code accepetd yes. 
      this.memberApi.update(this.RetrievedMember_Id,{"isInviteAccepted":"Yes"}).subscribe({
        next:res=>{
          this.memberControlApi.delete(this.RetrievedMemberCodeId);
          this.getGyms(); 
        },
        error:err=>{}
      });
      this.modal.dismiss(this.enteredCode, 'confirm');
      this.isModalOpen = false;
    }else{
      //show toast "try again wrong code entered"
    }
    
    
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
    }
  }


  // Function to handle ionChange event
  ShowInputBlock: boolean = false;
  RetrievedMemberCodeId:any;
  RetrievedMember_Id:any;
  openInput(event: any,data:any) {
    if (event.detail.checked) {
      this.RetrievedMember_Id = data.member_id;
      this.RetrievedMemberCodeId = data._id;
      this.ShowInputBlock = true;
      // If checkbox is checked, navigate to the new page
      // this.navCtrl.navigateForward('/new-page'); // Replace '/new-page' with your actual route
    } else {
      this.ShowInputBlock = false;
      // Handle other conditions or actions when the checkbox is unchecked
    }
  }

  async CodeVerification(mem_id:any,UserEnteredcode:any){
    this.memberControlApi.getMcontrol(mem_id).subscribe({
      next:res=>{
        if(res.inviteCode === UserEnteredcode.trim()){
            return true;
        } else return false;
      },
      error:err=>{
        return false;
      }
    });



  }


}

// add slide show on member action page under DiV 
// https://www.30secondsofcode.org/js/s/to-iso-string-with-timezone/ take from here for ISO time zone
// f existing user try to join y invitaion code then first check if he mcontrol code of which gym id , if that
//gym id already member then delet that code and show alert no  cound found .

// also start scan only if member has accepted invitation to yes. otherwise show alert invitaion acceptance pending.
