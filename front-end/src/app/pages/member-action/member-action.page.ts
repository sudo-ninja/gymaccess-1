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
import { AlertController, ModalController } from '@ionic/angular';
// call service for lock open 
import { MqttService } from 'src/app/services/mqtt.service';
// call service of gym for gym lock id
import { GymService } from 'src/app/services/gym.service';

// call recharge request services

@Component({
  selector: 'app-member-action',
  templateUrl: './member-action.page.html',
  styleUrls: ['./member-action.page.scss'],
})
export class MemberActionPage implements OnInit {
  scannedResult:any;
  content_visibility = '';
  dateTime;

  attendanceForm!: FormGroup;
  isLoadingResults = false;

  attendance_lat:any;
  attendance_lon:any;

  userEndDate:any;
  username:String='';

  gymId:any;
  lockId:any;

  serviceProviders: any; // serviceprovider means admin as he is providing service to members.
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  usersUrl:string='http://localhost:3000/users';// URL at postman from where all user are fetched
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
    private gymApi:GymService

  ) {
    this._user.user().subscribe(
      res=>{
        this.addName(res),
        console.log(res);
      },
      error=>{
        // this.router.navigate(['/login'])
        console.log(error)
      });
      // to get current user location as soon as page is opened
      this.fetchLocation();
  }

  addName(data:any){
    this.username = data.username;
    console.log(this.username);
  }

  ngOnInit() {
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
        this.scannedResult = result.content;
        console.log(this.scannedResult);
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }

    this.attendance();
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
    console.log("res");    
    this.attendanceForm = this.formBuilder.group({
      'member_id' : this.loggeduser._id,
      'checkin_date' : new Date().toString(),
      'checkin_time': new Date().toLocaleTimeString(),
      'lock_status' :['opened', [Validators.required ]] ,
      'att_lat': [this.attendance_lat, [Validators.required ]],
      'att_long':[this.attendance_lon, [Validators.required ]] ,
    });

    this.validAttendance(new Date(),new Date().toLocaleTimeString(),this.loggeduser.email);
    // this.attenApi.addAttendance(this.attendanceForm.value).subscribe((res:any)=>{
    //   console.log(res);

    // },(err: any) => {
    //   console.log(err);
    //   this.isLoadingResults = false;
    // });


  }

  async presentAlert(header:string,subheader:string, message:string) {
    const alert = await this.alertCtrl.create({
      header:header,
      subHeader: subheader,
      message:message,
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

async validAttendance(current_date:any,current_time:any,email:any){

  // here we will first fetch member using email id , 
  this.memberApi.getMemberByEmail(email).subscribe((res:any)=>{
    console.log((new Date(res.m_enddate)).getTime());  
    // as Saved date taken from MControl is not in same format.. first we need to use universal same format 
    // that is new.Date()
    // console.log(res);
    // console.log(res.email);
    this.userEndDate = (new Date(res.m_enddate)).getTime();  
    console.log((new Date(current_date)).getTime());  
    try {
      if(((new Date(res.m_enddate)).getTime())>=((new Date(current_date)).getTime()))
        {
            console.log("DB out time :", res.m_outtime, "current time:",current_time);
            if(res.m_outtime>=current_time)
            {
              console.log("valid attendance add to DB");
              this.attenApi.addAttendance(this.attendanceForm.value).subscribe((res:any)=>{
                this.openLock(email); // iff attendance saved then only open the lock
              console.log(res);      
                  },(err: any) => {
                    console.log(err);
                    this.isLoadingResults = false;
                                  });
            }else{
                  console.log("Not Allowed at this Time..Contact Admin");
                  this.presentAlert("Not Allowed","Contact Admin","Access in Allowed Time Only");
                  }

        }else {
              console.log("Time Expired Contact Admin to Increase Validity");
              this.presentAlert("Validity Expired","Contact Admin","");
              console.log("current date :", current_date, "DB End Date:",res.m_enddate);
              };
    } catch (error) {
      throw error;
    }
  });
   
}

openLock(email:any){
  console.log("Lock Open Comand Given");
  this.memberApi.getMemberByEmail(email).subscribe((data:any)=>{
    console.log(data);
    try {
      this.gymId = data.gym_id;
      this.gymApi.getGym(this.gymId).subscribe((data:any)=>{
        try {
          this.lockId = data.lockId;
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
    
  });
  this.lockApi.openLock(
    {
      topic:this.lockId,
      message:"1"
    }
  );
  console.log("Lock succesfull open");
  

// need to pass unique Lock ID 
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

/* menue for member
1. My profile allowed chng name , mobile , locations,
2. set alarm for gym time
3. my performance (show attendance) */

}

// add slide show on member action page under DiV 
