import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { UserService } from '../services/user.service';

import{ Router} from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';

import { PushNotifications } from '@capacitor/push-notifications';
import { GmapsService } from '../services/gmaps/gmaps.service';



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


  constructor(
    private router:Router,
    private http:HttpClient,
    private _user:UserService,
    private alertController: AlertController,
    /////google map///
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private actionSheetCtrl: ActionSheetController

  ) {
    this._user.user().subscribe(
      res=>{
        this.addName(res),
        console.log(res)
      },
      error=>{
        // this.router.navigate(['/login'])
        console.log(error)
      }
     )
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
      this.joinGymAlert();
     }
  }
  
  ngOnInit(): void {
  //  to make sure only user can see this page by login so this is done 
    const user = localStorage.getItem('User')
    this.addName(user);
    console.log(user); // here user info is being display after login successfull
    this.loggeduser=user;
    console.log(this._id);
    if(user==null){
      this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
    }else{
      console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
      this.loggeduser=JSON.parse(user!);
      console.log(this.loggeduser._id); // convert back user info into object so that we can use this info
       this.username=this.loggeduser.name;
       console.warn(this.username);
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
      this._user.logout()
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
    const alert = await this.alertController.create({
      header: 'Please enter Verification Code',
      buttons: [
                {
                  text: 'Ok',
                  handler: (alertData) => { //takes the data 
                      const var_code= alertData.name1;
                      console.log(var_code);
                      if(var_code =="123456"){
                        this.router.navigate(['/member-action'],{replaceUrl:true});
                  
                      }

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
          name:'name1',
          placeholder: 'Verificaion Code',
          attributes: {
                        maxlength: 6,
                      },
        },
      ],
    });

    await alert.present();
  }



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


