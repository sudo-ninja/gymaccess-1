import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recharge } from 'src/app/models/recharge';
import { GymService } from 'src/app/services/gym.service';
import { MemberserviceService } from 'src/app/services/memberservice.service';

// loading control and modal controller 
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';


//call member service to get all information about logged user Membrs

// call recharge request api to get information about recharge
import { RechargeService } from 'src/app/services/recharge.service';
import { UserService } from 'src/app/services/user.service';
import { FeedbackserviceService } from 'src/app/services/feedbackservice.service';
import { Feedback } from 'src/app/models/feedback';

 
// for camera image captring 
// import { Camera, CameraResultType } from '@capacitor/camera';






@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {

  
  isLoadingResults = false;
  // loggeduserUsername:any;
  loggeduserEmail:any;
  loggeduserIsAdmin:boolean;
  // loggeduserID:any;

  loggedUserGymId:any;

  userDetails;

  gymName:any;
  gymLocation_lat:any;
  gymLocation_lng:any;
  gymEmergencyMobile:any;

  memberEnddate:any;
  memberEntrytime:any;
  memberGymId:any;
  memberId:any;


  anyMessage:boolean=false;
  isMessageFromAdmin:boolean=false;

   
   recharges:Recharge[]=[];
   feedbacks:Feedback[]=[];
   
  loggeduser: any;
  isloggedUserMember: boolean;
  memberName: string;
  loggeduserUsername: any;
  isFeedbk:boolean = false;


  

  constructor(
    private router:Router,
    private http:HttpClient,
    public memberApi:MemberserviceService,
    private gymApi: GymService,
    private rechargeApi :RechargeService,
    // for ionic alert
    private alertController: AlertController,
    // logged user API 
    private userApi:UserService,
    //feedback api
    private feedbackApi:FeedbackserviceService,
  ) { 

     const user = localStorage.getItem('User')
     
     console.log(JSON.parse(user!).email );
     console.log(JSON.parse(user!)._id);
     console.log(JSON.parse(user!).username);

     // to know the status of logged user if he is member or admin      
     this.loggeduser=JSON.parse(user);
    //  this.loggeduserID = this.loggeduser._id;
     this.loggeduserEmail = this.loggeduser.email;
     this.userApi.getUserbyEmail(this.loggeduserEmail).subscribe(
       res=>{
          console.log(res);
         this.isloggedUserMember = res.isMember;
         console.log(this.isloggedUserMember);
         if(!this.isloggedUserMember){
          this.loggeduserIsAdmin = true;
          console.log("Logged User is Admin");
          localStorage.setItem('UserIsAdmin',this.loggeduserIsAdmin.toString())
         }else{
          this.isloggedUserMember=true;
          this.loggeduserIsAdmin = false;
          console.log("Logged User is Member");
          localStorage.setItem('UserIsMember',this.loggeduserIsAdmin.toString())
         }
       },
       error=>{
            console.log(error)
       }
      )
     
     this.loggeduserUsername = JSON.parse(user!).username; // if admin is loggedin then there is no other way to know his name except username
     this.loggeduserEmail = JSON.parse(user!).email;  
     this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((res)=>{
        
      if(!res){
        return;
      }else{
        console.log(res);
      this.memberGymId = res[0].gym_id;
      this.memberId = res[0]._id;
      this.memberName = res[0].m_name;
      console.log(this.memberGymId);

      this.gymApi.getGym(this.memberGymId).subscribe((res)=>{
        this.gymName= res.gym_name;
        this.gymLocation_lat= res.gym_address_lat;
        this.gymLocation_lng = res.gym_address_long;
        this.gymEmergencyMobile=res.gym_emergency; 
        
        // this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((res)=>{
        //   console.log(res); // in next version make this as  one member may join more gym 
        // })
      });
    }
     });   
     
  }


  ngOnInit() {  
    
  }
// use so that gym name chage can be apear quickly here 
  ionViewWillEnter(){
    console.log("ion view will enter me page");
    if(this.isloggedUserMember){
      // this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((data)=>{        
      //   this.memberId = data._id;
      //   this.memberGymId = data.gym_id;
        this.gymManagement(this.loggeduserIsAdmin);
        this.rechargeRequestMessage(this.memberId);
      // });
    }
  
    if(this.loggeduserIsAdmin){
  
    }
  }


  gymManagement(admin:boolean){
    if(admin){
      console.log("Admin Execution")
      return;
    }else {   // means member if it false
      console.log("Member Execution")    
        
          this.gymApi.getGym(this.memberGymId).subscribe((res)=>{
          this.gymName= res.gym_name;
          this.gymLocation_lat= res.gym_address_lat;
          this.gymLocation_lng = res.gym_address_long;
          this.gymEmergencyMobile=res.gym_emergency;          
        });
        
         
        console.log(this.memberId);
    }

  }
  getImage(){
    
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      if(this.isloggedUserMember){
        // this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((data)=>{        
        //   this.memberId = data._id;
        //   this.memberGymId = data.gym_id;
          this.gymManagement(this.loggeduserIsAdmin);
          this.rechargeRequestMessage(this.memberId);
        // });
      }
    
      if(this.loggeduserIsAdmin){
    
      }
        
      event.target.complete();
    }, 2000);
  }

  rechargeDays:any;
  isAccepted:any;

  async rechargeRequestMessage(md:any){
    console.log(md);
    this.rechargeApi.getRechargeRequestMadeByMemberId(md).subscribe((data) => {
     console.log(data.length);
      if(data.length){
        this.anyMessage = true;
         this.rechargeDays = data[0].days;
         this.isAccepted = data[0].isAccepted;
      }
    });

  }

  alertForMemberMessage(){
    if(!this.isAccepted){
    this.presentAlert(`Request Made for ${this.rechargeDays} Days`,"Approval Status is Still Pending");
      }
}

  async presentAlert(header:string,  message:string) {
    const alert = await this.alertController.create({
      header:header,
       message:message,
      buttons: ['OK'],
    });
    await alert.present();
  }


  logout(){
    // clear all local storage data
    localStorage.clear();
    //if want to clear some perticualr data then use
    // localStorage.removeItem('user'); // this will clear only user data
    //clear all session storage data
    // nevigate to login page 
    this.router.navigate(['/login'],{replaceUrl:true});
  }

  
  gymLat:any;
  gymLng:any;
