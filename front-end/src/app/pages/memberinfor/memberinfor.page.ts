import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// call attendance services
import { AttendanceService } from 'src/app/services/attendance.service';


//call recharge service
import { RechargeService } from 'src/app/services/recharge.service';

// call storage service
import { StorageService } from 'src/app/services/storage.service';

// loading control and modal controller 
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

// call member service
import { MemberserviceService } from 'src/app/services/memberservice.service';

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


  // member ID
  memberID:any;

  constructor(
    private AttendanceApi:AttendanceService,
    private RechargeApi: RechargeService,
    private MemberApi:MemberserviceService,

    public route :ActivatedRoute,
    public router :Router,
    public loadingController:LoadingController,
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
setReminder(email:any,days:any){
  // Java code for date calculation
  var reminderDate ; 
  var date = new Date();
  date.setDate(date.getDate() + days);
  console.log(date.getDate());
  reminderDate = date.getDate();
  console.log(reminderDate);

  this.MemberApi.getMemberByEmail(email).subscribe((data:any)=>{
    try {
      console.log(data);
      if(data)
      {
      console.log(data.m_enddate);
      if(data.m_enddate < reminderDate ){
        console.log("End Date is less then remonder date", reminderDate,);
      }
      }else {
        console.log("End Date is far away from remonder date ");
      }
    } catch (error) {
      throw error;
      
    }
   });
}

}
