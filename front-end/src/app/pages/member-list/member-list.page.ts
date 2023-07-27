import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// to share invitation code 
import { Share } from '@capacitor/share';
//ion modal 
import { IonModal, IonSelect, IonSelectOption, NavController } from '@ionic/angular';

import { AlertController, IonDatetime, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import {Mcontrol} from 'src/app/models/mcontrol'

import {MemberserviceService}  from 'src/app/services/memberservice.service';
import { MemberUpdatePage } from '../member-update/member-update.page';
import { MembercontrolPage } from '../membercontrol/membercontrol.page';

import{McontrolService} from 'src/app/services/mcontrol.service' // to control invite code 
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GymService } from 'src/app/services/gym.service';

import { Gym } from 'src/app/models/gym.model';
//call mqtt api
import { MqttService } from 'src/app/services/mqtt.service';


// call user service to update user as member as soon as invite accepted
import { UserService } from 'src/app/services/user.service';

// to get storage
import { StorageService } from 'src/app/services/storage.service';
 
// animation from right to left for modal open 
import { AnimationController } from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { error } from 'console';
import { highlighteDate } from 'src/app/models/highlighteDate';


// to call components here 
import { IonicModule } from '@ionic/angular';
import { BannerComponent } from '../../components/banner/banner.component';
// call banner service 
import { BannerService } from 'src/app/services/banner.service';
import { environment } from 'src/environments/environment.prod';
import { AttendedPage } from './attended/attended.page';

// for countdown display on screen 
import { Subscription, interval } from 'rxjs';
// call ion select and close from ts 

// import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MemberAddPage } from '../member-add/member-add.page';

// import {first} from 'rxjs/operators';

 
// @UntilDestroy() //always use before @component came from https://www.npmjs.com/package/@ngneat/until-destroy this package


@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.page.html',
  styleUrls: ['./member-list.page.scss'],


})


export class MemberListPage  {
  //for ion select view here 
  @ViewChild(IonSelect) select:IonSelect;
  //for countdown time
  private subscription: Subscription;

  @ViewChild(IonDatetime) datetime:IonDatetime;
  @ViewChild(IonModal) modal: IonModal;

  //member list page is child 
  // @Input() loadMembers_P:any = [];
  //slide show 
  members_slides: any[] = [];
  baseUri : string = environment.SERVER;
  background_memberlist_page_image:any[] =[];
  background_image:any;  

  BalanceDays_ = localStorage.getItem('balanceDays');
  isButtonSubmit:boolean=false;

  members: any = [];
  listMembers:Member[] = [];
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
  highlightedDates:any ;
  highlightedDates_:highlighteDate[]=[];

  attendanceDays:any;

  // for modal 
  canDismiss = false;
  presentingElement = null;
  
  // for gym selector visibitly control
  isItemShown:boolean=false;
  countdownSeconds: number;
  countDownStarted:boolean = false;


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
  
  today_ = Date.now();

  gyms:any=[];
  currentGym :any;
  MyDefaultGymValue:any;
  compareWith:any;


  //detect swipe direction
  swipeDirect:any;
  selectedUid:any;// user ID of selected user

  

  public results = [...this.members];// to be used for search bar
  start_Date: string;
  end_Date: string;
  currentGymName: string;
  imageUrl: any;
  loadMembers: Subscription;
  gymsResult: unknown;
  membersCopy: Member[] =[];
  memberList:any =[];
  


  constructor(
    private animationCtrl: AnimationController, // for animation control 
    public loadingController:LoadingController,
    public router :Router,
    public route :ActivatedRoute,
    public gymApi:GymService,
    public userApi: UserService,
    
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,

    private formBuilder: FormBuilder,
    private inviteControlApi:McontrolService,
    public memberApi:MemberserviceService,
    private attendApi:AttendanceService,

    //call mqtt api
    private mqttApi:MqttService,

     

    // to store data
    private storageService :StorageService, // storage service is used insted of get set method

    // to get native element 
    private elementRef:ElementRef,
    // banner service api
    private bannerApi:BannerService,
    

  ) { 
    // const defaultGym = localStorage.getItem('DefaultGym'); // got default GYM value from Gym list page
    // this.MyDefaultGymValue = (JSON.parse(defaultGym))._id;
    // this._gym_id=this.MyDefaultGymValue;
    // console.log(this._gym_id); // this default Gym got from Gym List page ( first added Gym become Default Gym)
    
    
    this.searchField = new FormControl(''); // for search bar

    const user = localStorage.getItem('User'); // collected user detail from login
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);

   
    this.today_ = this.today_*1+604800000;
    console.log(this.today_);

