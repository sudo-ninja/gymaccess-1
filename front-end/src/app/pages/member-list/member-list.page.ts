import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import { JsonPipe } from '@angular/common';

// call user service to update user as member as soon as invite accepted
import { UserService } from 'src/app/services/user.service';

// to get storage
import { StorageService } from 'src/app/services/storage.service';
 
// animation from right to left for modal open 
import { AnimationController } from '@ionic/angular';
import { createAnimation } from '@ionic/core';



 
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.page.html',
  styleUrls: ['./member-list.page.scss'],
})
export class MemberListPage implements OnInit {
  // @ViewChildren(IonCard,{read:ElementRef})
  BalanceDays_ = localStorage.getItem('balanceDays');
  isButtonSubmit:boolean=false;

  members: Member[] = [];
  mcontrols: Mcontrol[] =[];
  _id :string; // This is an observable
  _email:any;
  _memberid:any;
  _mobile:any;
  _duration:any;
  _invitationcode:any;

  searchField: FormControl;

  //range value for slider bar to show how much % left 
  RangeValue:Number;
  


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

  ngOnInit() {
    
    // get member associated with this gym only
    this.getMembers();
    // const searchTerm = this.searchField.valueChanges.pipe(
    //   startWith(this.searchField.value));
    console.log(this.searchTerm);
    this.memberControl(); // here its call so that patch value can work
    // to get default gym value
    // this.MyDefaultGymValue = "GYM NAME here"
    this.compareWith = this.compareWithFn; 
       
   }

   // if end date of memeber is less than 7 days then set alert and change color to RED
   checkMemberlastingtime(id:any){

   }

   handleChange(event) {
    const query = event.target.value.toLowerCase();
    console.log(query);
    // this.results = this.members.filter(d => d.indexOf(query) > -1);
  }


async inviteControl(){
  this.inviteControlForm = this.formBuilder.group({
    'member_id' : ['', Validators.required],
    'email' : ['', Validators.required],
    'mobile': ['', [
      Validators.required,
      // Validators.minLength(10),
      // Validators.maxLength(13),
      // Validators.pattern('^[0-9]*$')
    ]
    ],
    'inviteCode':['', Validators.required],
    'duration':['',Validators.required],
    }); 
} 

async memberControl(){
    this.memberForm=this.formBuilder.group({
      'isInviteAccepted':[]
      /// was planning to get three state varibale .. like invite accepted , true , false , pending..
    });
}

async getMembers(){
  const loading = await this.loadingController.create({
    message: 'Loading....'
  });
  await loading.present();
  // to store gym id as same will be used to add member page to add member in perticular gym
  this.storageService.store('defaultGymId',this._gym_id);
  localStorage.setItem('gymID',this._gym_id);
  console.log(this._gym_id);
  await this.memberApi.wildSearch(this._gym_id)
  .subscribe(res=>{
    this.members=res;
    // this.memberLastdate = res.m_enddate;
    console.log(this.members);
    localStorage.setItem('thisMember',JSON.stringify(res));
    this.storageService.store('membersList',res);
    loading.dismiss();
  }),err=>{
    console.log(err);
    loading.dismiss();
    }
    
  }

  // drop(event:CdkDragDrop<string[]>){
  //   moveItemInArray(this.members,event.previousIndex,event.currentIndex);
  // }

