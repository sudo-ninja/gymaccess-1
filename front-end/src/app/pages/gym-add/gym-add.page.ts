import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GymService } from './../../services/gym.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { UserService } from 'src/app/services/user.service';

//to get current location Lattitude and Longitude
import { Geolocation } from '@capacitor/geolocation';

import { GmapPage } from '../gmap/gmap.page';

// to set login user as admin if he added gym
// change isAdmin to true in user type also so next login will lead to him direct member list page or gym add page
import {MemberserviceService} from 'src/app/services/memberservice.service';
import { GymadminService } from 'src/app/services/gymadmin.service';

import { AlertController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';


// https://www.positronx.io/mean-stack-tutorial-angular-crud-bootstrap/

@Component({
  selector: 'app-gym-add',
  templateUrl: './gym-add.page.html',
  styleUrls: ['./gym-add.page.scss'],
})
export class GymAddPage implements OnInit {

  adminForm!: FormGroup;
  gymForm!: FormGroup;

  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  // usersUrl:string='http://localhost:3000/api/v1/users';// URL at postman from where all user are fetched
  userUrl:string= environment.SERVER+'/users';
  _id :string; // This is an observable

  loggedUserId:any;
  loggedUserName:any;
  loggedUserEmail:any;  
  
  gymId:any;
// for modal controller
  @ViewChild(GmapPage, {static : true}) gmap : GmapPage;
  gymLAT: string;
  gymLNG: string;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private gymApi: GymService,
    public memberApi:MemberserviceService,
    private gymadminApi:GymadminService,
    private http:HttpClient,
    private userApi:UserService,
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,

    
  ) { 
    const user = localStorage.getItem('User');
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);
    // this.mainForm();

    // fetch location as soon as page is open 
    this.fetchLocation();
  }

  ngOnInit() {
    this.mainForm();
    //  to make sure only user can see this page by login so this is done 
    const user = localStorage.getItem('User')
    // this.addName(user);
    console.log(user); // here user info is being display after login successfull
    this.loggeduser=user;
    // console.log(this.loggeduser.username);
    if(user==null){
      this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
    }else{
      console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
      this.loggeduser=JSON.parse(user!);
      console.log('Ng On IT consol', this.loggeduser._id , this.loggeduser.username , this.loggeduser.email , this.loggeduser.mobile); // convert back user info into object so that we can use this info
      this.loggedUserId=this.loggeduser._id;
      this.loggedUserName = this.loggeduser.username;
      this.loggedUserEmail = this.loggeduser.email;

      // this.mainForm();
      // this.http.get(this.usersUrl).subscribe(res=>{
      //   console.log(res)
      //   // this.serviceProviders=res;
      //   // this.originalserviceProvider=res;
      // },error=>{
      //   console.log(error)});
    }

   
    
  }

  mainForm(){
    console.log(this.loggeduser._id);
    console.log(localStorage.getItem('gymLat'));
    console.log(localStorage.getItem('gymLng'));

    this.gymForm = this.fb.group({
      user_id: [this.loggeduser._id, Validators.required],
      gym_name: ['',Validators.required],
      gym_emergency: ['',Validators.required],
      gym_mobile: ['',Validators.required],
      gym_gstin: [''],
      gym_lockId:[''],   
      
      // why lat , llng not taking by 
      gym_address_lat: [this.gymLAT],
      gym_address_long: [this.gymLNG],
         
    })
    
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
      this.message = `Hello, ${data.lat,data.lng}!`;
      console.log(this.message);
      console.log(localStorage.getItem('gymLat'),localStorage.getItem('gymLng'));
      this.gymLAT = localStorage.getItem('gymLat') || data.lat;
      this.gymLNG = localStorage.getItem('gymLng') || data.lng;
    }
    }
    

  onSubmit() {
    // this.submitted = true; 
    console.log(this.gymLAT,this.gymLNG);
    this.gymForm.patchValue({
      gym_address_lat :this.gymLAT,
      gym_address_long :this.gymLNG,
    });    
    
    console.log(this.gymForm.value);
     
    if (!this.gymForm.valid) {
      this.findInvalidControls();
      return false;
    } else {
      return this.gymApi.addGym(this.gymForm.value).subscribe((res: any) => {
        this.gymId = res._id;
        // localStorage.setItem('ID',JSON.stringify(id));
        // this.isLoadingResults = false;
      localStorage.setItem('GYM',JSON.stringify(res)) // trick use to transfer added gym info gym list page
      /********************************************************* */
      // logic added if any login user add GYM it means he is admin for that gym 
      // if gym successfully added with gym ID then user detail to be added in Gym Admin
      //as Gym Admin with Free access and with linked gym ID without any scan 
      //just using access button,
      /********************************************************** */
     
      this.gymadminApi.getGymadminByEmail(this.loggedUserEmail).subscribe((res)=>{
        console.log(res);
        // as of now in both case if first time gym add or next time gym add , seprate
        //sepratedata being enterded with all 3 field same but with diffferent gym id.
        if(res==null){
          // first set logged user as Admin
          this.updateUserToAdmin();
          console.log("Null response");
          //call admin add form
         this.adminAdd();      
      // patch value to admin form
       this.adminForm.patchValue({
         gym_id : this.gymId,
         user_id : this.loggeduser._id,
         mobile : this.loggeduser.mobile,
         email: this.loggeduser.email,
       });
       console.log(this.adminForm);
          console.log(this.adminForm.value);
          this.gymadminApi.addGymadmin(this.adminForm.value).subscribe((res)=>{
            console.log(res);
          });
          this.router.navigateByUrl("/gym-list",{replaceUrl:true});
        }else{
          this.updateUserToAdmin();
          this.adminAdd();      
          // patch value to admin form
           this.adminForm.patchValue({
             gym_id : this.gymId,
             user_id : this.loggeduser._id,
             mobile : this.loggeduser.mobile,
             email: this.loggeduser.email,
           });
          this.gymadminApi.addGymadmin(this.adminForm.value).subscribe((res)=>{
            console.log(res);
          });
          this.router.navigateByUrl("/gym-list",{replaceUrl:true}); 
        }
      })
      // if(!this.memberApi.getMemberByEmail(this.loggeduser.email)){
      
      // this.memberApi.addMember (this.adminForm.value).subscribe((res: any) => {
      //             const id = res._id;
      //             console.log('Added as Admin member Type=',res.memberType);
      //             // here also we need to set user type as ADMIN also so that next time if he login then dirctly
      //             // got to add gym page .. not stay at home page
      //           }, (err: any) => {
      //             console.log(err)
      //           });
        
      // }else{
       
      // }
       },(err: any) => {
          console.log(err);
          // this.isLoadingResults = false;
        });
    }
  } 

  async adminAdd(){
          this.adminForm = this.fb.group({
        'gym_id' : ['', Validators.required],
        'user_id' : ['', [Validators.required]],
        'mobile': ['', [
          Validators.required,
          // Validators.minLength(10),
          // Validators.maxLength(13),
          // Validators.pattern('^[0-9]*$')
        ]
        ],
        'email':['', [
          Validators.required,
          // Validators.minLength(5),
          // Validators.maxLength(80),
          // Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]],
        
         })
      }



      updateUserToAdmin(){     
        this.userApi.update(this.loggedUserId,{"isAdmin":true}).subscribe((res:any)=>{
          console.log(" in update ",res._id);
        },
        (err: any) => {
          console.log(err);
        });
      }

async LoggedUserInfo(){

}  

// how to use this to find invalid control 
public findInvalidControls() 
{
  console.log("invlid control");
  let invalid = [];
       const controls = this.gymForm.get('gym') as FormGroup; 
       console.log(this.gymForm.value)  ;
       console.log(controls) ; 
       for (const name in controls.controls) 
       {       
        if (controls.controls[name].invalid) 
        {         
          invalid.push(' ' +(+name + 1));        
        }     
  return invalid;
        }
}

gyminformation(){
  this.router.navigate(['../gymtabs/infor'],{replaceUrl:true});
}


}
