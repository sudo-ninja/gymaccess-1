import { Component, OnInit} from '@angular/core';
import { ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import {Mcontrol} from 'src/app/models/mcontrol'

import {MemberserviceService}  from 'src/app/services/memberservice.service';
import { MemberUpdatePage } from '../member-update/member-update.page';
import { MembercontrolPage } from '../membercontrol/membercontrol.page';

import{McontrolService} from 'src/app/services/mcontrol.service' // to control invite code 
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GymService } from 'src/app/services/gym.service';
import { Gym } from 'src/app/models/gym.model';


// call user service to update user as member as soon as invite accepted
import { UserService } from 'src/app/services/user.service';

// to get storage
import { StorageService } from 'src/app/services/storage.service';
 
// animation from right to left for modal open 
import { AnimationController } from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { Feedback } from 'src/app/models/feedback';
import { FeedbackserviceService } from 'src/app/services/feedbackservice.service';
import { RechargeService } from 'src/app/services/recharge.service';

// for local notification 
import { CancelOptions, Channel, LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';


@Component({
  selector: 'app-feedback-alert',
  templateUrl: './feedback-alert.page.html',
  styleUrls: ['./feedback-alert.page.scss'],
})
export class FeedbackAlertPage implements OnInit {

  BalanceDays_ = localStorage.getItem('balanceDays');
  isButtonSubmit:boolean=false;

  feedbacks:Feedback[]=[];
  expry_members:Member[]=[]; // to store expiry member data coming from loop of feedback
  valid_members:Member[]=[]; // to store validity extension member data coming from loop of feedback
  feed_members:Member[]=[]; // to store feedback of member data coming from loop of feedback
  


  members: Member[] = [];
   
  _id :string; // This is an observable
  _email:any;
  _memberid:any;
  _mobile:any;
  _duration:any;
  _invitationcode:any;

  searchField: FormControl;

 
  inviteControlForm!: FormGroup;
  memberForm!:FormGroup;
  isLoadingResults = false;
  member: Member;
  mcontrol : Mcontrol;
  _gym_id:any;
  _notAdmin: boolean = true;

  inviteMemberMail:any;
  inviteContolAlertMessage:any;

  inviteContolAlertSubHeaderMessage:any;
  inviteControlHeaderMessage:any;
  invitaionCodeGenerated:Boolean = false;
  invitaionAccepted:any;
  invitaionButtonDisabled:Boolean = false;

  loggeduserEmail:any;
  loggeduser: any;

  searchTerm: string;

  tempid:any;
  tempDuration:any;
  tempEmail:any;
  memberId:any;
  memberLastdate:any;
  isSevenDayslefts:boolean = false;
  today_ = Date.now();

  gyms:Gym[]=[];
  currentGym :any;
  MyDefaultGymValue:any;
  compareWith:any;


  //detect swipe direction
  swipeDirect:any;
  selectedUid:any;// user ID of selected user

  

  public results = [...this.members];


  constructor(
    private feedbackApi :FeedbackserviceService,
    private rechargeApi :RechargeService,

    private animationCtrl: AnimationController, // for animation control 
    public loadingController:LoadingController,
    public router :Router,
    public route :ActivatedRoute,
    public gymApi:GymService,
    public userApi: UserService,
    
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,

    private formBuilder: FormBuilder,
    private inviteControlApi:McontrolService,
    public memberApi:MemberserviceService,

    // to store data
    private storageService :StorageService, // storage service is used insted of get set method

    // to get native element 
    private elementRef:ElementRef,


  ) { 
    const defaultGym = localStorage.getItem('DefaultGym'); // got default GYM value from Gym list page
    this.MyDefaultGymValue = (JSON.parse(defaultGym))._id;
    this._gym_id=this.MyDefaultGymValue;
    console.log(this._gym_id); // this default Gym got from Gym List page ( first added Gym become Default Gym)
    
    
    this.searchField = new FormControl(''); // for search bar

    this.feedbackApi.getFeedbackByExpiryMember(this._gym_id,true).subscribe((res)=>{
      console.log(res);
      if(res){
        for (let i = 0; i < [res].length; i++) {
          if(res[i].isExpiryAlert){
            console.log(res[i]);
            this.memberApi.getMember(res[i].sender_id).subscribe((data)=>{
              if(+data.m_enddate < Date.now()){
                console.log("Member Date Gone");
                this.expry_members[i] = data; // to store data of expiry members
              this.getLocalNotification(111,"expiry alert","member subscription expired",11,"Member Expiry Alert",data.m_name,`${data.m_name} had Expiry Date on ${data.m_enddate
                }`,"Name Last Date");
              }return;              
            }) ;           
            }
          //now trigger notification with this data with channel i and i. name , i. expiry date , i . mobile,
          // as soon as notification triggered delete i.id from DB .
          // check possibility to do this on member list page 
          //check posibilty if click on notification and nevigate to feedback page .
        }
      } return;
    });
      // for feedback validty request sent by some user 
      this.feedbackApi.getFeedbackByValidityReq(this._gym_id,true).subscribe((res)=>{
        console.log(res);
        if(res){
          for (let i = 0; i < [res].length; i++) {
            if(res[i].isValidityRequestAlert){
              console.log(res[i]);
              this.memberApi.getMember(res[i].sender_id).subscribe((data)=>{
                if(+data.m_enddate < Date.now()){
                  console.log("Member Date Gone");
                  this.expry_members[i] = data; // to store data of expiry members
                this.getLocalNotification(222,"Validity alert","member validity extension alert",i+100,"Request for Extension",data.m_name,`${data.m_name} had Expiry Date on ${data.m_enddate
                  }`,data.memberType);
                }return;              
              }) ;           
              }
            //now trigger notification with this data with channel i and i. name , i. expiry date , i . mobile,
            // as soon as notification triggered delete i.id from DB .
            // check possibility to do this on member list page 
            //check posibilty if click on notification and nevigate to feedback page .
          }
        } return;
      });
        // for pure feedback 

        this.feedbackApi.getFeedbackByFeedback(this._gym_id,true).subscribe((res)=>{
          
    });

    const user = localStorage.getItem('User'); // collected user detail from login
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);

    this.gymApi.wildSearch(this.loggeduser._id).subscribe((data:any)=>{
      try {
        if(data){
          console.log(data.length,"GYM ID==..",data);
           this.gyms = data; // from here passing data to gym selector         

        }      
      } catch (error) {
        throw error;
      }
    });

    this.today_ = this.today_*1+604800000;
    console.log(this.today_);
  }

  async changeValidity(member_id){
    this.updateMemberControl(member_id); // modal for validity change
  }

  //notification 

  ngOnInit() {
    
    console.log(this.searchTerm);
    this.compareWith = this.compareWithFn; 
       
   }

   
   handleChange(event) {
    const query = event.target.value.toLowerCase();
    console.log(query);
    // this.results = this.members.filter(d => d.indexOf(query) > -1);
  }


  ///////////////////for animation ///////////////
  async presentModal(mid:string) {
    const enterAnimation = (baseEl: any) => {
      const root = baseEl.shadowRoot;

      const backdropAnimation = this.animationCtrl.create()
        .addElement(root.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl.create()
        .addElement(root.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' }
        ]);

      return this.animationCtrl.create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    }

    const modal = await this.modalCtrl.create({
      component: MemberUpdatePage,
      componentProps:{id:mid},
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8, 
      showBackdrop: false,
      enterAnimation,
      leaveAnimation   
      }
    );
    console.log(res => {
      this.memberApi.getMember(res.id);});
    await modal.present();
  }

// to update member information 
  async updateMember(mid:string) {
      const modal = await this.modalCtrl.create({
      component: MemberUpdatePage,
      componentProps:{id:mid},
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8, 
      showBackdrop: false,
           
      }
    );
    console.log(res => {
      this.memberApi.getMember(res.id);});
    await modal.present();
  }

  /// Validity Controller by update member control
  async updateMemberControl(uid:string) {
    // setTimeout(x => {
    //   this.isButtonSubmit=true;
    // },500)//.5 seconds
    
    const modal = await this.modalCtrl.create({
    component: MembercontrolPage,
    componentProps:{id:uid},
    breakpoints: [0, 0.5, 0.8],
    initialBreakpoint: 0.8,      
  });
  console.log(res => {
    this.memberApi.getMember(res.id);
  });
  await modal.present();
  this.isButtonSubmit=false;
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

   
  handleRefresh(event) {
    setTimeout(() => {
      // this.getMembers();
      event.target.complete();
    }, 2000);
  };

 

  async basicShare(){
    await Share.share({
      title:' This will appear in subject  ',
      text:' this will appear in message body',
      url:'url link from here '
    });
  }
 
 
  
  onPress(event: any) {
    console.log('press: ', event);

  }

  // swipe work in android limited phone , need to make backup in case does not work 
  // make small size button at right and left 
  // right button < for invite
  // left button > for update
  onSwipe(uid:string,event:any) {
       
    if(event.dirX=="right" && event.swipeType=="moveend"){
      console.log(event.dirX);
      console.log(uid);
      // this.inviteMember(uid); 
     
    }
    if(event.dirX=="left" && event.swipeType=="moveend"){
      console.log(event.dirX);
      this.updateMember(uid);
      
    }
    
  }

  swipeDirection(dir){
    if(dir==="right")
    {
      // this.swipeDirect=event.dirX;
      // 
    }
    if(dir==="left")
    {
      // this.swipeDirect=event.dirX;
      // this.updateMember(uid);
      
    }
  }
  
  CallTel(tel) {
    window.location.href = 'tel:'+ tel;
}





selecthandleChange(ev){
this.currentGym = ev.target.value;
this.MyDefaultGymValue = ev.target.value;
// console.log(this.currentGym);
this._gym_id = this.currentGym;
console.log(this._gym_id);
// this.getMembers();
this.compareWithFn(this._gym_id,ev.target.value);
}


compareWithFn(o1, o2) {
  return o1 === o2;
};


// to get intial of name as avatar
getInitials(firstName:string) {
  return firstName[0].toUpperCase();
}


//to get local notification on unique channel 
async getLocalNotification(channelId,channelName,channelDesc,noti_id,noti_title,noti_body,
  noti_largeBody,noti_summary,){

    let channelId_:Channel={
      id: channelId,
      description:channelDesc,
      name:channelName,
      visibility:1,
    };
    let options:ScheduleOptions={
      notifications:[
        {
          id:+noti_id,
          title:noti_title,
          body:noti_body,
          largeBody:noti_largeBody,
          summaryText:noti_summary,
          largeIcon:'res://drawable/splash.png',
          smallIcon:'res://drawable/splash.png',
          channelId:channelId,
          schedule:{every:'day'}
        }
      ]};

      try{
        await LocalNotifications.createChannel(channelId_);
        await LocalNotifications.schedule(options);
      }
      catch (exp){
        alert(exp)
      }
}

//https://www.youtube.com/watch?v=A3X0-ZgU-KI
// follow this video to know more about notifiction 

async isscheduleNotification(){
  let options:ScheduleOptions={
    notifications:[
      {
        id:111,
        title:"Reminder Notification",
        body:"Explore new offers",
        largeBody:"Get 30% Discount",
        summaryText:"Exciting Offers !!!!",
        largeIcon:'res://drawable/splash.png',
        smallIcon:'res://drawable/splash.png',
        channelId:"channel2",
        schedule:{every:'second'}
      },
      {
        id:222,
        title:"Upgrade Notification",
        body:"Upgrade Member Subscription",
        largeBody:"Get Discount on Long Period Subscription",
        summaryText:"required action !!!!",
        // largeIcon:'res://drawable/splash.png',
        // smallIcon:'res://drawable/splash.png',
        channelId:"channel1",
        schedule:{every:'second'}
      }
    ]
  }
  try{
    await LocalNotifications.schedule(options);
  }
  catch(ex)
  {
    alert(JSON.stringify(ex));
  }
}

async cancelNotification(){
    let op:CancelOptions={
      notifications:[{id:222}]
    }
    await LocalNotifications.cancel(op);
}

async removeAllDeliveredNotifications(){
   await LocalNotifications.removeAllDeliveredNotifications();
}


async getDeliveredNotifications(){
  LocalNotifications.getDeliveredNotifications().then((res)=>{
    alert(JSON.stringify(res));
  })
}

async createChannel(){

  let channel1:Channel={
    id:"channel1",
    description:"first channel",
    name:"Channel 1",
    visibility:1,
  }

  let channel2:Channel={
    id:"channel2",
    description:"first channel",
    name:"Channel 2",
    visibility:1,
  }

  try{
    await LocalNotifications.createChannel(channel1);
    await LocalNotifications.createChannel(channel2);
  }
  catch (exp){
    alert(exp)
  }
}

async listChannel(){
  await LocalNotifications.listChannels().then((res)=>{
    alert(JSON.stringify(res));
  })
}

}

