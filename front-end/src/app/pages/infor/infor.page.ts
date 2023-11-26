import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

//for gym select
import { GymService } from 'src/app/services/gym.service';
import { Gym } from 'src/app/models/gym.model';
// to get members infor for perticular gymid
import { MemberserviceService } from 'src/app/services/memberservice.service';
// to store once fetched data from DB to store locally
import { StorageService } from 'src/app/services/storage.service';
import { SafeUrl } from '@angular/platform-browser';

import { Router } from '@angular/router';

// import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

// for range 
import { RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';


import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { GymDetailsPage } from '../gym-details/gym-details.page';

//call gymAdmin Services
import { GymadminService } from 'src/app/services/gymadmin.service';
//call lock service
import { LockService } from 'src/app/services/lock.service';
//for for builder
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AttenshiftService } from 'src/app/services/attenshift.service';
import { HolidayService } from 'src/app/services/holiday.service';


import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.page.html',
  styleUrls: ['./infor.page.scss'],
})
export class InforPage implements OnInit {
// for ion modal 
@ViewChild(IonModal) modal: IonModal;
lockForm!: FormGroup;
  gym_name_forLock: string;
  lock_type: any ={
    "id":"1",
    "type":"rimlock",
    "name":"Rim Lock"
  };
  res_lock_type:any ={
    "id":"",
    "type":"",
    "name":""
  };

  lock_id_db: any;
  closingDelay: string;
  isAttendanceOn: boolean;
  showAttenHoli: boolean = false;
  gym_attendance_id: any;
  isHolidayOn: any;
  gym_holidaylist_id: any;
  dataRetrieved: import("c:/Users/user/Desktop/gymaccess/front-end/src/app/models/lock").Lock;


  

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
//lock modal page
lock_id: any;

  // for gym selection
  gyms: Gym[] = [];
  currentGym: any;
  MyDefaultGymValue: any;
  compareWith: any;
  compareWithl:any;
  _gym_id: any;
  gymsResult: any;

  // to get members count
  memberResults: any;
  totalMembers: any;
  paidMembers: any;
  freeMembers: any;
  goingtoEndResults: any;
  goingtoExpire: any;
  paidMemberResults: any;
  freeMemberResults: any;
  _daysAfter: any;

  //lock ID toggle set as momentry trigger only
  lockIDtoggleTrigger: boolean = false;
  passageIDtoggleTrigger:boolean =false;
  loggeduser_id: unknown;

  constructor(
    public gymApi: GymService, // for Gym selection
    //form builder
    public fb: FormBuilder,
    public memberApi: MemberserviceService, // to get total numer of members
    // to store daa once fetch
    private storageService: StorageService, // storage service is used insted of get set method

    // to navigate page to qr code page
    private router: Router,
    //tostcontrole
    private toastCtrl: ToastController,
    //modal controller
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    //gym admin service API
    private gymAdminApi:GymadminService,
    //lock service api
    private lockApi:LockService,
    private attendApi:AttenshiftService,
    private holidayApi:HolidayService,
  ) {
    this.storageService.get('loggeduser_id').then((val) => {
      console.log("loged user ID from storage service",val);
      this.loggeduser_id = val;
    });

    // for select default gym in gym selector
    const defaultGym = localStorage.getItem('DefaultGym'); // got default GYM value from Gym list page
    this.MyDefaultGymValue = JSON.parse(defaultGym)._id;
    this._gym_id = this.MyDefaultGymValue;
    console.log(this._gym_id); // this default Gym got from Gym List page ( first added Gym become Default Gym)
    this.storageService.get('gymList').then((val) => {
      console.log(val); // here we store once fetched gym data
      this.gymsResult = val;
      console.log("gymlist retrieved from storage service",this.gymsResult);
      this.gyms = this.gymsResult;
      console.log("gym data retrieved from storage service", this.gyms);
    });

    this.storageService.get('defaultGymId').then((val) => {
      console.log(val); // here we store once fetched gym data
      this._gym_id = val;
      this.MyDefaultGymValue = val;
      console.log("default gym id retrieved from storage service",typeof val);
      console.log("gym id retrieved from storage service", this.MyDefaultGymValue);
    });

    // Java code for date calculation
    var date = new Date();
    date.setDate(date.getDate() + 7);
    console.log(date.getTime());
    this._daysAfter = date.getTime();
    console.log(this._daysAfter);
  }