  addProduct() {
    this.router.navigate(['/member-add']);
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

  async inviteMember(uid:string){
   console.log(uid);
   this.memberApi.getMember(uid).subscribe((data)=>{
    try {
      console.log(data);
      console.log(data.isInviteAccepted);
      console.log(data.email); // this email will search in member control DB if already this exist 
      // once invite accepted or time passed lets delet this from DB so one time only one code is there
      this.invitaionAccepted = data.isInviteAccepted;

    if(this.invitaionAccepted==="Yes"){
        this.presentAlert('Invitation Accepted','Already Member','');
        
        console.log("disable invitation button");
        this.invitaionButtonDisabled=true;
     }else if(this.invitaionAccepted==="Pending")
     {
        console.log("call function to get alreay generated code");
        this.CheckIfInvited(uid);
     }
     else{  
          this.CodeAlert(uid,'Invitation Code','Please Ask Member to Enter this code in JOIN GYM input *** Code Valid for 3 Days *** ');
      };
      } catch (error) {
      throw error;
    }    
   });
   

  //  if(this.mcontrol_s.getMcontrolEmail(this.inviteMemberMail)){
    
  //   this.inviteContolAlertSubHeaderMessage = "iCode";
  //   this.inviteControlHeaderMessage = "Invitaion Code";
  //   this.inviteContolAlertMessage = 'Please ask member to enter this code in "JOIN GYM", ***Valid For 1 Hours***';
  //  }else{
  //   this.inviteControlHeaderMessage = "Invitaion Acceptance Pending !";
  //   this.inviteContolAlertSubHeaderMessage = 'Already Invitaion Code Generted';
  //   this.inviteContolAlertMessage = "Please Ask Member to Enter Code after Clicking in JOIN GYM";
  //   this.invitaionCodeGenerated = true;
  //  }
  //   if(this.invitaionCodeGenerated){
  //     console.log("in 164 loop");
  //   }
      

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

  async CodeAlert(uid:any,header:string,message:string){

    var iCode = Math.floor(1000000*Math.random());
    console.log(iCode);
    this._invitationcode = iCode;
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: this._invitationcode.toString(),
      message: message,
      buttons: [
        {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          this.inviteControl(); // invite control form from FB
          this.memberApi.getMember(uid).subscribe(res=>
            {
            this.member=res;
            console.log(this.member);
            this._duration=Date.now()+(3*60*60*1000);
            console.log('in handelr = ',this._email,this._duration,this._invitationcode,this._memberid,this._mobile)
            this.inviteControlForm.patchValue({
              member_id : this.member._id,
              email : this.member.email,
              mobile: this.member.mobile,
              inviteCode:this._invitationcode,
              duration:this._duration,
            }); 

            // this.memberForm.patchValue({
            //   isInviteAccepted:"Pending"
            // });

            this.inviteControlApi.addMcontrol (this.inviteControlForm.value)
            .subscribe((res: any) => {
                console.log('Added invitation code');
                console.log(this.member.email);
                this.setInvitaion(this.member.email,"Pending");
              }, (err: any) => {
                console.log(err)
              });
              
            }),err=>{
          console.log(err);   
           } },
      }
      ],
      
    });    
 
