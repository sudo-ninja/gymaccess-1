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
  

  messageReminder:boolean = false;


  // member ID
  memberID:any;
// for gmap 
  @ViewChild(GmapPage, {static : true}) gmap : GmapPage;

  constructor(
    private AttendanceApi:AttendanceService,
    private RechargeApi: RechargeService,
    private MemberApi:MemberserviceService,

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

// get member by email , get ID from here 
this.getMemberAttendances(this.loggeduser._id);
// get member end date
this.getMemberEndDate(this.loggeduser.email);
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
  }

  logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

  handleChange(e) {
    this.pushLog('ionChange fired with value: ' + e.detail.value);
  }

  
  
  // download data in CSV form , make function and get data from DB in CSV form

// get members attendnace 
getMemberAttendances(loggedUserID:any){
this.AttendanceApi.getMemberAttendance(loggedUserID).subscribe((data:any)=>{
  try {
    if(data){
      console.log(data.length);
      this.memberAttendances = data.length;
    }
  } catch (error) {
    throw error;
    
  }
});
}

//get member end date
getMemberEndDate(email:any){
  this.MemberApi.getMemberByEmail(email).subscribe((data:any)=>{
    try {
      console.log(data);
      this.memberID= data._id;
      if(data)
      {
      console.log(data.m_enddate);
      this.memberEndDate = data.m_enddate;
      }else {
        console.log("no attendance yet");
      }
    } catch (error) {
      throw error;
      
    }
   });
}

// ths need to be link with handle change even of toggle switch
isToggled = false;

changeToggle(){
  console.log("change toggle")
  this.setReminder(this.loggeduser.email,7)

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
  const sevenDaysAgo: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  this.MemberApi.getMemberByEmail(email).subscribe((data:any)=>{
    try {
      console.log(data);
      if(data)
      {
      
      dbEndDate=  new Date(data.m_enddate).getTime();
      toDay= Date.now();
      console.log(toDay);
      console.log(dbEndDate);
      if(dbEndDate < sevenDaysAgo){
        console.log(data.m_enddate,`End Date is less then remonder date`,);
        this.messageReminder = true;
      }
      }else {
        console.log("End Date is far away from remonder date ");
      }
    } catch (error) {
      throw error;
      
    }
   });
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
  this.RechargeApi.getRechargeRequestMadeByMemberId(this.memberID).subscribe((data) => {
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
                     this.RechargeApi.addRecharge({"member_id":this.memberID,"days":alertData.recharge_days,"isAccepted": "0"}).subscribe((data)=>{
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

}