  //to prevent double click on submit button
  // @HostListener('dblclick', ['$event'])
  //   clickEvent(event) {
  //     event.srcElement.setAttribute('disabled', true);
  //     }
  handleRefresh(event) {
    setTimeout(() => {
      this.getMembersData();
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.getMembersData();    

    this.compareWith = this.compareWithFn;
    this.compareWithl = this.compareWithlock;
    // this.DefaultLockValue = "1";
    this.getGym(this._gym_id);
    this.getLockbyGymid(this._gym_id);

  //   this.lockApi.getLockByGymId(this._gym_id).subscribe(
  //     {
  //       next:(res)=>{
  //           console.log(res.lock_type);
  //           this.showLockSelection = true;
  //           this.res_lock_type = res.lock_type;
  //           console.log(this.res_lock_type.id);
  //           this.DefaultLockValue = this.res_lock_type.id;
  //           this.lockRelayId = res.lock_relayId; // from here this id will come only after relay id is added.
  //           this.lock_id_db = res._id;
  //           this.closingDelay = res.lock_closing_delay;
  //           this.isToggled = res.lock_passage_mode;
  //           // this.currentLock = res.lock_type;
  //           this.showPassageMode(this.DefaultLockValue);
  //           this.showLockRelayId = true; // means relay already added            
  //         },
  //       error:err=>{
  //         console.log(err.error.message.includes("no data retrieved with this gym id"));
  //         if(err.error.message.includes("no data retrieved with this gym id")){
  //           this.showAssignLock = true;
  //         }

  //       }
  // }
  // )
  }

  ionViewWillEnter() {
    console.log("infor page ion view will enter");
    this.mainLockForm();
    this.getGym(this._gym_id);
    this.getMembersData();
    // this.mainLockForm();
  this.getLockbyGymid(this._gym_id);
  
  this.showRangeValue(this.isToggled);
  }

  logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

  async getGym(id){
    this.gymApi.getGym(id).subscribe(res=>{
      this.gym_name_forLock = res.gym_name;

      this.isAttendanceOn = res.gym_attendance;
      this.gym_attendance_id = res.gym_attendance_id;
      this.gym_holidaylist_id = res.gym_holiday_id;
      this.isHolidayOn = res.gym_isHoldaylistadded;
      // console.log("Gym Name XXXXX", this.gym_name_forLock);
    });
  }

  async getLockbyGymid(gymid:any){
    console.log(gymid);
    this.lockApi.getLockByGymId(gymid)
     .subscribe(
      {
        next:(res)=>{          
          this.showAssignLock = false;
          this.showLockSelection = true;
            this.res_lock_type = res.lock_type;
            console.log(this.res_lock_type.id);
            this.DefaultLockValue = this.res_lock_type.id;
            this.lockRelayId = res.lock_relayId; // from here this id will come only after relay id is added.
            this.lock_id_db = res._id;
            this.closingDelay = res.lock_closing_delay;
            this.isToggled = res.lock_passage_mode;
            // this.currentLock = res.lock_type;
            this.showPassageMode(this.DefaultLockValue);
            this.showLockRelayId = true; // means relay already added            
          },
        error:err=>{
          console.log(err.status);
          // error.message.includes("no data found with this ID")
          if(err.status === 500){
            this.showAssignLock = true;
            this.showLockSelection = false; // to hide lock selection
            this.showLockRelayId = false; // to hide lock relay id
          }

        }
  }
  )

  }

  selecthandleChange(ev) {
    this.currentGym = ev.target.value;
    this.MyDefaultGymValue = ev.target.value;
    // console.log(this.currentGym);
    this._gym_id = this.currentGym;
    // console.log(this._gym_id);
    this.getMembersData(); // this is responsible to change dynamically data as soon as selectio changed
    this.getGym(this._gym_id);
    this.getLockbyGymid(this._gym_id);

    this.compareWithFn(this._gym_id, ev.target.value);
    // if GYM id change then change Lock Division also for that entire lock setup must be driven by GYM iD.
  }
  compareWithFn(o1, o2) {
    return o1 === o2;
  }

  async getMembersData() {
    const loading = await this.loadingController.create({
      message: 'Loading....',
    });
    await loading.present();
    // to store gym id as same will be used to add member page to add member in perticular gym
    this.storageService.store('defaultGymId', this._gym_id);
    localStorage.setItem('gymID', this._gym_id);
    console.log(this._gym_id);

    this.memberApi
      .getMemberType(this._gym_id, 'free')
      .subscribe((data) => {
        // console.log(this._gym_id);
        this.freeMemberResults = data;
        this.freeMembers = this.freeMemberResults.length;
        loading.dismiss();
      });

    this.memberApi
      .getMemberType(this._gym_id, 'paid')
      .subscribe((data) => {
        this.paidMemberResults = data;
        this.paidMembers = this.paidMemberResults.length;
        this.totalMembers = this.freeMembers + this.paidMembers;
        // console.log(data);
        loading.dismiss();
      });

    this.memberApi
      .getGoingtoEndMember(this._gym_id, this._daysAfter)
      .subscribe((data) => {
        console.log(data);
        this.goingtoEndResults = data;
        this.goingtoExpire = this.goingtoEndResults.length;
        loading.dismiss();
      });
  }

  public qrcode_data: string;
  public qrCodeDownloadLink: SafeUrl = '';

  downloadQrCode(gid: any, url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.qrcode_data = JSON.stringify(gid);
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  // lock ID toggle
  lockIdToggle($event: any) {
    // console.log("i m in lock id toggle method")
    // this.lockIDinputAlert(this._gym_id);
    this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
  }

  //Passage Mode toggle
  passageIdToggle($event: any) {
    // console.log("i m in lock id toggle method")
    // this.lockIDinputAlert(this._gym_id);
    this.passageIDtoggleTrigger = !this.passageIDtoggleTrigger;
  }

  LockRelayIdUpdate(){
    this.lockIDinputAlert(this.lockRelayId);
  }
  // alert controller for Lock ID input
  async lockIDinputAlert(subheader:any) {
    const alert = await this.alertCtrl.create({
      header: 'Enter New Lock Relay Id',
      subHeader:"Current ID:-"+subheader,
      inputs: [
        {
          name: 'lock_id',
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            // this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
          },
        },
        {
          text: 'Ok',
          handler: (alertData) => {
            //takes the data
            // let validateObj = this.validateEmail(data);
            if (!alertData.lock_id) {
              // this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
              return;
            } else {
              console.log("In Alert Input Lock ID  from DB is ",this.lock_id_db);
              this.gymApi.getGym(this._gym_id).subscribe((res)=>{
                this.lockApi
                .update(res.gym_lockId, { "lock_relayId": alertData.lock_id })
                .subscribe((data) => {
                  console.log('Lock Id Updated as', data.lock_relayId);
                });
              })
              
            }
            // this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
          },
        },
      ],
    });
    await alert.present();
  }

  QrCodeDownLoad() {
    this.router.navigate(['/qrlabel/', this._gym_id]);
  }

  addmoregym() {
    this.router.navigate(['/gym-add/']), { replaceurl: true };
  }

  async gymUpdate() {
    console.log(this._gym_id);
    this.router.navigate(['/gym-details/', this._gym_id]);
    // here can not use modal controller to update gym dat as with in thos modal gmap modal is used
  }

  async showErrorToast(data: any) {
    let toast = await this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top',
    });
    toast.onDidDismiss();
    await toast.present();
  }

