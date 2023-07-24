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

import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { GymDetailsPage } from '../gym-details/gym-details.page';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.page.html',
  styleUrls: ['./infor.page.scss'],
})
export class InforPage implements OnInit {
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
    public loadingController: LoadingController
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

    this.compareWith = this.compareWithFn;
  }

  ionViewWillEnter() {}

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

    await this.memberApi
      .getMemberType(this._gym_id, 'free')
      .subscribe((data) => {
        console.log(this._gym_id);
        this.freeMemberResults = data;
        this.freeMembers = this.freeMemberResults.length;
        loading.dismiss();
      });

    await this.memberApi
      .getMemberType(this._gym_id, 'paid')
      .subscribe((data) => {
        this.paidMemberResults = data;
        this.paidMembers = this.paidMemberResults.length;
        this.totalMembers = this.freeMembers + this.paidMembers;
        console.log(data);
        loading.dismiss();
      });

    await this.memberApi
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
              if (data.length === 1 || data.length < 1) {
                this.gymApi.delete(this._gym_id).subscribe({
                  next: (res: any) => { this.router.navigate(['/gym-list/']), { replaceurl: true }; },
                  error: (err: any) => { alert(JSON.stringify(err));  },
                  complete:()=>{
                    return;
                  }
                  
                });
              }else{
                this.gymApi.delete(this._gym_id).subscribe({
                  next: (res) => {
                    console.log(res);
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
}
