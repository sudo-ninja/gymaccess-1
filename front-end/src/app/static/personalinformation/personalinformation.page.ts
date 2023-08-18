import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MemberserviceService } from 'src/app/services/memberservice.service';
import { GymService } from 'src/app/services/gym.service';
import { McontrolService } from 'src/app/services/mcontrol.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { FeedbackserviceService } from 'src/app/services/feedbackservice.service';
import { AlertController } from '@ionic/angular';
import{ Router} from '@angular/router';
//Gym Admins
import { GymadminService } from 'src/app/services/gymadmin.service';

// for countdown display on screen 
import { Subscription, interval } from 'rxjs';
import { Gym } from 'src/app/models/gym.model';
// recharge service
import { RechargeService } from 'src/app/services/recharge.service';

// for ifram tag use this 
import{DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-personalinformation',
  templateUrl: './personalinformation.page.html',
  styleUrls: ['./personalinformation.page.scss'],
})
export class PersonalinformationPage implements OnInit {
  // for i frame tag
  url: SafeResourceUrl;

  //for countdown time
  private subscription: Subscription;

  loggeduserIsAdmin: boolean = false;
  loggeduserIsMember: boolean = false;
  AdminCumMember:boolean = false;

  userIsAdmin  :boolean = false;
  userIsMember :boolean = false;
  userIsBoth   :boolean = false;

  adminName: any;
  adminEmail: any;
  adminMobile: any;
  adminRoll: any;

  gym_id: any;

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
  loggedUserId: any;

  //count down
  countdownSeconds: number;
  countDownStarted: boolean = false;

  joinedGyms: any;
  joinedGymName: string;

  constructor(
    private memberApi: MemberserviceService,
    private userApi: UserService,
    private gymApi: GymService,
    private memberControlApi: McontrolService,
    private attendanceApi: AttendanceService,
    private feedbackApi: FeedbackserviceService,
    private rechargeApi: RechargeService,
    private alertCtrl: AlertController,
    private router: Router,
    // for i frame tag
    private sanitizer: DomSanitizer,
    private gymAdminApi: GymadminService
  ) {
    const user = localStorage.getItem('User');
    this.loggeduser = JSON.parse(user!);
    this.adminName = this.loggeduser.username;
    this.adminMobile = this.loggeduser.mobile;
    this.adminEmail = this.loggeduser.email;

  }

  ngOnInit() {
    //re 180 second means  180 000 milisecon
    this.setLoggedUserRole();
    console.log(this.userIsMember);

    if (this.userIsMember) { 
      // this.getMemberInfo(this.adminEmail); 
  }
}

  async setLoggedUserRole(){
    console.log(this.adminEmail);
    this.userApi.getUserbyEmail(this.adminEmail).subscribe((res) => {
      console.log(res.isMember);
      if (res.isAdmin && res.isMember) {
        console.log(res.isMember);
        this.AdminCumMember = true;
        this.userIsBoth = true;
        this.userIsAdmin = false;
        this.userIsMember = false;
        return;
      } else if (res.isAdmin) {
        console.log(res.isMember);
        this.loggeduserIsAdmin = true;
        this.userIsBoth = false;
        this.userIsAdmin = true;
        this.userIsMember = false;
        return;
      } else if(res.isMember){
        console.log(res.isMember);
        // this.getMemberInfo(this.adminEmail); 
        this.loggeduserIsMember = true;
        this.userIsBoth = false;
        this.userIsMember = true;
        this.userIsAdmin = false;
      }
    });
    console.log("Logged User is Member :- ", this.loggeduserIsMember, );
    console.log("Logged User is Admin :- ", this.loggeduserIsAdmin, );
    console.log("Logged User is Member and Admin Bth :- ", this.AdminCumMember, );  

  }

  //get mber infor 