  memberFlag:boolean=false;
  removeGym() {
    console.log(this._gym_id);
    this.memberApi.wildSearch(this._gym_id).subscribe({
      next: (res) => {
        // if no member retrieve then only delete
        if(res.length){
          this.memberFlag = true;
          console.log(res);
          //  return;
        }else{this.memberFlag = false;}
        console.log(this.memberFlag);
        },
        error:()=>{},
    });
    if(this.memberFlag){
      this.presentAlert(
        'Warning !',
        'Can Not Remove Gym.',
        'This gym have members.'
      );
    }
    if (!this.memberFlag) {
          this.gymApi.wildSearch(this.loggeduser_id).subscribe({
            next: (data: any) => {
              if (data.length === 1 || data.length < 1) { // this for last gym
                this.gymApi.delete(this._gym_id).subscribe({
                  next: (res: any) => { 
                    this.RemoveAdminUsingGymId(this._gym_id);
                    this.router.navigate(['/gym-list/']), { replaceurl: true }; },
                  error: (err: any) => { alert(JSON.stringify(err));  },
                  complete:()=>{
                    return;
                  }
                  
                });
              }else{
                this.gymApi.delete(this._gym_id).subscribe({
                  next: (res) => {
                    console.log(res);
                    this.RemoveAdminUsingGymId(this._gym_id);
                    // set local storage with balance gyms so that selection after delet can work properly
                    this.gymApi.wildSearch(this.loggeduser_id).subscribe({
                      next: (data: any) => {
                        // console.log(data.length);
                        this.storageService.store('gymList', data);
                        // console.log(data[0].gym_name); // use this info to make default select GYM value and refer this further https://forum.ionicframework.com/t/ion-select-and-default-values-ionic-4-solved/177550/5
                        localStorage.setItem('DefaultGym', JSON.stringify(data[0]));
                        this.router.navigateByUrl('/gymtabs/member-list', {
                          replaceUrl: true,
                        });
                        // return;
                      },
                      error: (err: any) => {
                        // alert(JSON.stringify(err));
                      },
                    });
                  },
                  error: (err) => {
                    // alert(JSON.stringify(err));
                  },
                });
              }
            },error: (err: any) => {
              alert(JSON.stringify(err));
            },
          });
        //  return;
        } 
      
  }