async gymLocation(){
    
    this.gymLat = this.gymLocation_lat;
    this.gymLng = this.gymLocation_lng;
    window.location.href =`https://www.google.com/maps/@${this.gymLat},${this.gymLng},17z`;
    // https://www.google.com/maps/@26.8539768,75.7255187,15z
   
}

CallTel(tel) {
  window.location.href = 'tel:'+ tel;
}

myText:any;
textarea(event){
  console.log(event);
}

customCounterFormatter(inputLength: number, maxLength: number) {
  return `${maxLength - inputLength} characters remaining`;
}

feedbackAlert(){ 
  this.isLoadingResults = true;
  this.feedbackApi.getFeedbackByFeedback(this.memberGymId,this.memberId,true).subscribe((res)=>{
    this.isLoadingResults = false;

    console.log(res);
    console.log([res].length);
    for (let i = 0; i < [res].length; i++) {
      console.log(res[i].isFeedback);
      if(res[i].isFeedback){       
      this.isFeedbk = res[i].isFeedback;      
      this.presentAlert("Earlier Feddback Made !!","Action Still Pending");
      break;      
    }
  }
});
  
if(!this.isFeedbk){
  console.log("in add feedbak");  
  this.addFeedback();
}

}

async addFeedback(){

  const alert = await this.alertController.create({
    header :'Suggestions or Query About App',
    inputs: [
    {
        name: 'feedback',
        type: 'textarea',
        placeholder: 'Text Limit 250 nos. Only',
        attributes: {
          maxlength: 250,
        },
    }],    
    buttons: [
        {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
                console.log('Confirm Cancel');
                return;
            }
        }, 
        {
            text: 'Send',
            handler: (alertData) => { 
                if(this.isFeedbk){
                    // console.log("previous feedback still not responded wait for response")
                    this.presentAlert("Earlier Feddback Made !!","Action Still Pending");
                  }else{
                    this.feedbackApi.addFeedback({"gym_id":this.memberGymId,"sender_id":this.memberId,"message":alertData.feedback,"isFeedback":true}).subscribe((res)=>{
                      console.log(res);
                    });
                  };
                
                // console.log({"gym_id":this.memberGymId,"sender_id":this.memberId,"message":alertData.feedback,"isFeedback":true});
                              
        }
      }
    ]
});
await alert.present();
}

async feedbackAlertAdmin(){  
 this.router.navigateByUrl('/feedback-alert');
}

settings(){
  this.router.navigate(['../settings'],{replaceUrl:true});
}

// get initials of name as avatar look 
getInitials(firstName:string) {
  return firstName[+0].toUpperCase();
}
//fetch Location so that if user want to update can update his location

adminSwitchingBlock:boolean =false;
async ShowIfUserIsMemberAndAdmin(email){
  this.userApi.getUserbyEmail(email).subscribe((res)=>{
    if(res.isMember && res.isAdmin){
      this.adminSwitchingBlock = true;
    }
  });
}

async switchToAdmin(){
  //clear all memmroy and exit from app 
}

}
