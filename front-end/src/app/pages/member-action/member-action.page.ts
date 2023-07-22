import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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


@Component({
  selector: 'app-member-action',
  templateUrl: './member-action.page.html',
  styleUrls: ['./member-action.page.scss'],
  
})
export class MemberActionPage implements OnInit {
  baseUri : string = environment.SERVER;
  //slide show 
  slides: any[] = [];

  loggedUserEmail:any;
  loggedUserName:any;
  isloggedUserMember:boolean;

  scannedResult:any;
  content_visibility = '';
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

  serviceProviders: any; // serviceprovider means admin as he is providing service to members.
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  // usersUrl:string='http://localhost:3000/api/v1/users';// URL at postman from where all user are fetched
  usersUrl:string=this.baseUri+'/users';// URL at postman from where all user are fetched
  
  originalserviceProvider:any;
  selectedService:any;

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
    private bannerApi:BannerService

  ) {
    // this._user.user().subscribe(
    //   res=>{
    //     this.addName(res),
    //     console.log(res);
    //   },
    //   error=>{
    //     // this.router.navigate(['/login'])
    //     console.log(error)
    //   });

      // to know the status of logged user if he is member or admin
      const user = localStorage.getItem('User')
      this.loggeduser=JSON.parse(user);
      this.loggedUserEmail = this.loggeduser.email;
      this.isUserMember(this.loggedUserEmail); // to chekc user available in member DB or not?
      this.loggedUserName = this.loggeduser.username;
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
      
  }

  addName(data:any){
    this.username = data.username;
    // console.log(this.username);
  }

  ngOnInit() {
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

      this.http.get(this.usersUrl).subscribe(res=>{
        // console.log(res)
        // this.serviceProviders=res;
        // this.originalserviceProvider=res;
      },error=>{
        console.log(error)});
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

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission) {

        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      console.log(result);
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if(result?.hasContent) {
        console.log(result.content);
                this.scannedResult = result.content;
        if(this.scannedResult.includes(this.gymId)){
          this.attendance();//**/ */
        }else{
          console.log("not valid qr code");
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
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
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
isUserMember(email){
  //search member DB for this email 
  this.memberApi.getMemberByEmail(email).subscribe((data:any)=>{
    console.log(data);
    if(!data){      
      this.router.navigateByUrl('/home',{replaceUrl: true,});
    }else{
      this.memberId = data._id;
      this.memberEndDate = data.m_enddate*1; // in Unix millisecond formate
      this.memberOutTime = data.m_outtime*1 // in Unix milisecond
      this.memberInTime = data.m_intime*1// in unix milisecond
      this.gymId = data.gym_id // get gym ID
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

}

// add slide show on member action page under DiV 
// https://www.30secondsofcode.org/js/s/to-iso-string-with-timezone/ take from here for ISO time zone
