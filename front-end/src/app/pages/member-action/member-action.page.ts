import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//to get current location Lattitude and Longitude
import { Geolocation } from '@capacitor/geolocation';

//call service for attendance here
import { Member } from 'src/app/models/member.model';
import {MemberserviceService} from 'src/app/services/memberservice.service';

import {AttendanceService} from 'src/app/services/attendance.service';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
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
  MyDefaultGymValue: any;
  _gym_id: any;
  userProfileImage: string;
  user: null;
  
  memberForm!: FormGroup;
  userMobile: string;
  defaultGymId_store: string;

  // install https://github.com/capacitor-community/barcode-scanner plugin 

  constructor(
    private router:Router,
    private http:HttpClient,
    private attenApi:AttendanceService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController, 
    private _user:UserService,
    private memberApi:MemberserviceService,
    private lockApi:MqttService,
    private gymApi:GymService,
    private feedbackApi:FeedbackserviceService,
    public loadingController:LoadingController,
    // banner service api
    private bannerApi:BannerService,
//user api
      private userApi:UserService,

  private storageService :StorageService, // storage service is used insted of get set method

  ) {
      // to know the status of logged user if he is member or admin
      this.userProfileImage = localStorage.getItem('ProfileImageUrl');
      console.log(this.userProfileImage);
      const user = localStorage.getItem('User')
      this.loggeduser=JSON.parse(user);
      this.loggedUserEmail = this.loggeduser.email;
      console.log(this.loggedUserEmail);
     

      this.loggedUserName = this.loggeduser.username;
      //this block is used if user deleted by himself or by gym admin then go back to home page
      this._user.getUserbyEmail(this.loggedUserEmail).subscribe(
        res=>{
          // this.addName(res),
          console.log(res);
          this.isloggedUserMember = res.isMember;
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
       this.defaultGymId_store = localStorage.getItem('defaultjoinedGymId');
       

      this.storageService.get('joinedGymList').then((val)=>{
      console.log(val);
    });

  }

  addName(data:any){
    this.username = data.username;
    // console.log(this.username);
  }

  ngOnInit() {
    // this.isUserMember(this.loggeduser.email);
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

    //  to make sure only user can see this page by login so this is done 
    const user = localStorage.getItem('User')
    // this.addName(user);
    console.log(user); // here user info is being display after login successfull
   
    if(user==null){
      this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
    }else{
      console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
      this.loggeduser=JSON.parse(user);
      console.log(this.loggeduser._id);
    }
  }

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({force: true });
      if (status.granted) {
      //   // the user granted permission
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
     this.isUserMember(this.loggedUserEmail); // to chekc user available in member DB or not?
    //  this.getMemberofGymId(this.defaultGymId_store);
     console.log("Ion View Will Enter");
    
  }

  async getMemberofGymId(gymid){
    console.log("GYM ID from getMemberbyGymID : 275 ",gymid);
      this.getMemberbyGymIdandEmail(gymid,this.loggedUserEmail);
      this.popover.dismiss(); // to close popover
    }

  async getMemberbyGymIdandEmail(gymid,email){
    console.log("🚀 ~ file: member-action.page.ts:281 ~ MemberActionPage ~ getMemberbyGym̥IdandEmail ~ getMemberbyGym̥IdandEmail:")
    //set default GYM id from here to be used on other pages 
    console.log("GYM ID in side GetMemberby Gym ID and Email 283- ",gymid,"Email:-",email);
     
      this.memberApi.getMemberByEmailOfGymId(email,gymid).subscribe((data)=>{
      console.log(data);
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
      this.scanActive = true;

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
        /***** here below code working for attendance */
        if(this.scannedResult.includes(this.gymId)){
          this.attendance();//*call attendance */ */
        }else{
          console.log("not valid qr code");
          this.presentAlert("Warning !","Not a Valid QR Code" , "Try with valid QR code")
          // here make alert showing that not a valid qr code ..
        }
        console.log(this.scannedResult);
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }
    
  }
 

  stopScan() {
    console.log("in stop scan");
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
    this.scanActive = false;
    this.ishidden = true;
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
    console.log('current location =', _geoLocation);
    const coordinates = await Geolocation.getCurrentPosition();    
    console.log('Current position:--', coordinates.coords.latitude,coordinates.coords.longitude);
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
                        this.attenApi.addAttendance(this.attendanceForm.value).subscribe((res:any)=>{
                          console.log(res); 
                              
                          this.openLock(email); // iff attendance saved then only open the lock
                            });
                            this.firstAttendance = true;
                            // once first attendenace made member updated as attended and every time it will b check
                           this.memberApi.update(this.memberId,{"isAttended":true}).subscribe((res:any)=>{
                            console.log(res);
                            
                           });
                      }else{
                        console.log("Second Attendance"); 
                        // pass two query param , member id and today date and fetch data 
                        //if any data comes from DB then check its checkin date 
                        // if check it date same as today 
                        // update the data
                        // else add attendnace 
                        this.attenApi.getMemberAttendance(this.memberId).subscribe((res)=>{
                          console.log(res);
                            
                        })
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
    this.isUserMember(this.loggedUserEmail);
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
  this.MyDefaultGymValue = ev.target.value;
  console.log(ev);
  this._gym_id = this.currentGym;
  console.log(this._gym_id);
  this.getMembers();
  this.compareWithFn(this._gym_id,ev.target.value);
  }


  compareWithFn(o1, o2) {
    return o1 === o2;
  };

  getMembers() {
    throw new Error('Method not implemented.');
  }

  // route to person information page 
  personalInformation(){
    console.log("this.memberId",this.memberId); // show personal information based on member ID 
    this.router.navigateByUrl('/personalinformation');
  }

  //joined gymlist save in array 
  async savedJoinedGyms(email){
    
    this.memberApi.getMemberByEmail(email).subscribe((res)=>{
      //as of now it will show only 1 member ..but need to change at back end to show more members
      //make change and back end use find instead of findone.
      for (let i = 0; i <res.length; i++) {
        // make array of image objects
        // this.joinedGyms.push(
          console.log(this.gymApi.getGym(res[i].gym_id).subscribe((data)=>{return data;}));
        // );
      };

    });
  }

  async joinMore(){
    console.log("join more ");
    //present alert telling to join scan the QR code of Owner Property.

    
     this.popover.dismiss();
  }

  //to join more property 
  async ScanToJoin(event){//based on this event check from 
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
        this.memberApi.getMemberByEmailOfGymId(this.loggedUserEmail,scannedRes).subscribe((data)=>{
          if(!data){
            this.addMebyGymId(res._id);

          }else {
            this.presentAlert(" Wrong Selection!","You Are Already Member of this Gym","Contact Admin!");
          }
        });

        
      }

    });
  }

  //add member using gymID
  async addMebyGymId(gymid){
    this._user.getUserbyEmail(this.loggedUserEmail).subscribe((res)=>{
      this.userMobile = res.mobile;
    });
    //to get mobile number either ask user to enter or get from previous joined information 
    //here using from previus joined gym and member id 

    this.memberForm = this.formBuilder.group({
      'gym_id' : [gymid, Validators.required],
      'm_name' : [this.loggedUserName, Validators.required],
      'Emergency_mobile': [this.userMobile, Validators.required],
      'mobile': [this.userMobile, Validators.required],
      'aadhar':['345'], // 345 means added by member , 123 means added by owner
      'email':[this.loggedUserEmail, Validators.required],
      'memberType': ['member',Validators.required],
      'm_joindate': [Date.now(), Validators.required],
      'm_accesstype': ['paid',Validators.required],
      'm_address_lat': ['0'],
      'm_address_long': ['0'],
        'm_startdate':[Date.now()],
        'm_enddate':[Date.now()],
        'm_validdays':['0'],
        'm_intime':[Date.now()],
        'm_outtime':[Date.now()],
        'isInviteAccepted':['No'],
         //date time all saved in Unix form in DB uniformaly accorss project 
         // as per need reverse calculation done 
    });

    this.memberApi.addMember(this.memberForm).subscribe((res)=>{
      if(!res){
        this.presentAlert("ALERT !","Something Went Wrong","Try again");
      }else{
        this.presentAlert("Successfully Added","Wait For Gym Admin Approval","");
        //get gym details
        this.gymApi.getGym(gymid).subscribe((res)=>{
          this.storageService.store('joinedGymList', res);
        });
        
      // console.log(data[0].gym_name); // use this info to make default select GYM value and refer this further https://forum.ionicframework.com/t/ion-select-and-default-values-ionic-4-solved/177550/5
     
      }
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



}

// add slide show on member action page under DiV 
// https://www.30secondsofcode.org/js/s/to-iso-string-with-timezone/ take from here for ISO time zone
