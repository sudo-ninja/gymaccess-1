import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MemberserviceService } from 'src/app/services/memberservice.service';

@Component({
  selector: 'app-personalinformation',
  templateUrl: './personalinformation.page.html',
  styleUrls: ['./personalinformation.page.scss'],
})
export class PersonalinformationPage implements OnInit {
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

  constructor(
    private memberApi: MemberserviceService,
    private userApi: UserService
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

  ngOnInit() {}
}
