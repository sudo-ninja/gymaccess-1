import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { UserService } from '../services/user.service';

import{ Router} from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';

import { PushNotifications } from '@capacitor/push-notifications';
import { GmapsService } from '../services/gmaps/gmaps.service';

// for invitaion accept check call m control service
import{McontrolService} from '../services/mcontrol.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';

//to make member as admin or member by setting isMembertype as True from false;
// To make sure if GYM already added by user then neviagte to gym list page
import {GymService} from './../services/gym.service';
import { MemberserviceService } from '../services/memberservice.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

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
  usersUrl:string='http://localhost:3000/users';// URL at postman from where all user are fetched
  originalserviceProvider:any;
  selectedService:any;
  var_code:any;
  _id :string; // This is an observable

  //logged user email and get invitaion code
  loggeduserEmail:any;
  invitationCode:any;
  loggeduserId:any;

  userForm!: FormGroup;

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
    

  ) {
    this.userApi.user().subscribe(
      res=>{
        // this.addName(res),
        console.log(res);
      },
      error=>{
        // this.router.navigate(['/login'])
        console.log(error)
      }
     )
     const user = localStorage.getItem('User')
     console.log(JSON.parse(user!).isMember);
     console.log(JSON.parse(user!).username );
     console.log(JSON.parse(user!)._id);
      if(JSON.parse(user!).isMember)
      {           
      this.router.navigateByUrl('/tabs/member-action',{replaceUrl:true});    
      }
      else
      {
      this.gymApi.wildSearch(JSON.parse(user!)._id).subscribe((res:any)=>{
        try {
          console.log(res.length);
          if(res.length<1)
          {
            console.log("No gym Add Gym Please")
            this.presentAlert("You Are Not Gym Owner!!","You Are not Member of Any Gym","If you Want to Add Gym then click on My GYM to Add Gym or Please Ask Gym Owner to Invite you to Join Gym")
          }
          else
          {
            this.router.navigateByUrl('/gym-list',{replaceUrl:true});
          }
        } catch (error) {
          throw error;
        }
      });
  }
  
  }

    addName(data:any){
      this.username = data.username;
      console.log(this.username);
    }

logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

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
      this.checkIfInvited(this.loggeduserEmail);
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

      //here check if logged user is member then switch direct to member action page 
      // if logged user is not member then direct to gym list page .
      if(this.loggeduser.isMembertype===true){
        console.log("User Is Member as member Type True ");
        this.router.navigateByUrl('/member-action',{replaceUrl:true}); 
        localStorage.setItem('User',JSON.stringify(this.loggeduser));
      }

      

      //once member leave gym he has to again enter invitaion code as his status for member will be false, 
      //if admin leave the gym then check if there is any other admin or not , if admin is there then only allow 
      // to leave him gym 
      this.username=this.loggeduser.username;
       console.warn(this.loggeduserEmail);
      this.http.get(this.usersUrl).subscribe(res=>{
        console.log(res)
        this.serviceProviders=res;
        this.originalserviceProvider=res;
      },error=>{
        console.log(error)});
    }
      
    }
    // 
    
    logout(){
      this.userApi.logout()
      .subscribe(
        data=>{console.log(data);this.router.navigate(['/login'])},
        error=>console.error(error)
      )
    }
// onServiceSelected(e){
//   this.serviceProviders=this.originalserviceProvider;
//   this.selectedService=e.detail.value;
//   this.serviceProviders=this.serviceProviders.filter(serviceProve=>{
//     return serviceProve.service==this.selectedService
//   })
// }

  // join gym alert to get verification code 
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
                          console.log("code matched");
                          this.router.navigateByUrl('/member-action',{replaceUrl:true}); 
                          this.updateUserToMember();
                          this.updateMemberInvitedAccepted(this.loggeduserEmail,"Yes");
                          // this.userApi.getUserbyEmail(this.loggeduserEmail).subscribe((res:any)=>{
                          //   try {
                          //     console.log(res);
                          //   } catch (error) {
                          //     console.log(error);                              
                          //   }
                          // });
                          // this.userApi.update(this.loggeduserId,{"isMember":true}).subscribe((res:any)=>{
                          //   console.log(" in update ",res._id);
                          // },
                          // (err: any) => {
                          //   console.log(err);
                          // });
                        }
                       });
                      //find by email id 
                      //if email match then 
                      // check time if time valid or not 
                      // if time is valid 
                      //then get code from DB 
                      // pass that code in comparision 
                      // if match then navigate 
                      // or else shown error "contact to gym owner"
                      // console.log('entered code', var_code);                

                  }
              },
            {
              text: 'Scan QR',
                  handler: (alertData) => { //takes the data 
                      const var_code= alertData.name1;
                      console.log(var_code);
                      if(var_code =="123456"){
                        this.router.navigate(['/member-action'],{replaceUrl:true});
                  
                      }
                    }
                  }
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
    this.memberApi.getMemberByEmail(email).subscribe((data: any)=>{
      console.log("in Check if Invited");
      try {
        if(data.isInviteAccepted=="Not")
        {
          console.log("Please ask respective gym owner to invite you to join gym"); 
          this.presentAlert("Gym Not Joined","Please Ask Gym Admin to Invite to Join Gym","")
        }
        if(data.isInviteAccepted=="Pending")
        {
          console.log("Please Enter Invitaion Code"); 
          this.joinGymAlert();
        }
        if(data.isInviteAccepted=="Yes")
        {
          this.router.navigateByUrl('/member-action',{replaceUrl:true}); 
         }

      } catch (error) {
        throw error;
      }
    });

  }

  updateUserToMember(){
    this.userApi.getUserbyEmail(this.loggeduserEmail).subscribe((res:any)=>{
      try {
        console.log(res);
      } catch (error) {
        console.log(error);                              
      }
    });
    this.userApi.update(this.loggeduserId,{"isMember":true}).subscribe((res:any)=>{
      console.log(" in update ",res._id);
    },
    (err: any) => {
      console.log(err);
    });
  }

  updateMemberInvitedAccepted(email:any,Yes:any)
  {
    console.log("in invitaion code setup")
    this.memberApi.getMemberByEmail(email).subscribe((data: any)=>{
    this.memberApi.update(data._id,{
      "isInviteAccepted":Yes // Status Change to Yes
    }).subscribe((res: any) => {
      const id = res._id;
      console.log('invitaion type change to Yes');
    }, (err: any) => {
      console.log(err)
    });
      });    
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
      url: 'assets/icons/location-pin.png',
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
  }


