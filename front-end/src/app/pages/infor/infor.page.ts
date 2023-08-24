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
  lock_type: any;

  

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
  ) {
    this.storageService.get('loggeduser_id').then((val) => {
      console.log(val);
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
      console.log(this.gymsResult);
      this.gyms = this.gymsResult;
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
    this.mainLockForm();

    this.compareWith = this.compareWithFn;
  }

  ionViewWillEnter() {
    console.log("infor page ion view will enter");
    this.getMembersData();
    // this.mainLockForm();
    this.lockApi.getLocksByGymId(this._gym_id).subscribe((res)=>{
      console.log(res);
    })
  }

  logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

  selecthandleChange(ev) {
    this.currentGym = ev.target.value;
    this.MyDefaultGymValue = ev.target.value;
    // console.log(this.currentGym);
    this._gym_id = this.currentGym;
    // console.log(this._gym_id);
    this.getMembersData();
    this.compareWithFn(this._gym_id, ev.target.value);
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
        console.log(this._gym_id);
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
        console.log(data);
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
    this.lockIDinputAlert(this._gym_id);
    this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
  }

  // alert controller for Lock ID input
  async lockIDinputAlert(gymid: any) {
    const alert = await this.alertCtrl.create({
      header: 'Enter New Lock ID',
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
            this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
          },
        },
        {
          text: 'Ok',
          handler: (alertData) => {
            //takes the data
            // let validateObj = this.validateEmail(data);
            if (!alertData.lock_id) {
              this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
              return;
            } else {
              // console.log(alertData.lock_id);
              this.gymApi
                .update(gymid, { gym_lockId: alertData.lock_id })
                .subscribe((data) => {
                  console.log('Lock Id Updated as', data.gym_lockId);
                });
            }
            this.lockIDtoggleTrigger = !this.lockIDtoggleTrigger;
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

  currentLock :undefined;
  DefaultLockValue:any = 1; //passed here ID 

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
    this.currentLock = ev.target.value;
    console.log("this current lock ****",this.currentLock);
    // this.DefaultLockValue = ev.target.value;
    console.log(ev.target.value);
    this.lock_type = this.currentLock; // this is changing defalt GYM ID for admin app as _gym_id is useed as gymID in local storage 
    console.log("this lock_id *****",this.lock_type.type);
    this.updateLockDetails(this.lock_type);
    this.showPassageMode(this.lock_type.id);

     
// this.getMembers();
  }

  updateLockDetails(lockType){
    this.lockApi.getLockByRelayId(this.lockRelayId).subscribe(res=>{
      this.lockApi.update(res._id,{"lock_type":{
        "id":lockType.id,
        "type":lockType.type,
        "name":lockType.name
      }})
    });
  }

  
  showPassage:boolean = false;
  showOpeningRange:boolean=false;
  showLockSelection:boolean = false;

  // if this lock ID is = 1 or 2 then hide closing delay , hide passage mode .
  // tif this lock id is = 4 5 6  then show closing delay and show paasage mode

  moveStart: RangeValue;
  moveEnd: RangeValue;

  onIonKnobMoveStart(ev: Event) {
    this.moveStart = (ev as RangeCustomEvent).detail.value;
    console.log("start knob ",ev);
  }

   pinFormatter(value: number) {
    return `${value} Second`;
  }

  onIonKnobMoveEnd(ev: Event) {
    this.moveEnd = (ev as RangeCustomEvent).detail.value;
    console.log("end knob ",ev);
  }

  showPassageMode(locktype){
    console.log("lock type in show passage mode function",locktype);
    if((locktype == 1) || (locktype == 2)){
      this.showPassage = false;
      this.showOpeningRange =false;
      console.log("this.showPassage",this.showPassage);
    }else if((locktype == 4 )|| (locktype == 5) || (locktype ==6)){
      this.showPassage = true;
      this.showOpeningRange = true;
      console.log("this .show passage in 4 5 6",this.showPassage);
    } else if(locktype == 3 ){
      this.showPassage = true;
      this.showOpeningRange = false;
    }
  }

  public isToggled: boolean;
  notifyAndUpdateIsToggled(event){
    console.log("Toggled: "+ this.isToggled,"Passage Mode is ..", event); 
    if(event == true){
      if(this.showOpeningRange){
      this.showOpeningRange = false;}

      // this.showOpeningRange = !event;
      // console.log((this.showPassage));
    }else {
      if(this.lock_id == 3){
        this.showOpeningRange = false;
      }else{
      this.showOpeningRange = !event;}
      // console.log("🚀 ~ file: addlock.page.ts:153 ~ AddlockPage ~ toggleButton ~ el̥se:",(this.showOpeningRange && this.showPassage));

    }

  }

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  lockRelayId: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.lockRelayId, 'confirm');
    // console.log("value after lock data to db confirm add",this.lockForm.valid);
    console.log("gym name",this.gym_name_forLock);
    console.log("gym id",this._gym_id);
    // console.log("this lock type",this.lock_type.type);
    console.log("lock relay id",this.lockRelayId);
    // console.log(this.lockForm.getRawValue());

    this.lockApi.addLock({
        "gym_id":this._gym_id,
        "gym_name":this.gym_name_forLock,
        "lock_type":{"id":"1","type":"rimlock","name":"Rim Lock"},
        "lock_closing_delay":"1",
        "lock_passage_mode":false,
        "lock_relayId":this.lockRelayId    
    }).subscribe(
      {
      next:(res)=>{
              console.log(res);
            this.DefaultLockValue = res.lock_type;
            this.showLockSelection = true;
          },
    error:(error)=>{
      console.log(error);
    },
    }
    );
  }

  mainLockForm(){
    this.gymApi.getGym(this._gym_id).subscribe(res=>{
      this.gym_name_forLock = res.gym_name;
    })
      this.lockForm = this.fb.group({
      gym_id: [this._gym_id, Validators.required],
      gym_name: [this.gym_name_forLock,Validators.required],
      lock_type: [this.lock_type.type,[ Validators.required]],
      lock_closing_delay: ['1',[Validators.required, ]],
      lock_passage_mode: [false], 
      lock_relayId:[this.lockRelayId,Validators.required],  
    })
    
  }


}
