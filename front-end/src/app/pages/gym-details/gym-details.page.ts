import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Gym } from 'src/app/models/gym.model';
import{GymService} from './../../services/gym.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertController, LoadingController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

//to get current location Lattitude and Longitude
import { Geolocation } from '@capacitor/geolocation';
// gmap 
import { GmapPage } from '../gmap/gmap.page';

@Component({
  selector: 'app-gym-details',
  templateUrl: './gym-details.page.html',
  styleUrls: ['./gym-details.page.scss'],
})
export class GymDetailsPage implements OnInit {

  // for gmap modal controller
  @ViewChild(GmapPage, {static : true}) gmap : GmapPage;


  gymForm!: FormGroup;
    // user_id:'';
    // gym_name:'';
    // gym_address_lat:'';    
    // gym_address_long:'';
    // gym_mobile:'';
    // gym_emergency:'';
    // gym_gstin:'';
    // gym_lockId:'';
    
  id:any;
  submitted=false;
  new_lat:any;
  new_lng:any;

  gym:Gym={
    _id:'',
    user_id:'',
    gym_name:'',
    gym_address_lat:'',    
    gym_address_long:'',
    gym_mobile:'',
    gym_emergency:'',
    gym_gstin:'',
    gym_lockId:'',
  }

  isLoadingResults = false;

  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router :Router,
    private modalCtrl: ModalController,
    public alertController :AlertController,
    private gymApi:GymService,
  ) { 
    const gymID = localStorage.getItem('gymID');
    this.id = gymID || this.route.snapshot.paramMap.get('id');
    console.log(this.id);

      // fetch location as soon as page is open 
      this.fetchLocation();
  }

  ngOnInit() {

    let idu = this.id || this.route.snapshot.paramMap.get('id');
    // this.getGyms();
    this.getGym(idu);
    this.gymForm = this.formBuilder.group({
      //if key of form are kept in single quote the become editable
      user_id: ['',Validators.required],
      gym_name : ['', Validators.required],
      gym_emergency: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      gym_mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      gym_gstin:['', Validators.required],
      gym_address_lat:[this.new_lat, Validators.required],
      gym_address_long: [this.new_lng, Validators.required],
      'gym_lockId': ['', Validators.required],
      //   email: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
      //   ],
      // ],
    });
  }

  // Getter to access form control
  get myForm() {
    return this.gymForm.controls;
  }
/// this method is not used
  async getGyms(){
    if (this.route.snapshot.paramMap.get('id')==='null'){
      this.presentAlertConfirm('You Are not selecting');
    }else{
      this.isLoadingResults = true;
      await this.gymApi.getGym(this.route.snapshot.paramMap.get('id'))
      .subscribe(res=>{
        console.log("get gym",res._id);
        console.log(res);
        this.gym = res;
        this.isLoadingResults=false;
      },err=> {
        console.log(err);
        this.isLoadingResults=false;
      });
     }
  }

   async presentAlertConfirm(msg:string){
    const alert = await this.alertController.create({
      header :'Warning!',
      message: msg,
      buttons:[
        {
          text : 'Okay',
          handler:()=>{
            this.router.navigate(['/member-list']);
          }
        }
      ]
    });
    await alert.present();
  }
// this method is used
  getGym(id:any) {
    this.gymApi.getGym(id).subscribe((data) => {
      console.log(data);
      this.gymForm.patchValue({
      user_id: data.user_id,
      gym_name: data.gym_name,
      gym_emergency: data.gym_emergency,
      gym_mobile: data.gym_mobile,
      gym_gstin: data.gym_gstin,
      gym_address_lat: data.gym_address_lat,
      gym_address_long: data.gym_address_long,
      gym_lockId: data.gym_lockId
      });
    });
  }

// work on location update only ..


  
 
  onSubmit() {
    this.submitted = true;
    if (!this.gymForm.valid) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) 
      {
        console.log(this.gymForm.value);
        this.gymApi.update(this.id, this.gymForm.value).subscribe((res:any)=>{});
      }
    }
    this.modalCtrl.dismiss(this.onSubmit, 'confirm');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.onSubmit, 'confirm');
  }

  // to fetch gym location from page and use this info to open google map for this default location
  current_lat:any
  current_long:any
async fetchLocation(){
const _geoLocation = Geolocation.getCurrentPosition();
console.log('current location =', _geoLocation);
const coordinates = await Geolocation.getCurrentPosition();    
console.log('Current position:--', coordinates.coords.latitude,coordinates.coords.longitude , coordinates.timestamp.toPrecision(4));
this.current_lat=coordinates.coords.latitude;
this.current_long=coordinates.coords.longitude;
localStorage.setItem('current_lat',this.current_lat);
localStorage.setItem('current_long',this.current_long);
}

// modal controller of gmap page 
message:any;
  async getLocation()
   {
      const modal = await this.modalCtrl.create({
      component: GmapPage,
      // componentProps:{id:uid},
      // breakpoints: [0, 0.5, 0.8],
      // initialBreakpoint: 0.8,      
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm') {
    this.message = `Hello, ${data.lat}!`;
    console.log(this.message);
    console.log(localStorage.getItem('gymLat'),localStorage.getItem('gymLng'));
    this.new_lat= localStorage.getItem('gymLat');
    this.new_lng = localStorage.getItem('gymLng');
  }
  }
}