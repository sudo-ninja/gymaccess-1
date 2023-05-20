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


@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  loggeduserUsername:any;
  loggeduserEmail:any;
  loggeduserIsAdmin:boolean;

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
  loggeduser: any;
  isloggedUserMember: boolean;


  

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
  ) { 

    this.userApi.getUserProfile().subscribe({
      next:(res)=>{
        console.log(res);
        // this.userDetails = res['user']
      },
      error:(err)=>{}
    });

    const user = localStorage.getItem('User')
     
     console.log(JSON.parse(user!).email );
     console.log(JSON.parse(user!)._id);
     console.log(JSON.parse(user!).username);

     // to know the status of logged user if he is member or admin      
     this.loggeduser=JSON.parse(user);
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
     
     this.loggeduserUsername = JSON.parse(user!).username;
     this.loggeduserEmail = JSON.parse(user!).email;     
     
  }

 
  // if logged user is member then change the page information 
  // if logged user is admin then in gym managment show .. gym , associated with him , gym names, 
  //if logged user is member then in gym management show .. gym joined by him

  // in message centre if loffed user is admin then here hw should get all mrequest sent by members to him
  // for extension show them as one liner .. if click that one liner then show that in alert ..
  // if click Ok in alert send back response message as delivered to member message centre with Accepted or Denied.
  
  
  // help and feedback .. keep some text area here limit 140 char, as soon as type start show
  // submit button 
  // as soon as submit is prssed store this message in DB and back end let this message go to app developer 
  // using node mailer along with member ID 

  /* in setting button .. show user profile 
  user profile containing 
  name 
  email id
  telephone 
  address

  also privacy policy
  about 
  terms and conditions
  and at bottom logout 
  logout function with all delet cache data and all local storage clear , session clear data
  

   */

  ngOnInit() {

    if(!this.loggeduserIsAdmin){
    this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((data)=>{        
      this.memberId = data._id;
      this.memberGymId = data.gym_id;
      this.gymManagement(this.loggeduserIsAdmin);
      this.rechargeRequestMessage(this.memberId);
    });
  }

  if(this.loggeduserIsAdmin){

  }
    
  }


  gymManagement(admin:boolean){
    if(admin){
      console.log("Admin Execution")
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

  // Request Made show here use Ion chip to show number of request made by use with date and time 
  // also show if that is pending or accepted if pending .. if accepted then remove that and show push notification
  // as request accepted . 
  // use ngIF at html to check if request message is made or not 
  //if made then show div with Request Message made for Days ...
  // Recharge Request Accepted .. Pending 
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

  //check if user exist as member or not ?
// if he is not member or deleted by gym then page must route back to home page 
isUserMember(email){
  //search member DB for this email 
  this.memberApi.getMemberByEmail(email).subscribe((data:any)=>{
    console.log(data);
    if(!data){
      
      this.router.navigateByUrl('/home',{replaceUrl: true,});
    }else{
      // this.memberEndDate = data.m_enddate*1; // in Unix millisecond formate
      // this.memberOutTime = data.m_outtime*1 // in Unix milisecond
      // this.memberInTime = data.m_intime*1// in unix milisecond
      // this.gymId = data.gym_id // get gym ID
    }

  });
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

async feedbackAlert(){  
  const alert = await this.alertController.create({
    header :'Feedback or Query About App',
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
            }
        }, 
        {
            text: 'Send',
            handler: (alertData) => { //takes the data 
                console.log(alertData.feedback);
                //  this.RechargeApi.addRecharge({"member_id":this.memberId,"days":alertData.recharge_days,"isAccepted": "0"}).subscribe((data)=>{
                //   console.log(data);
                //  });
            }
        }
    ]
});
await alert.present();
}

settings(){
  this.router.navigate(['../settings'],{replaceUrl:true});
}

// get initials of name as avatar look 
getInitials(firstName:string) {
  return firstName[0].toUpperCase();
}
//fetch Location so that if user want to update can update his location 

}