    await alert.present();

  }
 
  handleRefresh(event) {
    setTimeout(() => {
      this.getMembers();
      event.target.complete();
    }, 2000);
  };

  setInvitaion(email:any,pending:any){  
    console.log("in invitaion code setup")
    this.memberApi.getMemberByEmail(email).subscribe((data: any)=>{
      this.memberId = data._id
      // console.log(this.memberId);
      this.memberForm.patchValue(
        {
          isInviteAccepted:pending // Status Change to Pending
        });

    // some error as update PUT not getting ID
    console.log(this.memberId);
    this.memberApi.update(this.memberId,this.memberForm.value).subscribe((res: any) => {
      console.log('invitaion type change to =',res.isInviteAccepted);
    }, (err: any) => {
      console.log(err)
    });
        
    });    
    
  }

  async basicShare(){
    await Share.share({
      title:' This will appear in subject  ',
      text:' this will appear in message body',
      url:'url link from here '
    });
  }

  CheckIfInvited(uID:any)
  {
    this.memberApi.getMember(uID).subscribe((res:any)=>{
      try {
        this.tempEmail = res.email;
        console.log(this.tempEmail);
        this.inviteControlApi.getMcontrolEmail(this.tempEmail).subscribe((res:any)=>{
          try {
          console.log(res);
          if(res.inviteCode)
          {
            console.log("already invited..get invitaion code from DB only")
            console.log(res.inviteCode);
            this.presentAlert(res.inviteCode,"Already Invited","Invitaion Acceptance is Still Pending!!");
            // return res.invitationCode;
          }else
          {
            console.log("not yet invited or invitation expired");
            // this.CodeAlert(uID,'Invitation Code','Please Ask Member to Enter this code in JOIN GYM input *** Code Valid for 3 Days *** ');
    
            // return false;
          }
          } catch (error) {
            throw error;
          }
        });
      } catch (error) {
        throw error;
      }
    });       

    
  }

  deleteCodeIfacceptedOrExpired(email:any,ifAccepted:boolean){    
    this.inviteControlApi.getMcontrolEmail(email).subscribe((res:any)=>{
      try {
        this.tempid=res._id;
        this.tempDuration = res.duration;
      } catch (error) {
        throw error;
      }
    });
    if(ifAccepted){
      this.inviteControlApi.delete(this.tempid);      
    }else{
      if(Date.now()>this.tempDuration){
        this.inviteControlApi.delete(this.tempid);
      }return;
    }
  }
 
  //set user as member if invite accepted
  setUserasMember(loggedUserId:any){
    this.userApi.update(loggedUserId,{"isMember":"true"}).subscribe((data)=>{
      console.log(data);
    });
  

  }

  onTap(event: any) {
    console.log('tap: ', event);
  }

  onDoubleTap(event: any) {
    console.log('double tap: ', event);
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
      this.inviteMember(uid); 
     
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


rangeValue(endate:any,balanceDays:any){
  let currentDate = new Date();
  endate = new Date(endate);
  return  Math.floor((Math.floor((Date.UTC(endate.getFullYear(), endate.getMonth(), endate.getDate())-Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) /(1000 * 60 * 60 * 24)))/balanceDays);

  // console.log();
    // console.log(((new Date(endate)).getTime()-Date.now()));
    // console.log(balanceDays);

}


selecthandleChange(ev){
this.currentGym = ev.target.value;
this.MyDefaultGymValue = ev.target.value;
// console.log(this.currentGym);
this._gym_id = this.currentGym;
console.log(this._gym_id);
this.getMembers();
this.compareWithFn(this._gym_id,ev.target.value);
}

customPopoverOptions = {
  header: 'My GYM(s)',
  // subHeader: 'Select Specific Gym',
  message: 'Select Specific Gym',
};

// compareFn(g1:Gym,g2:Gym) : boolean{
//   return g1 && g2 ? g1.gym_name == g2.gym_name : g1 == g2;

// }



compareWithFn(o1, o2) {
  return o1 === o2;
};

deletAllMembers(){
  this.memberApi.deleteAll();
}
// may use inbuilt icon https://fontawesomeicons.com/Ionic/icons?search=bar
// if memmber expiry date from current date is less then 5 only then show some image like
// if more then 5 days then full 5 step with green color and thick green border 
// battery full with 5 steps with red color 
//if remain 4 then with 4 step with red
// if 3 steps with 3 step with red
// if 2 days then 2 step with red
// if 1 day then 1 step with red and some flash and red border to member card
// if Zero day then show more thick red border and all card text to red color 

// to slide member ifnormation from right to left
// angular.module('app', ['ionic'])

// .controller('appCtrl', function($scope, $ionicModal) {
//   $ionicModal.fromTemplateUrl('templates/modal.html', {
//     scope: $scope,
//     animation: 'slide-in-right'
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });
//   $scope.openModal = function() {
//     $scope.modal.show();
//   }
//   $scope.closeModal = function() {
//     $scope.modal.hide();
//   }
// })

// to get intial of name as avatar
getInitials(firstName:string) {
  return firstName[0].toUpperCase();
}

// // to get intial of name as avatar
// getInitials(firstName:string, lastName:string) {
//   return firstName[0].toUpperCase() + lastName[0].toUpperCase();
// }

}
