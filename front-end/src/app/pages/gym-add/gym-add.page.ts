import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GymService } from './../../services/gym.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { GmapPage } from '../gmap/gmap.page';

// to set login user as admin if he added gym
import {MemberserviceService} from 'src/app/services/memberservice.service';
import { AlertController, ModalController } from '@ionic/angular';


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
  usersUrl:string='http://localhost:3000/users';// URL at postman from where all user are fetched
  _id :string; // This is an observable
  loggedUserId:any;
  loggedUserName:any;
  loggedUserEmail:any;


   

  @ViewChild(GmapPage, {static : true}) gmap : GmapPage;


  constructor(
    private router: Router,
    public fb: FormBuilder,
    private apiService: GymService,
    public memberApi:MemberserviceService,
    private http:HttpClient,
    private _user:UserService,
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,

    
  ) { 
    const user = localStorage.getItem('User');
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);
    // this.mainForm();
  }

  ngOnInit() {
    this.mainForm();
    //  to make sure only user can see this page by login so this is done 
    const user = localStorage.getItem('User')
    // this.addName(user);
    console.log(user); // here user info is being display after login successfull
    this.loggeduser=user;
    console.log(this.loggeduser.username);
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
      this.http.get(this.usersUrl).subscribe(res=>{
        console.log(res)
        // this.serviceProviders=res;
        // this.originalserviceProvider=res;
      },error=>{
        console.log(error)});
    }
    
  }

  mainForm(){
    console.log(this.loggeduser._id);
    this.gymForm = this.fb.group({
      user_id: [localStorage.getItem('loggedUserId'), Validators.required],
      gym_name: [''],
      gym_emergency: [''],
      gym_mobile: [''],
      gym_gstin: [''],
      gym_address_lat: [localStorage.getItem('gymLat'), Validators.required],
      gym_address_long: [localStorage.getItem('gymLng'), Validators.required],
      gym_lockId:[''],      
    })
    console.log(localStorage.getItem('gymLat'),localStorage.getItem('gymLng'));
  }

   // Getter to access form control
   get myForm() {
    return this.gymForm.controls;  }

    async getLocation()
      // this.router.navigateByUrl("/gmap",{replaceUrl:true});

      // this.gmap.locate();
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
      // this.message = `Hello, ${data}!`;
    }

    }
    

  onSubmit() {
    // this.submitted = true;
    

    if (!this.gymForm.valid) {
      return false;
    } else {
      return this.apiService.addGym(this.gymForm.value).subscribe((res: any) => {
        const id = res._id;
        // localStorage.setItem('ID',JSON.stringify(id));
        // this.isLoadingResults = false;
      localStorage.setItem('GYM',JSON.stringify(res)) // trick use to transfer added gym info gym list page
      // logic added if any login user add GYM it means he is admin for that gym 
      // if gym successfully added with gym ID then user detail to be added in members
      //as Admin with Free access and with gym ID , so first member to
      // any gym is Admin him self  

      if(!this.memberApi.getMemberByEmail(this.loggeduser.email)){
      this.adminAdd();
     
      this.adminForm.patchValue({
        gym_id :res._id,
        m_name : this.loggeduser.username ,
        Emergency_mobile : res.gym_emergency,
        mobile : this.loggeduser.mobile,
        aadhar: '0000.0000.0000.0000',
        email: this.loggeduser.email,
        m_address_lat : res.gym_address_lat,
        m_address_long: res.gym_address_long,
        memberType :'Admin',
        m_joindate: Date.now(),
        m_accesstype: 'Free',
        isInviteAccepted : true,
        m_startdate: Date.now(),
        m_enddate: Date.now(),
        m_validdays:'',
        m_intime:'00:01',
        m_outtime:'23:59',
      });
      this.memberApi.addMember (this.adminForm.value).subscribe((res: any) => {
                  const id = res._id;
                  console.log('Added as Admin member Type=',res.memberType);
                }, (err: any) => {
                  console.log(err)
                });
      this.router.navigateByUrl("/gym-list",{replaceUrl:true});  
      }else{
        this.router.navigateByUrl("/gym-list",{replaceUrl:true}); 
      }
       },(err: any) => {
          console.log(err);
          // this.isLoadingResults = false;
        });
    }
  } 

  async adminAdd(){
          this.adminForm = this.fb.group({
        'gym_id' : ['', Validators.required],
        'm_name' : ['', [Validators.required]],
        'Emergency_mobile': [null, [
          Validators.required,
          // Validators.minLength(10),
          // Validators.maxLength(13),
          // Validators.pattern('^[0-9]*$')
        ]],
        'mobile': ['', [
          Validators.required,
          // Validators.minLength(10),
          // Validators.maxLength(13),
          // Validators.pattern('^[0-9]*$')
        ]
        ],
        'aadhar':['', Validators.required],
        'email':['', [
          Validators.required,
          // Validators.minLength(5),
          // Validators.maxLength(80),
          // Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]],
        'memberType': ['',Validators.required],
        'm_joindate': ['', Validators.required],
        'm_accesstype': ['',Validators.required],

        'm_address_lat': [''],
        'm_address_long': [''],

          'm_startdate':[''],
          'm_enddate':[''],
          'm_validdays':[''],
          'm_intime':[''],
          'm_outtime':[''],

          })
      }



async LoggedUserInfo(){

}      
}
  // formSubmit() {

  //   if (!this.gymForm.valid){
  //     // return false;
  //   }else {
  //     // this.gymService.createBooking(this.gymForm.value).then(res => {
  //     //   console.log(res)
  //     //   this.gymForm.reset();
  //     //   this.router.navigate(['/gym-lst']);
  //     // }).catch(error => console.log(error));
  //   }

   
  // }