    // check if gets member in consturctor wrk well or not 
    // this.getMembers();
    // this.getGyms();
    // for select default gym in gym selector
    const defaultGym = localStorage.getItem('DefaultGym'); // got default GYM value from Gym list page
    this.MyDefaultGymValue = JSON.parse(defaultGym)._id;
    this._gym_id = this.MyDefaultGymValue;
    console.log(this._gym_id); // this default Gym got from Gym List page ( first added Gym become Default Gym)
    this.storageService.get('gymList').then((val) => {
      // console.log(val); // here we store once fetched gym data
      this.gymsResult = val;
      console.log(this.gymsResult);
      this.gyms = this.gymsResult;
    });
  }

  ngOnInit() {
    this.getMembers();
    this.membersCopy = this.members;
   
    console.log("ng on init");
    // implements OnInit, OnDestroy
      // const searchTerm = this.searchField.valueChanges.pipe(
    //   startWith(this.searchField.value));
    // console.log(this.searchTerm);
    this.memberControl(); // here its call so that patch value can work

    // to get default gym value
    // this.MyDefaultGymValue = "GYM NAME here"
    this.compareWith = this.compareWithFn; 

    // to get image for banner
    this.callBanner();
    // for background image
    this.background();
  }

  ionViewDidEnter(){
    console.log("ion view did enter");
    // this.getMembers();
    // this.getGyms();
  }

  ionViewWillLeave(){
    console.log("ion view will leave");
  }

  ionViewDidLeave(){
    console.log("ion view did leave");
    // this.getMembers();
    // this.getGyms();
  }

  ionViewWillEnter()  {    
    
    console.log("ION VIEW WILL ENTER");
    // get member associated with this gym only
    this.getMembers();
    this.getGyms();
  
   }

   async getGyms(){
    this.gymApi.wildSearch(this.loggeduser._id).subscribe(
      (data:any)=>{
        console.log(data.slice());
        this.gyms = data.slice(); // from here passing data to gym selector  for list of gyms   
    }
    );

    
  }
  
    

   
   // call image from back end to display on html page 
   callBanner(){
    this.bannerApi.getImageByGymId("default_memberlist_page").subscribe({            
      next:dat=>{
        console.log(dat)
        for (let i = 0; i <dat.length; i++) {
          // make array of image objects
          this.members_slides.push(
            {banner:this.baseUri+'/images/'+dat[i].image_path}
          );
        };
      },
      error:err=>{ console.log(err)}
    });
   }
   // for background image 
   background(){
    this.bannerApi.getImageByGymId("default_memberlist_page").subscribe({            
      next:dat=>{
        // console.log(this.baseUri+'/images/'+dat[1].image_path);
        this.background_image = this.baseUri+'/images/'+dat[0].image_path;
        // console.log(this.background_image);
        this.imageUrl = this.background_image;
      },
      error:err=>{ console.log(err)}
    });
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
      Validators.minLength(10),
      Validators.maxLength(13),
      Validators.pattern('^[0-9]*$')
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
  console.log('get data from member list');
  const loading = await this.loadingController.create({
    message: 'Loading....'
  });
  await loading.present();
  // to store gym id as same will be used to add member page to add member in perticular gym
  this.storageService.store('defaultGymId',this._gym_id);
  localStorage.setItem('gymID',this._gym_id);
  console.log(this._gym_id);
  // this.loadMembers = this.memberApi.wildSearch(this._gym_id).pipe(untilDestroyed(this)).subscribe(ps => {
  //   this.members = ps;
  //   loading.dismiss();
  // }),err=>{
  //   console.log(err);
  //   loading.dismiss();
  //   };
  this.loadMembers = this.memberApi.wildSearch(this._gym_id)
  .subscribe(res=>{
    // console.log(res.slice());
    this.members=this.sortByLatest(res.slice());
    // this.members =res.m_name.sort((b, a) => a[0] - b[0]);//does not work
    // this.listMembers = res;
    // console.log(this.listMembers);
    // this.members = this.listMembers;
    // this.memberLastdate = res.m_enddate;
    // console.log(this.members);
    // localStorage.setItem('thisMember',JSON.stringify(res));
    // this.storageService.store('membersList',res);
    loading.dismiss();
  }),err=>{
    console.log(err);
    loading.dismiss();
    }
    
  }


  sortByLatest(members) {
    const byLatest = function(member1,member2) {
      return member1.m_name.localeCompare(member2.m_name);
    };
    return members.slice().sort(byLatest);
  };

  sortByEndDate(members){    
    const byLatest = function(member1,member2) {
      return member1.m_enddate.Compare(member2.m_enddate);
    };
    return members.slice().sort(byLatest);

  }
 
  addProduct() {
    // this.router.navigate(['/member-add']);
    this.navCtrl.navigateForward('/member-add');
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
      cssClass:'update-modal',
      // breakpoints: [0, 0.5, 0.8],
      // initialBreakpoint: 0.8, 
      showBackdrop: false,
      enterAnimation,
      leaveAnimation   
      }
    );
    console.log(res => {this.memberApi.getMember(res.id);});
    await modal.present();

  }