  async presentAlert(header: string, subheader: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async RemoveAdminUsingGymId(gymid){
    this.gymAdminApi.deleteAllofThisGymID(gymid).subscribe((res)=>{
      console.log(gymid, "successfully Admin dieleted from gym Admin")
    });

  }

//open add lock model here and ask input from user and when model close pass lock type data back to page to decide 
//to show further range block and passage mode block 
  assignLock(){


  }

  currentLock :{};
  DefaultLockValue:any; //passed here ID 

locks = [
    {
      id: 1,
      name: 'Rim Lock',
      type: 'rimlock',
    },
    {
      id: 2,
      name: 'Solenoid Lock',
      type: 'rimlock',
    },
    {
      id: 3,
      name: 'Motorised Lock',
      type: 'motor',
    },
    {
      id: 4,
      name: 'EM Lock',
      type: 'em',
    },
    {
      id: 5,
      name:'Drop Bolt Lock',
      type: 'em',
    },
    {
      id: 6,
      name: 'Glass Door Bolt Lock',
      type: 'em',
    },
    
  ];

  compareWithlock(o1, o2) {
    return  o1 === o2;
  }

  

  selecthandleChangelock(ev) {
    console.log("this.currentLock",this.currentLock);
    this.currentLock = ev.target.value;
    console.log("this ev.target.value ****",ev.target.value);
    // this.DefaultLockValue = ev.target.value;
    console.log(ev.target.value);
    this.lock_type = this.currentLock; // this is changing defalt GYM ID for admin app as _gym_id is useed as gymID in local storage 
    console.log("this Default Lock Value  *****",this.DefaultLockValue);
    this.updateLockDetails(ev.target.value);
    this.showPassageMode(this.lock_type);
    this.compareWithlock(this.lock_type,ev.target.value);

     
// this.getMembers();
  }

  updateLockDetails(lockType){
    console.log("******in Update Lock Details function by lock id******",lockType);  
    switch(+lockType){ // convert strig to number as case is number type
      case 1:        
          this.lockApi.update(this.lock_id_db,{
            "lock_type":{
                          "id":"1",
                          "type":"rimlock",
                          "name":"Rim Lock"
                        },
            "lock_closing_delay":"1",
            "lock_passage_mode":false,
           }
          ).subscribe(res=>{console.log(res)});  
          this.showPassage = false;
          this.showOpeningRange =false;     
        
        break;
      case 2:
        
          this.lockApi.update(this.lock_id_db,{"lock_type":{
            "id":"2",
            "type":"rimlock",
            "name":"Motorised Lock"
          }}).subscribe(res=>{console.log(res)});
          this.showPassage = false;
      this.showOpeningRange =false;
        
        break;
      case 3:
        
          this.lockApi.update(this.lock_id_db,{"lock_type":{
            "id":"3",
            "type":"motorisedlock",
            "name":"Motorised Lock"
          }}).subscribe(res=>{console.log(res)});
          this.showPassage = true;
          this.showOpeningRange = false;
      
        break;
      case 4:
        
          this.lockApi.update(this.lock_id_db,{"lock_type":{
            "id":"4",
            "type":"em",
            "name":"EM Lock"
          }}).subscribe(res=>{console.log(res)});
          this.showPassage = true;
      this.showOpeningRange = true;
        
        break;
      case 5:
      
          this.lockApi.update(this.lock_id_db,{"lock_type":{
            "id":"5",
            "type":"em",
            "name":"Drop Bolt Lock"
          }}).subscribe(res=>{console.log(res)});
          this.showPassage = true;
          this.showOpeningRange = true;
        break;
      case 6:
        
          this.lockApi.update(this.lock_id_db,{"lock_type":{
            "id":"6",
            "type":"em",
            "name":"Glass Door Lock"
          }}).subscribe(res=>{console.log(res)});
          this.showPassage = true;
          this.showOpeningRange = true;
        }
      
   
  }

  
  showPassage:boolean = false;
  showOpeningRange:boolean=false;
  showLockSelection:boolean = false;
  showAssignLock:boolean = true;
  showLockRelayId:boolean = false;

  // if this lock ID is = 1 or 2 then hide closing delay , hide passage mode .
  // tif this lock id is = 4 5 6  then show closing delay and show paasage mode

  moveStart: RangeValue;
  moveEnd: RangeValue;

  onIonKnobMoveStart(ev: Event) {
    this.moveStart = (ev as RangeCustomEvent).detail.value;
    // this.moveStart = this.closingDelay;
    console.log("start knob ",ev);
    //how to start pointer from desired result ?
  }

   pinFormatter(value: number) {
    return `${value} Second`;
  }

  onIonKnobMoveEnd(ev: Event) {
    this.moveEnd = (ev as RangeCustomEvent).detail.value;
    console.log("end knob ",this.moveEnd);
    console.log("this Lock Id ===",this.lock_id_db);
    this.lockApi.update(this.lock_id_db,{"lock_closing_delay":this.moveEnd}).subscribe(res=>{console.log(res)});
  }

  showPassageMode(locktype){
    console.log("lock type in show passage mode function",locktype);
    if((locktype == 1) || (locktype == 2)){
      this.showPassage = false;
      this.showOpeningRange =false;
      console.log("this.showPassage",this.showPassage);
      return;
    }else if((locktype == 4 )|| (locktype == 5) || (locktype ==6)){
      if(this.isToggled){
        this.showOpeningRange = false;
        this.showPassage = true;
        return;
      }else{
      this.showPassage = true;
      this.showOpeningRange = true;
      this.isToggled=false;
      console.log("this .show passage in 4 5 6",this.showPassage);
      return;}
    } else if(locktype == 3 ){
      this.showPassage = true;
      this.showOpeningRange = false;
    }
  }

  showRangeValue(pass_mode){
    if(pass_mode = true){
      this.showOpeningRange = false;
    }else{
      this.showOpeningRange = true;
      this.lockApi.getLockByGymId(this._gym_id).subscribe(res=>{
        this.closingDelay = res.lock_closing_delay;
      });
    }

  }

  public isToggled: boolean ;
  notifyAndUpdateIsToggled(event){
    // console.log("Toggled: "+ this.isToggled,"Passage Mode is ..", event);
    this.lockApi.update(this.lock_id_db,{"lock_passage_mode":event}).subscribe(res=>{
      console.log(res);
      if(res.lock_passage_mode == true){
        if(this.showOpeningRange){
        this.showOpeningRange = false;}
      }else {
        if(this.lock_id == 3){
          this.showOpeningRange = false;
        }else{
        this.showOpeningRange = !event;}
        // console.log("🚀 ~ file: addlock.page.ts:153 ~ AddlockPage ~ toggleButton ~ el̥se:",(this.showOpeningRange && this.showPassage));
        }
       
      });    

  }

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  lockRelayId: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.lockRelayId, 'confirm');
    // console.log("value after lock data to db confirm add",this.lockForm.valid);
    // console.log("gym name",this.gym_name_forLock);
    // console.log("gym id",this._gym_id);
    // console.log("this lock type",this.lock_type.type);
    // console.log("lock relay id",this.lockRelayId);
    // console.log(this.lockForm.getRawValue());
    this.ifLockIsThere(this._gym_id);
    this.showAssignLock = false;
  }

  mainLockForm(){
      this.lockForm = this.fb.group({
      gym_id: [this._gym_id, Validators.required],
      gym_name: [this.gym_name_forLock,Validators.required],
      lock_type: [this.lock_type,[ Validators.required]],
      lock_closing_delay: ['1',[Validators.required, ]],
      lock_passage_mode: [false], 
      lock_relayId: ['',Validators.required],  
    })
    
  }


  //if lock already added then show default lock name , and accordingly range and passage mode
  ifLockIsThere(gymid){
    this.lockApi.getLockByGymId(gymid).subscribe({
      next:res=>{
        console.log(res.lock_type);
        this.lockRelayId = res.lock_relayId;
        this.res_lock_type = res.lock_type;
            console.log(this.res_lock_type.id);
            this.DefaultLockValue = this.res_lock_type.id;
      },
      error:err=>{
        console.log(err); 
        // .error.message.includes("no data retrieved with this gym id");
        if(err.status === 500){                  
        this.lockApi.addLock(this.lockForm.value).subscribe(
          {
              next:(res)=>{
                  console.log(res.lock_type);
                  this.lock_id_db = res._id; // use this lock id db to update relay value update bloack 
                  this.res_lock_type = res.lock_type;
                  this.lockRelayId = res.lock_relayId;
                  console.log(this.res_lock_type.id);
                  this.DefaultLockValue = this.res_lock_type.id;
                    // this.currentLock = res.lock_type;
                    this.showAssignLock = false;
                    this.showLockSelection = true;                    
                    // add this ID to gym DB lock ID
                    this.gymApi.update(this._gym_id,{"gym_lockId":res._id}).subscribe((res)=>{
                      // show toast sussefully lock ID updated
                      console.log("gyms gym lock id update by lock _id",res);
                      this.showLockRelayId = true; // means relay ID update to Gym ID
                    })
              },
              error:(error)=>{
                  console.log(error);
                          },
        }
        );
        }
      
      }
      
    });

  }

  onFormSubmit() {
    // const Id = localStorage.getItem('ID')    
    console.log("in form submit");
    // let idux = this.id||this.route.snapshot.paramMap.get('id')||this.idun;
    // console.log(idux , this.id, this.idun);
    // this.lockApi.update(id, this.lockForm.value).subscribe((res: any) => {
    //       this.idu = res._id;
    //     this.modalCtrl.dismiss();
    //   }, (err: any) => {
    //     console.log(err);
        
    //   }
    //   );
     
  }

  getLock(gymId){
    this.lockApi.getLockByGymId(gymId).subscribe({
      next:res=>{
        this.lockForm.patchValue({
          lock_type: res.lock_type,
          lock_closing_delay:res.lock_closing_delay,
          lock_passage_mode: res.lock_passage_mode, 
          lock_relayId:res.lock_relayId,          
        })

      },
      error:err=>{
        console.log("Get Lock in patch block when no data found",err);
       
      }
    })
  }


  async attendanceIsToggled(event){
    if(event){
      this.isAttendanceOn = event;
    }

    this.gymApi.update(this._gym_id,{"gym_attendance":event}).subscribe({
      next:res=>{
        this.isAttendanceOn = event;
      },
      error:err=>{}
    });

    let CurrentDate = new Date().toISOString();
    const DateNow = CurrentDate.split(".");
    let TimeNow = DateNow[0];

    let shift={ //dumyshift added firsttime
      "shiftname":this.gym_name_forLock,
      "gymid":this._gym_id,
      "gym_name":this.gym_name_forLock,
      "shift_start_time": TimeNow,
      "shift_end_time": TimeNow,
      "repeat":true,
      "working_days":[{
        "day_number":0,
        "punchIn":TimeNow,
        "punchOut":TimeNow
        },
        {
        "day_number":1,
        "punchIn":TimeNow,
        "punchOut":TimeNow
        },
        {
          "day_number":2,
          "punchIn":TimeNow,
          "punchOut":"1970-01-01T02:30:00"
          },
          {
            "day_number":3,
            "punchIn":TimeNow,
            "punchOut":TimeNow
            },{
              "day_number":4,
              "punchIn":TimeNow,
              "punchOut":TimeNow
              },{
                "day_number":5,
                "punchIn":TimeNow,
                "punchOut":TimeNow
                },{
                  "day_number":6,
                  "punchIn":TimeNow,
                  "punchOut":TimeNow
                  },
      ]
    }
    if(event){
       this.isAttendanceOn = true;
    this.attendApi.addShift(shift).subscribe({
      next:res=>{
        console.log(res._id);
        this.gym_attendance_id = res._id; // after trigger page wont load again so that we have to force this id here 
        this.gymApi.update(this._gym_id,{"gym_attendance_id":res._id}).subscribe({
          next:data=>{
            console.log(data);
          },
          error:err=>{},
        });
      },
      error:err=>{},
    })
  }else{
    this.attendApi.deleteHolidaylist({_id:this.gym_attendance_id,gymid:this._gym_id}).subscribe({
      next:res=>{
        console.log(res);
        this.gymApi.update(this._gym_id,{"gym_attendance_id":""}).subscribe({
          next:res=>{
            console.log(res);
          }
        });
      }
    });

    
  }

  }

  async OpenAttendance(){
      this.router.navigate(['/attendances/',this.gym_attendance_id]);
  }


  async holidayIsToggled(event){

    // set Alert "Do You Really Want to Delete Holiday List"
    // if click Yes then Only Proceed below code .. use flage boolean 
    if(event){
      this.isHolidayOn = event;
      this.getGym(this._gym_id);
    }
// set if holiday list is there or not
    this.gymApi.update(this._gym_id,{"gym_isHoldaylistadded":event}).subscribe({
      next:res=>{
        this.isHolidayOn = event;
      },
      error:err=>{}
    });

   
    let holidaylist={ //dumylist added firsttime
      "holidaylistname":this.gym_name_forLock,
      "gymid":this._gym_id,
      "gym_name":this.gym_name_forLock,
    }
    if(event){
       this.isHolidayOn = true;

    this.holidayApi.addlistName(holidaylist).subscribe({
      next:res=>{
        console.log(res._id);
        this.gym_holidaylist_id = res._id; // after trigger page wont load again so that we have to force this id here 
        this.gymApi.update(this._gym_id,{"gym_holiday_id":res._id}).subscribe({ // updat holiday list id to main gym
          next:data=>{
            console.log(data);
            this.gym_holidaylist_id = data._id;
          },
          error:err=>{},
        });
      },
      error:err=>{},
    })
  }else{
    this.holidayApi.deleteHolidaylist({_id:this.gym_holidaylist_id,gymid:this._gym_id}).subscribe({
      next:res=>{
        console.log(res);
        this.gymApi.update(this._gym_id,{"gym_holiday_id":""}).subscribe({
          next:res=>{
            console.log(res);
          }
        });
      }
    });    
  }
  }

  async OpenHoliday(){
    console.log(this.gym_holidaylist_id);
    this.router.navigate(['/holidays/',this.gym_holidaylist_id]);
    // this.router.navigate(['/attendances/',this.gym_attendance_id]);
  }

  async Openlog(){
    this.router.navigate(['/logs/']);
    // this.router.navigate(['/attendances/',this.gym_attendance_id]);
  }


}
