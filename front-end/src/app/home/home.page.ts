import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
// to check if logged user is admin or member or none
import { UserService } from '../services/user.service';



import{ Router} from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';

import { PushNotifications } from '@capacitor/push-notifications';

//to get current location Lattitude and Longitude
import { Geolocation } from '@capacitor/geolocation';

import { GmapsService } from '../services/gmaps/gmaps.service';

// for invitaion accept check call m control service
import{McontrolService} from '../services/mcontrol.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';

//to make member as admin or member by setting isMembertype as True from false;
// To make sure if GYM already added by user then neviagte to gym list page
import {GymService} from './../services/gym.service';

import { MemberserviceService } from '../services/memberservice.service';

import { App } from '@capacitor/app';
import { environment } from 'src/environments/environment';
//call gym gym Admin service
import { GymadminService } from '../services/gymadmin.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  appInfo:any;
  keys:string[] = [];

  ////google map///
  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  googleMaps: any;
  center = { lat: 28.649944693035188, lng: 77.23961776224988 };
  map: any;
  mapClickListener: any;
  markerClickListener: any;
  markers: any[] = [];
  /////// google map//////

  username:string='';

  serviceProviders: any; // serviceprovider means admin as he is providing service to members.
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  // usersUrl:string='http://localhost:3000/api/v1/users';// URL at postman from where all user are fetched
  userUrl:string= environment.SERVER+'/users';
  originalserviceProvider:any;
  selectedService:any;
  var_code:any;
  _id :string; // This is an observable

  //logged user email and get invitaion code
  loggeduserEmail:any;
  loggedUserName:any;
  invitationCode:any;
  loggeduserId:any;

  userForm!: FormGroup;
  isloggedUserMember: boolean;
  loggeduserIsAdmin: boolean;
  userProfileImage: string;

  constructor(
    private router:Router,
    private http:HttpClient,
    private userApi:UserService,
    private alertCtrl: AlertController,
    public gymApi:GymService,
    /////google map///
    private gmaps: GmapsService,
    private mcontrol_s: McontrolService,
    private renderer: Renderer2,
    private actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    public memberApi:MemberserviceService,  
    //gym admin service api
    private gymAdminApi :GymadminService, 
    //use storage service instead of get set
    private storageService :StorageService, // storage service is used insted of get set method
  ) {

    this.userProfileImage = localStorage.getItem('ProfileImageUrl');
      console.log(this.userProfileImage);
  // for app version 
 
  App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
    });
    
    App.addListener('appUrlOpen', data => {
      console.log('App opened with URL:', data);
    });
    
    App.addListener('appRestoredResult', data => {
      console.log('Restored state:', data);
    });
    
    const checkAppLaunchUrl = async () => {
      const { url } = await App.getLaunchUrl();
    
      console.log('App opened with URL: ' + url);
    };
    ///****//// */
     const user = localStorage.getItem('User')
     console.log(JSON.parse(user!).email );
     console.log(JSON.parse(user!)._id);

      // to know the status of logged user if he is member or admin      
      this.loggeduser=JSON.parse(user);
      this.loggeduserEmail = this.loggeduser.email;
      this.loggedUserName = this.loggeduser.username
      this.userApi.getUserbyEmail(this.loggeduserEmail).subscribe(
        (res) => {
          console.log(res);
          this.isloggedUserMember = res.isMember;
          this.loggeduserIsAdmin = res.isAdmin;
          console.log(this.isloggedUserMember);
          
          //if same user is member and admin set true then display alert , want to proceed as member or owner ?
          //based on that route the page 
          if(this.isloggedUserMember && this.loggeduserIsAdmin){
            this.ProceedAsMemberOwnerAlert("Proceed as ..","select ");
          }

          if(this.isloggedUserMember){
            console.log('Logged User is Member');
            this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe({
              next:res=>{
                if(!res){
                  this.router.navigateByUrl('home', {replaceUrl: true}); // if no member found of this id then route to home page
                }else{
                  if(res.isInviteAccepted ==="Yes"){
                    this.router.navigateByUrl('/tabs/member-action', {replaceUrl: true});
                  }else{
                    this.router.navigateByUrl('home', {replaceUrl: true}); // if member have not accepted invitaion yet let him be stay at home page
                               }
                  
                }
              }
            });
            // this.router.navigateByUrl('/tabs/member-action', {replaceUrl: true});
          } else{
          if(this.loggeduserIsAdmin){
            console.log('Logged User is Admin');
            this.router.navigateByUrl('/gym-list', {replaceUrl: true,});
            } else{
            //he may be member or may be first time user only 
            // so let him decide the roll of him self
            console.log('No gym Add by this persom Gym Please');
            this.loggedUserRoleaAlert(
                      'Welcome to QR-Unlock',
                      "let's start by ."
                    );
                }
          }
        
        },
        (error) => {
          console.log(error);
        }
      );
       
     
      console.log(App.getInfo() );
  
  }

    // addName(data:any){
    //   this.username = data.username;
    //   console.log(this.username);
    // }

logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

  // here if logged user click on Add Gym he become Admin 
  // if logged user click on Join Gym he become Member
  handleChange(e,) {
    this.pushLog('ionChange fired with value: ' + e.detail.value);
    console.log(this.loggeduser._id);
    if(e.detail.value=="add"){
      console.log(e.detail.value); 
      localStorage.setItem('loggedUserId',this.loggeduser._id);
      console.log(this.loggeduser._id);
      this.router.navigate(['/gym-add'],{replaceUrl:true});

    }else if (e.detail.value=="join") {
      console.log(e.detail.value) ;
      this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((data)=>{
        console.log(data);
        if(!data){
          console.log("no member");
          this.presentAlert("Property Not Joined Yet !!","Please Ask Property Owner to Invite to Join","")
        }else{
          this.checkIfInvited(this.loggeduserEmail);
        }
      });
      // this.checkIfInvited(this.loggeduserEmail);
      // this.joinGymAlert();
     }
  }
  
  ngOnInit(): void {
  //  to make sure only user can see this page by login so this is done 
    const user = localStorage.getItem('User')
   // this.addName(user);
    // console.log(user); // here user info is being display after login successfull
    this.loggeduser=user;
    // console.log(this._id);
    if(user==null){
      this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
    }else{
      console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
      this.loggeduser=JSON.parse(user!);
      //here we get email of logged user , we will use this email to check if its same as invitaion was sent
      console.log(this.loggeduser.email); // convert back user info into object so that we can use this info
      this.loggeduserEmail=this.loggeduser.email;
      // this.getUsercontrol(this.loggeduser.email);

      this.loggeduserId=this.loggeduser._id;
      console.log(JSON.parse(user!)._id); // convert back user info into object so that we can use this info


    }
      
    }
    // 
    
    logout(){
      this.userApi.deleteToken();
      this.router.navigate(['/login'],{replaceUrl:true});
    }

  // for member join gym alert to get verification code 
  async joinGymAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Please enter Verification Code',
      buttons: [
                {
                  text: 'Ok',
                  handler: (alertData) => { //takes the data 
                      const var_code= alertData.code_entered;
                      console.log(var_code);
                      // call mcontrol service 
                      console.log(this.loggeduserEmail);
                       this.mcontrol_s.getMcontrolEmail(this.loggeduserEmail).subscribe((data)=>{
                        this.invitationCode = data.inviteCode;
                        if(var_code === this.invitationCode){
                          this.memberApi.getMember(data._id).subscribe((res)=>{
                            this.gymApi.getGym(res.gym_id).subscribe((gym)=>{
                              this.storageService.store('joinedGymList',gym);
                            });
                            
                          });
                          console.log("code matched");
                          this.router.navigateByUrl('/tabs/member-action',{replaceUrl:true}); 
                          this.updateUserToMember();
                          this.updateMemberInvitedAccepted(this.loggeduserEmail,"Yes",data._id);
                          //delete mcontrol_s code as its purpose is solved
                        }
                       });            

                  }
              },
           
            ],
      inputs: [
        {
          name:'code_entered',
          placeholder: 'Verificaion Code',
          attributes: {
                        maxlength: 6,
                      },
        },
      ],
    });

    await alert.present();
  }

  checkIfInvited(email:any){
    console.log(email);
    this.memberApi.getMemberByEmail(email).subscribe((data: any)=>{
      console.log("in Check if Invited");
      console.log(data);
      // here try to check if member email exist or not .. if member email is not there then 
      //show alert that you have strill not asscooaited to any gym
      try {
         
        if(data.isInviteAccepted=="Not")
        {
          console.log("Please ask respective property owner to invite you to join property"); 
          this.presentAlert("Property Not Joined","Please ask property owner to Invite to Join property","")
        }
        if(data.isInviteAccepted=="pending")
        {
          console.log("Please Enter Invitaion Code"); 
          this.joinGymAlert();
        }
        if(data.isInviteAccepted=="Yes")
        {
          this.router.navigateByUrl('/tabs/member-action',{replaceUrl:true}); 
         }

      } catch (error) {
        throw error;
      }
    });

  }

  async updateUserToMember(){
    this.userApi.update(this.loggeduserId,{"isMember":true}).subscribe(
    {
    next:(res:any)=>{
      console.log("in update ",res._id);
    },
    error:(err: any) => {
      console.log(err);
    }
    }
  );
  }

  async updateMemberInvitedAccepted(email:any,Yes:any, MControlId:any)
  {
    console.log("in invitaion code setup")
    this.memberApi.getMemberByEmail(email).subscribe((data: any)=>{
    this.memberApi.update(data._id,{
      "isInviteAccepted":Yes // Status Change to Yes
    }).subscribe({
      next: (res: any) => {
      const id = res._id;
      console.log('invitaion type change to Yes');
      this.deletInvitationCodeData(MControlId); //delet code once updated invitation accepted is updated
    }, 
    error:(err: any) => { console.log(err)  }
    });

      });    
  }

  //delet invitiation code detail once member status is updated to accepted .
  async deletInvitationCodeData(id){
    this.mcontrol_s.delete(id).subscribe((res)=>{
        console.log(res); 
    })
  }

  async presentAlert(header:string,subheader:string, message:string) {
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header:header,
      subHeader: subheader,
      message:message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async loggedUserRoleaAlert(header:string,message:string) {
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header:header,
      // backdropDismiss: false,
      message:message,
      buttons: [       
        {
          text: 'Join Property',
          role: 'member',
          handler: () => {  
            this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((data)=>{
              console.log(data);
              if(!data){
                console.log("no member");
                this.presentAlert("Property Not Joined Yet !!","Please Ask Property Owner to Invite to Join Property","")
              }else{
                this.checkIfInvited(this.loggeduserEmail);
              }
            });
          }
        },
        {
          text: 'Add Property',
          role: 'admin',
          handler: () => { localStorage.setItem('loggedUserId',this.loggeduser._id);
                           console.log(this.loggeduser._id);
                          this.router.navigate(['/gym-add'],{replaceUrl:true});
                        }
        },
      ]
    });
    await alert.present();
  }

  getUsercontrol(_Email:any) {
  //   this.userApi.getUserbyEmail(_Email).subscribe((data: any) => {
  //      console.log('Ismember=',data);
  //       this.userForm.patchValue({
  //         isMember:data.isMember,
  //     });
  //   });
  };

  addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });
  
    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });
  
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
  
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }
  
  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
  
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
  
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
  
    await PushNotifications.register();
  }
  
  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }



  // to fetch member location