// try to use modal controller for add member 

async addMember(){
  const modal = await this.modalCtrl.create({
    component: MemberAddPage,     
    breakpoints: [0, 0.5, 0.8],
    initialBreakpoint: 0.8, 
    showBackdrop: false,         
    }
  );  
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
    const modal = await this.modalCtrl.create({
    component: MembercontrolPage,
    cssClass:'update-modal',
    componentProps:{id:uid},
    // breakpoints: [0, 0.5, 0.8],
    // initialBreakpoint: 0.8,      
  });
  this.memberApi.getMember(uid).subscribe((res)=>{
    console.log(res);
  });
  this.isButtonSubmit=false;
  // await modal.present();
  modal.onDidDismiss().then(data => {
    this.getMembers();
    console.log('Update Member control Modal Is Closed', data);
});
return await modal.present();   
  
}

/// see attendnace in calender 
async seeAttendance(uid:string) {    
  console.log(uid);
  const modal = await this.modalCtrl.create({
  component: AttendedPage,
  componentProps:{id:uid},
  cssClass:'date-modal',
  // breakpoints: [0, 0.5, 0.8],
  // initialBreakpoint: 0.8,      
});
// this.memberApi.getMember(uid).subscribe((res)=>{
//   console.log(res);
// });
await modal.present();
// this.isButtonSubmit=false;
}


