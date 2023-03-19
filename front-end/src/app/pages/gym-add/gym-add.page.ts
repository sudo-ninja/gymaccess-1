import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GymService } from './../../services/gym.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { GmapPage } from '../gmap/gmap.page';


// https://www.positronx.io/mean-stack-tutorial-angular-crud-bootstrap/

@Component({
  selector: 'app-gym-add',
  templateUrl: './gym-add.page.html',
  styleUrls: ['./gym-add.page.scss'],
})
export class GymAddPage implements OnInit {
  gymForm!: FormGroup;
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  usersUrl:string='http://localhost:3000/users';// URL at postman from where all user are fetched
  _id :string; // This is an observable
  loggedUserId:any;

  @ViewChild(GmapPage, {static : true}) gmap : GmapPage;


  constructor(
    private router: Router,
    public fb: FormBuilder,
    private apiService: GymService,
    private http:HttpClient,
    private _user:UserService,
    
  ) { 
    const user = localStorage.getItem('User');
    this.loggeduser=user;
    console.log(this.loggeduser._id);
    this.mainForm();
  }

  ngOnInit() {
    // this.mainForm();
    //  to make sure only user can see this page by login so this is done 
    const user = localStorage.getItem('User')
    // this.addName(user);
    console.log(user); // here user info is being display after login successfull
    this.loggeduser=user;
    console.log(this.loggeduser);
    if(user==null){
      this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
    }else{
      console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
      this.loggeduser=JSON.parse(user!);
      console.log(this.loggeduser._id); // convert back user info into object so that we can use this info
      this.loggedUserId=this.loggeduser._id;
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
    })
  }

   // Getter to access form control
   get myForm() {
    return this.gymForm.controls;  }

    getLocation(){
      this.router.navigate(['/gmap']);
      this.gmap.locate();
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

        this.router.navigate(['/gym-list']);
        },(err: any) => {
          console.log(err);
          // this.isLoadingResults = false;
        });
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

}