current_lat:any
current_long:any
async fetchLocation(){
  const _geoLocation = Geolocation.getCurrentPosition();
  console.log('current location =', _geoLocation);
  const coordinates = await Geolocation.getCurrentPosition();    
  console.log('Current position:--', coordinates.coords.latitude,coordinates.coords.longitude);
  this.current_lat=coordinates.coords.latitude;
  this.current_long=coordinates.coords.longitude;
  localStorage.setItem('current_lat',this.current_lat);
  localStorage.setItem('current_long',this.current_long);
}

  //////////////google map///////////////////////
  ngAfterViewInit() {
    this.loadMap();
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 12,
      });
      this.renderer.addClass(mapEl, 'visible'); /// this making to show map here we can put some condition to show or not the map
      this.addMarker(location);
      this.onMapClick();
    } catch(e) {
      console.log(e);
    }
  }

  onMapClick() {
    this.mapClickListener = this.googleMaps.event.addListener(this.map, "click", (mapsMouseEvent) => {
      console.log(mapsMouseEvent.latLng.toJSON());
      this.addMarker(mapsMouseEvent.latLng);
    });
  }

  addMarker(location) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'fotos/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50), 
    };
    const marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: true, // it its true marker can be drag and drop
      // dragging: true,
      animation: googleMaps.Animation.DROP
    });
    console.log(marker.position.lat());
    console.log(marker.position.lng());
    this.markers.push(marker);
    console.log('markers: ', this.markers);
    // this.presentActionSheet();
    this.markerClickListener = this.googleMaps.event.addListener(marker, 'click', () => {
      console.log('markerclick', marker);
      
      this.checkAndRemoveMarker(marker);
      console.log('markers: ', this.markers);
    });
  }

  checkAndRemoveMarker(marker) {
    const index = this.markers.findIndex(x => x.position.lat() == marker.position.lat() && x.position.lng() == marker.position.lng());
    console.log('is marker already: ', index);
    if(index >= 0) {
      this.markers[index].setMap(null); // just to remove image of marker so that map is clear so set map null
      this.markers.splice(index, 1); // this to remove marker position from array we can use latest array position
      console.log(index);
      return;
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Added Marker',
      subHeader: '',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Save',
          data: {
            action: 'share',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  ngOnDestroy() {
    // this.googleMaps.event.removeAllListeners();
    if(this.mapClickListener) this.googleMaps.event.removeListener(this.mapClickListener);
    if(this.markerClickListener) this.googleMaps.event.removeListener(this.markerClickListener);
  }

  // alert to proceed as meber or owner ..
  async ProceedAsMemberOwnerAlert(header:string,message:string) {
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header:header,
      // backdropDismiss: false,
      message:message,
      buttons: [       
        {
          text: 'Member',
          role: 'member',
          handler: () => {  
            this.memberApi.getMemberByEmail(this.loggeduserEmail).subscribe((data)=>{
              console.log(data);
              if(!data){
                console.log("no member");
                this.presentAlert("Property Not Joined Yet !!","Please Ask Property Owner to Invite to Join ","")
              }else{
                this.checkIfInvited(this.loggeduserEmail);
              }
            });
          }
        },
        {
          text: 'Owner',
          role: 'admin',
          handler: () => { localStorage.setItem('loggedUserId',this.loggeduser._id);
                           console.log(this.loggeduser._id);
                           //check here if user already added gym using gym admin table then redirect to
                           //member list page of that gym or gymlist page
                           this.gymAdminApi.getGymadminByEmail(this.loggeduserEmail).subscribe((res)=>{
                            if([res].length >= 0 ){
                              this.router.navigate(['/gym-list'],{replaceUrl:true});
                            }
                           });

                          this.router.navigate(['/gym-add'],{replaceUrl:true});
                        }
        },
      ]
    });
    await alert.present();
  }


  }


