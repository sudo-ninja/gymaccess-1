import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MemberserviceService } from 'src/app/services/memberservice.service';
import { AlertController } from '@ionic/angular';
import{ Router} from '@angular/router';

// for countdown display on screen 
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-personalinformation',
  templateUrl: './personalinformation.page.html',
  styleUrls: ['./personalinformation.page.scss'],
})
export class PersonalinformationPage implements OnInit {
  //for countdown time
  private subscription: Subscription;

  loggeduserIsAdmin: boolean;

  adminName:any;
  adminEmail:any;
  adminMobile:any;
  adminRoll:any;

  memberType: any;
  memberName: any;
  memberEmail: any;
  memberId: any;

  memberMobile: any;
  emergencyMobile: any;

  member_address_lat: any;
  member_address_long: any;

  memberJoindate: any;

  memberStartdate: any;
  memberLastdate: any;

  memberIntime: any;
  memberOuttime: any;

  memberAcceptedinvitation: any;
  memberAttended: boolean;
  memberSetreminder: boolean;

  loggeduser: any;
  loggedUserId:any;

  countdownSeconds: number;
  countDownStarted:boolean = false;

   

  constructor(
    private memberApi: MemberserviceService,
    private userApi: UserService,
    private alertCtrl: AlertController,
    private router :Router,

  ) {
    const user = localStorage.getItem('User');
    this.loggeduser = JSON.parse(user!);
    this.adminName = this.loggeduser.username;
    this.adminMobile = this.loggeduser.mobile;
    this.adminEmail = this.loggeduser.email;
    
    const UserIsAdmin = localStorage.getItem('UserIsAdmin');
    const UserIsMember = localStorage.getItem('UserIsMember');
    if(UserIsAdmin === 'true'){
      this.loggeduserIsAdmin = true;
      
    }if(UserIsMember === 'false'){
      this.loggeduserIsAdmin = false;
      
    this.memberApi
    .getMemberByEmail(this.loggeduser.email)
    .subscribe((data: any) => {
      this.memberName = data.m_name;
      this.memberEmail = data.email;
      this.memberMobile = data.mobile;
      this.emergencyMobile = data.Emergency_mobile;
      this.memberJoindate = data.m_joindate;
      this.memberStartdate = data.m_startdate;
      this.memberLastdate = data.m_enddate;
      this.memberIntime = data.m_intime;
      this.memberOuttime = data.m_outtime;
      this.memberSetreminder = data.isSetReminder;
      this.memberAttended = data.isAttended;
      this.member_address_lat = data.m_address_lat;
      this.member_address_long = data.m_address_long;
      this.memberAcceptedinvitation = data.isInviteAccepted;
      this.memberType = data.memberType;
      this.memberId = data._id;
    });
    }
    
  }

   

  ngOnInit() {
     //re 180 second means  180 000 milisecon
  }

  

  onDeleteAccount(email:any){
      this.userApi.getUserbyEmail(email).subscribe((res)=>{
        console.log(res.id);
        this.loggedUserId = res.id;
      });
      this.presentAlert("Are You Sure?","","This will delete all data..")
}

//present alert are you sure 
// you will loss all data !

async presentAlert(header:string,subheader:string, message:string) {
  const alert = await this.alertCtrl.create({
    header:header,
    subHeader: subheader,
    message:message,
    buttons: [
      {
        text : 'OK',
        handler:()=>{
           this.startCountdown(180,this.loggedUserId); // set 180 second count down
           this.countDownStarted = true;
        }
      },
      {
        text : 'Cancel',
        handler:()=>{
          
        }
      }
      
      
      ],
  });
  await alert.present();
}




// start count down for 180 second
interval:any;
startCountdown(seconds,id) {
  let counter = seconds;    
  this.interval = setInterval(() => {
    console.log(counter);
    this.countdownSeconds = counter;
    counter--;      
    if (counter < 0 ) {
      clearInterval(this.interval);
      console.log('Ding!');
      this.countDownStarted = false;
      this.deleteAlert("All Data Will be Lost","Still Want to Delete ?","",id);
    }
  }, 1000);
}

cancelCountDown(){
  clearInterval(this.interval);
  this.router.navigateByUrl('/settings', {
    replaceUrl: true,
  });
}

// finally delete account alert
async deleteAlert(header:string,subheader:string, message:string,id:any) {
  const alert = await this.alertCtrl.create({
    header:header,
    subHeader: subheader,
    message:message,
    buttons: [
      {
        text : 'OK',
        handler:()=>{
           this.userApi.deletUserbyId(id);
        }
      },
      {
        text : 'Cancel',
        handler:()=>{
          
        }
      }
      
      
      ],
  });
  await alert.present();
}

}