/// to invite user as member

  async inviteMember(uid:string){
   console.log(uid);
   this.memberApi.getMember(uid).subscribe((data)=>{
      console.log(data);
      // console.log(data.isInviteAccepted);
      // console.log(data.email); // this email will search in member control DB if already this exist 
      // once invite accepted or time passed lets delet this from DB so one time only one code is there
      this.invitaionAccepted = data.isInviteAccepted;

    if(this.invitaionAccepted==="Yes"){
        this.presentAlert('Invitation Accepted','Already Member','');
        
        console.log("disable invitation button");
        this.invitaionButtonDisabled=true;
        return;
     }else if(this.invitaionAccepted==="pending")
     {
        console.log("call function to get alreay generated code");
        this.CheckIfInvited(uid);
        return;
     }
     else{  
          this.CodeAlert(uid,'Invitation Code','Please Ask Member to Enter this code in JOIN GYM input *** Code Valid for 3 Days *** ');
      };
         
   });
   

  }



  async presentAlert(header:string,subheader:string, message:string) {
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header:header,
      subHeader: subheader,
      message:message,
      buttons: ['OK'],
      backdropDismiss: false // <- Here! :)
    });
    
    await alert.present();
  }

  async CodeAlert(uid:any,header:string,message:string){
    //first check is isInviteAccepted == Not , for that call member API with uid   
    this.memberApi.getMember(uid).subscribe({
      next:(res)=>{
        if(res.isInviteAccepted==='Not'){
          // Generate Code and add to DB 
          var iCode = Math.floor(1000000*Math.random());
          console.log(iCode);
          this._invitationcode = iCode;
          //add to DB
          this.inviteControl(); // invite control form from Form builder
               this.member = res;
                console.log(this.member);
                this._duration = Date.now() + 3 * 60 * 60 * 1000;
                this.inviteControlForm.patchValue({
                  member_id: this.member._id,
                  email: this.member.email,
                  mobile: this.member.mobile,
                  inviteCode: this._invitationcode,
                  duration: this._duration,
                });

                this.inviteControlApi
                  .addMcontrol(this.inviteControlForm.value)
                  .subscribe({
                    next: (res: any) => {
                      // to get gym name 
                      this.gymApi.getGym(this._gym_id).subscribe({ 
                        next:(res)=>{
                          this.currentGymName = res.gym_name;
                        },
                        error:(err)=>{ 
                          // this.showErrorToast(JSON.stringify(err));
                        }
                      });
                       }
                      })
      }
        else{
        console.log("in invite accepted Yes of Pending");
        }
      },
      error:(err)=>{},
    });

    
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header: header,
      subHeader: this._invitationcode.toString(),
      message: message,
      backdropDismiss: false, // <- Here! :)
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {

                      console.log(this._invitationcode ,"...",this.currentGymName);
                      this.basicShare(this._invitationcode,this.currentGymName);
                      this.setInvitaion(this.member.email, 'pending');
                    },
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
    // console.log("in invitaion code setup")
    this.memberApi.getMemberByEmail(email).subscribe({
      next:(data: any)=>{
      this.memberId = data._id
      this.memberForm.patchValue(
        {
          isInviteAccepted:pending // Status Change to Pending
        });
        console.log(this.memberId," and data to be updated",this.memberForm.value);
    this.memberApi.update(this.memberId,this.memberForm.value).subscribe({
      next:(res: any) => { console.log('invitaion type change to =',res.isInviteAccepted);         }, 
      error:(err: any) => {console.log(err) }
               });        
    }
  });   
  this.getMembers(); 
    
  }

  async basicShare(invitation_code:any, gym_name){

    await Share.share({
      title: `Invitation Code to Join ${gym_name}`,
      text:`${invitation_code}`,
      url:'download app from here - link of app '
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

  // this needed to use so that invitation code be deleted and if member deleted then 
  //added again then it should not catch olf code.
  deleteCodeIfacceptedOrExpired(email:any,ifAccepted:boolean){    
    if(ifAccepted){return;};
    this.inviteControlApi.getMcontrolEmail(email).subscribe(
      (res:any)=>{
        if(!res){ return; }
        else{
              console.log(res);
              this.tempid=res._id;
              this.tempDuration = res.duration;
              if(ifAccepted){
                console.log(this.tempid);
                this.inviteControlApi.delete(this.tempid).subscribe((res)=>{
                  console.log(res);
                });      
              }else{
                console.log(this.tempDuration);
                if(Date.now()>this.tempDuration){
                  this.inviteControlApi.delete(this.tempid).subscribe((res)=>{
                    console.log(res);
                });
              };            
                   };    
            }
          });    
  }
 
  //set user as member if invite accepted
  setUserasMember(loggedUserId:any){
    this.userApi.update(loggedUserId,{"isMember":"true"}).subscribe((data)=>{
      console.log(data);
    });
  }

  // date touched 
  dateTouched(value:any){
    this.isModalOpen = false;
    console.log("date touched", value);
  }

  //get attendance record when click on avatar or image
async attenRecord(id,event:any){
   
// this.CallmemberDates(id);
// // now get attendance and save them in highlighed 
// this.getAttendance(id);
  
//   event.preventDefault();
//   this.setOpen(true);
  // this.isModalOpen = true;
}

// autoShowItem(){
//   // this.isItemShown = true;
//   // this.select.open();
//   // this.startCountdown(30); // no need 
// }

// start count down for second
interval:any;
startCountdown(seconds) {
  console.log(this.isItemShown);
  let counter = seconds;    
  this.interval = setInterval(() => {
    console.log(counter);
    this.countdownSeconds = counter;
    counter--;      
    if (counter < 0 ) {
      clearInterval(this.interval);
      console.log(this.interval);
      console.log('Ding!');
      // this.countDownStarted = false;
      //write here whatever want after comple 
      
      this.isItemShown = false;
    }
  }, 1000);
}

// ionViewDidLeave():void{
//   this.loadMembers.unsubscribe();
//   console.log("ionViewWillLeave called");
//   }


// // Startdate and end date of perticular memers
// async CallmemberDates(id){
//   const loading = await this.loadingController.create({
//     message: 'Loading....'
//   });
//   await loading.present();
//   this.memberApi.getMember(id).subscribe({
//     next:res=>{
//       this.start_Date = this.toISOStringWithTimezone(new Date(+res.m_startdate));
//       this.end_Date = this.toISOStringWithTimezone(new Date(+res.m_enddate));
//       // console.log(this.start_Date , this.end_Date);
//       loading.dismiss();
//     },
//     error:error=>{
//       console.log(error);
//       loading.dismiss();
//     }
//   });
// }

// //get attendance by ID
// async getAttendance(id){
//   const loading = await this.loadingController.create({
//     message: 'Loading....'
//   });
//   await loading.present();

//   this.attendApi.getMemberAttendance(id).subscribe({
//     next:res=>{      
//       this.attendanceDays = res;
//       console.log(this.attendanceDays); 
//       for (let i = 0; i < this.attendanceDays.length; i++) {
//         this.highlightedDates_.push(
//           {
//             date:this.toISOStringWithTimezone(new Date(+this.attendanceDays[i].checkin_date)).split("T")[0],
//             textColor: 'var(--ion-color-warning-contrast)',
//             backgroundColor:'var(--ion-color-warning)',
//           }
//         );
//        }      
//       this.highlightedDates = this.highlightedDates_;
//       console.log(this.highlightedDates_);
//       loading.dismiss();
//     },
//     error:err=>{
//       console.log(err);
//       loading.dismiss();
//     },
//   });

// }

// open lock , call MQTT API to open lock ..withoit condition 
openLock(){
  //call mqtt api and pass lock id of selected gym_id , 
  this.gymApi.getGym(this._gym_id).subscribe({
    next:(res)=>{
      this.mqttApi.openLock({"topic":res.gym_lockId,"message":"1_Duration"}).subscribe({
        next:(res)=>{
          console.log(res);
        }
      }); // to open lock
    }
  });
}


ngOnDestroy(): void {

}

 


// //ion date time dismiss button 
// close(){
//   this.datetime.cancel(true);
//   //set highligthed date array empty
//   this.highlightedDates=[];
//   this.modal.dismiss(true);
// }

  onTap(event: any) {
    console.log('tap: ', event);
  }

  onDoubleTap(event: any) {
    console.log('double tap: ', event);
  }

  onPress(event: any) {
    console.log('press: ', event);
    this.openLock();
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
}


selecthandleChange(ev){
this.currentGym = ev.target.value;
this.MyDefaultGymValue = ev.target.value;
console.log(ev);
this._gym_id = this.currentGym;
console.log(this._gym_id);
this.getMembers();
this.compareWithFn(this._gym_id,ev.target.value);
}

compareWithFn(o1, o2) {
  return o1 === o2;
};

searchText:any = '';

onSearchTextEntered(searchValue:any){
this.searchText = searchValue;
console.log(this.searchText);
}

// for search bar 
async handleInput(evt) {
  // this.getMembers();
  this.membersCopy = this.members;
  const searchTerm = evt.srcElement.value;
  if(!searchTerm) {
    this.getMembers();// if empty load default value
    return;}
  console.log(searchTerm);
  console.log(this.membersCopy);
  if(Array.isArray(this.membersCopy)){
  this.members= this.membersCopy.filter(currentMember=>{
    console.log(currentMember.m_name);
    if(currentMember.m_name && searchTerm){
      return (currentMember.m_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
            || currentMember.mobile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
            );
    }
  });
  console.log(this.members);
}
  // const query = evt.target.value.toLowerCase();
  // this.results = this.members.m_name.filter((d) => d.toLowerCase().indexOf(query) > -1);
}

deletAllMembers(){
  this.memberApi.deleteAll();
}

isModalOpen = false;

setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
  console.log("isModalOpen", isOpen);
}

cancel(){
  this.setOpen(false);
}

confirm(){
  this.setOpen(false);

}


// to get intial of name as avatar
getInitials(firstName:string) {
  return firstName[0].toUpperCase();
}

     // convert date to ISO string with timezone
     toISOStringWithTimezone(date)
     {
      const tzOffset = -date.getTimezoneOffset();
      const diff = tzOffset >= 0 ? '+' : '-';
      const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        diff + pad(tzOffset / 60) +
        ':' + pad(tzOffset % 60);
    };


    // toast 
    async showErrorToast(data: any) {
      let toast = await this.toastCtrl.create({
        message: data,
        duration: 3000,
        position: 'top',
      });
      toast.onDidDismiss();
      await toast.present();
    }
}


