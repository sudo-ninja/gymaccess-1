import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GymService } from 'src/app/services/gym.service';
import { MemberserviceService } from 'src/app/services/memberservice.service';
import { MqttService } from 'src/app/services/mqtt.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-membertabs',
  templateUrl: './membertabs.page.html',
  styleUrls: ['./membertabs.page.scss'],
})
export class MembertabsPage implements OnInit {

  memberId:any;
  memberEndDate:any;
  memberOutTime:any;
  memberInTime:any
  gymId: any;
  lastDate: any;
  daysLeft: number;
  checkinTime: any;
  checkoutTime: any;
  firstAttendance: any;
  lockId: any;
  gymName: any;
  userProfileImage: string;
  loggeduser: any;
  loggedUserEmail: any;
  loggedUserName: any;
  
  isloggedUserMember: any;
  joinedGym: { _id: any; user_id: string; gym_name: string; }[];

  constructor(
    private router:Router,
    private _user:UserService,
    private memberApi:MemberserviceService,
    private lockApi:MqttService,
    private gymApi:GymService,
  ) {  
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


  }

  ngOnInit() {
  }

  ionViewWillEnter()  {  
    this.getMemberByEmailandGymId(this.loggedUserEmail);
    console.log("Ion View Will Enter from MemberTab");
  }


  async getMemberByEmailandGymId(email){
    this.memberApi.getMemberByEmail(email).subscribe((data:any)=>{
      console.log(data); // here in version two check with email and gym id 
      if(!data){      
        this.router.navigateByUrl('/home',{replaceUrl: true,});
      }else{
         this.savedJoinedGyms(email);
         this.getMemberbyGymIdandEmail(localStorage.getItem('defaultjoinedGymId'),email); 
      }
    });
  
  }

//joined gymlist save in array 
async savedJoinedGyms(email){
  this.memberApi.getMemberByEmail(email).subscribe((res)=>{
    console.log(res);
    //as of now it will show only 1 member ..but need to change at back end to show more members
    //make change and back end use find instead of findone.    
  });
}

async getMemberbyGymIdandEmail(gymid,email){
  console.log("🚀 ~ file: member-action.page.ts:260 ~ MemberActionPage ~ getMemberbyGym̥IdandEmail ~ getMemberbyGym̥IdandEmail:",gymid);
  //set default GYM id from here to be used on other pages  
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

}
