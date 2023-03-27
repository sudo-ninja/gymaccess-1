import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//to get current location Lattitude and Longitude
import { Geolocation } from '@capacitor/geolocation';

//call service for attendance here
import {MemberserviceService} from 'src/app/services/memberservice.service';
import {AttendanceService} from 'src/app/services/attendance.service';
import { AlertController, ModalController } from '@ionic/angular';

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

  username:String='';

  serviceProviders: any; // serviceprovider means admin as he is providing service to members.
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  usersUrl:string='http://localhost:3000/users';// URL at postman from where all user are fetched
  originalserviceProvider:any;
  selectedService:any;

  // install https://github.com/capacitor-community/barcode-scanner plugin 

  constructor(
    private router:Router,
    private http:HttpClient,
    private atten:AttendanceService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,
    private _user:UserService,

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

    this.atten.addAttendance(this.attendanceForm.value).subscribe((res:any)=>{
      console.log(res);

    },(err: any) => {
      console.log(err);
      this.isLoadingResults = false;
    });


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

validAttendance(current_date:any,current_time:any,email:any){

  // here we will first fetch member using email id , 
  //member detail from DB , 
  //and from member.start date , and member.end date
  //compare that date and time to current date and time .. 
  //if DB date time > than or equals to current date time 
  // then only return True 
  //that means valid attendance 
  //and Open lock 

}

openLock(){
  // if valid attendance 
  // then only open lock 
  // if not valid ..show alert control .. 
  //contact Gym Administrator    
}


}