  //get member information
  async getMemberInfo(email,gymID) {
    this.memberApi.getMemberByEmailOfGymId(email,gymID).subscribe((data: any) => {
            // console.log(data); // work on this in VER 2.0 where one member may join more gyms.
      this.gym_id = data.gym_id;
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

    async getJoinedGymDetails(gymid){
      this.gymApi.getGym(gymid).subscribe((res)=>{
        this.joinedGymName = res.gym_name;
      });
    }

  onDeleteAccount(email: any) {
    console.log(email);
    this.userApi.getUserbyEmail(email).subscribe((res) => {
      console.log(res._id);
      // this.loggedUserId = res._id;
      // this.loggeduserIsAdmin = res.isAdmin;
      // this.loggeduserIsMember = res.isMember;
      this.presentAlert(
        'Are You Sure?',
        '',
        'This will delete all data..',
        res._id
      );
    });
  }

  //present alert are you sure
  // you will loss all data !

  async presentAlert(
    header: string,
    subheader: string,
    message: string,
    id: any
  ) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.startCountdown(180, id); // set 180 second count down
            this.countDownStarted = true;
          },
        },
        {
          text: 'Cancel',
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  // start count down for 180 second
  interval: any;
  startCountdown(seconds, id) {
    let counter = seconds;
    this.interval = setInterval(() => {
      console.log(counter);
      this.countdownSeconds = counter;
      counter--;
      if (counter < 0) {
        clearInterval(this.interval);
        console.log('Ding!');
        this.countDownStarted = false;
        this.deleteAlert(
          'All Data Will be Lost',
          'Still Want to Delete ?',
          '',
          id
        );
      }
    }, 1000);
  }

  cancelCountDown() {
    clearInterval(this.interval);
    this.router.navigateByUrl('/settings', {
      replaceUrl: true,
    });
  }

  // finally delete account alert
  async deleteAlert(
    header: string,
    subheader: string,
    message: string,
    id: any
  ) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // logged user is neither member nor admin then directly send back to login page

            if (!this.loggeduserIsAdmin && !this.loggeduserIsMember) {
              localStorage.clear(); //clear local storage
              this.userApi.deleteToken(); //clear token
              this.router.navigate(['/login'], { replaceUrl: true });
            }
            // if logged user is member then delet 1. membercontrol , 2.member 3.recharges 4.attendance 5.feedback  6.user
            else if (this.loggeduserIsMember && !this.loggeduserIsAdmin) {
              this.gymAdminApi
                .getGymadminByEmail(this.memberEmail)
                .subscribe((res: any) => {
                  console.log(res.length);
                  if (!res.length) {
                    console.log(
                      'This User have not added any gym so delet the user '
                    );
                    this.deleteMemberAndData();
                    this.userApi.deletUserbyId(id).subscribe((res) => {
                      console.log(res);
                    }); // delet user
                    localStorage.clear(); //clear local storage
                    this.userApi.deleteToken(); //clear token
                    this.router.navigate(['/login'], { replaceUrl: true });
                    return;
                  } else {
                    console.log(
                      'dont delete the user rest all data delet and send to logout page'
                    );
                    // show Alert That you have Gym also do u want to Delet Gym also Or Only Meber account ?
                    this.gymDeletAlert(
                      'Warning !',
                      'You have gym',
                      'First remove gym'
                    );
                  }
                });

              this.router.navigate(['/login'], { replaceUrl: true });
            }
            // if logged user is admin
            // then alert for gym delet

            if (this.loggeduserIsAdmin) {
              this.gymApi
                .wildSearch(this.loggeduser._id)
                .subscribe((data: any) => {
                  if (!data.length) {
                    // check if user have gym . if gym is not there then only delete user
                    this.userApi.deletUserbyId(id).subscribe((res) => {
                      console.log(res);
                    }); // delet user
                    localStorage.clear(); //clear local storage
                    this.userApi.deleteToken(); //clear token
                    this.router.navigate(['/login'], { replaceUrl: true });
                  } else {
                    // show alert first delet gym then only account can be deleted..
                    this.gymDeletAlert(
                      'Warning !',
                      'You have gym',
                      'First remove gym'
                    );
                  }
                });
            }
          },
        },
        {
          text: 'Cancel',
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  async gymDeletAlert(header: string, subheader: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // navigate to gymtabs/infor
            this.router.navigateByUrl('/gymtabs/infor', { replaceUrl: true });
          },
        },
        {
          text: 'Delete Member Profile',
          handler: () => {
            this.deleteMemberAndData();
          },
        },
      ],
    });
    await alert.present();
  }

  // Delet all member data link with member ID to any DB 
  async deleteMemberAndData() {
    //delet member data based on member ID only from mebers DB
    this.memberApi.delete(this.memberId).subscribe((res) => {
      console.log(res);
    });

    this.memberControlApi.getMcontrolMemberId(this.memberId).forEach((res) => {
      console.log(res._id);
      this.memberControlApi.delete(res._id).subscribe((res) => {
        console.log(res);
      });
    });

    this.attendanceApi.getMemberAttendance(this.memberId).forEach((value) => {
      console.log(value._id);
      this.attendanceApi.delete(value._id).subscribe((res) => {
        console.log(res);
      });
    });

    this.feedbackApi
      .getFeedbackBySenderId(this.gym_id, this.memberId)
      .forEach((value) => {
        console.log(value._id);
        this.feedbackApi.delete(value._id).subscribe((res) => {
          console.log(res);
        });
      });

    // this.rechargeApi.getRechargeRequestMadeByMemberId(this.memberId).forEach((value)=>{
    //   console.log(value._id);
    //   this.rechargeApi.delete().subscribe((res)=>{
    //     console.log(res);
    //   });
    // });
  }

  loadMap() {
    // window.location.href =`https://www.google.com/maps/@${this.member_address_lat},${this.member_address_long},21z`;
    // https://www.google.com/maps/@26.8539768,75.7255187,15z
    // https://www.google.com/maps/@${this.member_address_lat},${this.member_address_long},21z
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/@26.8542161,75.7294025,16z?entry=ttu'
    );
  }

  //check if user is member and admin both , if both then show block with two
  // button show profile as Admin and Show Profile as Owner
  // if click Admin then show Admin Block
  // if click Member Block show Member Block
  // AdminCumMeber: boolean = false;
  showMemberButton: boolean = true;
  showAdminButton: boolean = true;
  // async CheckIfAdminCumMember(email) {
  //   this.userApi.getUserbyEmail(email).subscribe((res) => {
  //     if (res.isAdmin && res.isMember) {
  //       this.AdminCumMeber = true;
  //     }
  //   });
  // }

  showMember() {
    this.loggeduserIsMember = true;
    this.loggeduserIsAdmin = false;
    this.showMemberButton = false;
    this.showAdminButton = true;
  }

  showAdmin() {
    this.loggeduserIsAdmin = true;
    this.loggeduserIsMember = false;
    this.showMemberButton = true;
    this.showAdminButton = false;
  }

 backToSettings(){
  if(this.loggeduserIsMember){
  this.router.navigateByUrl('/tabs/member-action');
 }else if (this.loggeduserIsAdmin){
  this.router.navigateByUrl('/gymtabs/member-list');
 }
}

}
