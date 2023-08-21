import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MemberserviceService} from 'src/app/services/memberservice.service';
import { AlertController, ModalController } from '@ionic/angular';
import { parseISO } from 'date-fns';
//get gym details
import { GymService } from 'src/app/services/gym.service';

// to get storage
import { StorageService } from 'src/app/services/storage.service';

import {FormControl} from '@angular/forms';

import { NavController } from '@ionic/angular';



// import { ErrorStateMatcher } from '@angular/material/core';

// /** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.page.html',
  styleUrls: ['./member-add.page.scss'],
  providers:[MemberserviceService]
})
export class MemberAddPage {

  defaultGymID:any;
  
  memberForm!: FormGroup;
    gym_id='';
    gym_name='';
    m_name='';
    Emergency_mobile='';
    mobile= '';
    aadhar='';
    email='';
    m_address_lat= '';
    m_address_long= '';
    memberType='member';
    m_joindate='';
    m_accesstype='paid';
    isInviteAccepted='';
    m_startdate='';
    m_enddate='';
    m_validdays='';
    m_intime='';
    m_outtime='';
  
    isLoadingResults = false;
    // matcher = new MyErrorStateMatcher();
  submitted = false;
  ngZone: any;
  MemberType = [
        {name:'Member'},{name: 'Staff'}, {name:'Phyiotherepist'}, {name:'Utilities Staff'},{name:'Manager'}];
  AccessType = [{name:'Paid'}, {name:'Free'}];
  AT:any;
  MT:any;
  accesstype:'';
  membertype:'';
    // used to conver input text value into lowercase
  _textValue:string
  defaultTime:any;
  gym_name_: string;
  default_gym: string;
  default_gym_name: string;



  constructor(
    private router: Router,
    // public fb: FormBuilder,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public memberApi:MemberserviceService,
    private navCtrl : NavController,
    private gymApi:GymService,
   
  ) {
    // get gym id from sesson storage here 
    this.default_gym = localStorage.getItem('DefaultGym');
    console.log(this.default_gym);
    
     
    this.gymApi.getGym(this.defaultGymID).subscribe((res)=>{
      console.log(res);
    });
    
    console.log("Default Gym ID..=", this.defaultGymID);
    // this.defaultTime= Date().toLocaleString();
    this.defaultTime = Date.now();
    //date.now give unix formate of data
    //while date() gives ISO form with GMT
    console.log(this.defaultTime);
    this.dateTotime();

  }

    ngOnInit() {
      // this.selectAccessType(this.AccessType);
      // this.selectMemberType(this.MemberType);
      console.log("GYM ID FROM GYM PAGE..= ",localStorage.getItem('gymID'));
      this.gymApi.getGym(localStorage.getItem('gymID')).subscribe(res=>{
        console.log(res.gym_name);
        this.default_gym_name = res.gym_name;
        localStorage.setItem('default_gym_name',res.gym_name)
      })
      console.log("GYM Name FROM GYM PAGE..= ",this.default_gym_name);


      this.memberForm = this.formBuilder.group({
        'gym_id' : [localStorage.getItem('gymID'), Validators.required],
        'gym_name':[localStorage.getItem('default_gym_name'),Validators.required],
        'm_name' : [null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]],
        'Emergency_mobile': [null, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
          Validators.pattern('^[0-9]*$')
        ]],
        'mobile': [null, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
          Validators.pattern('^[0-9]*$')
        ]
        ],
        'aadhar':['123'],
        'email':[null, [
          Validators.required,
          // Validators.toLowerCase(),
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]],
        'memberType': ['member',Validators.required],
        'm_joindate': [Date.now(), Validators.required],
        'm_accesstype': ['paid',Validators.required],

        'm_address_lat': ['0'],
        'm_address_long': ['0'],

          'm_startdate':[Date.now()],
          'm_enddate':[Date.now()],
          'm_validdays':['0'],
          'm_intime':[Date.now()],
          'm_outtime':[Date.now()],
           //date time all saved in Unix form in DB uniformaly accorss project 
           // as per need reverse calculation done 
      }); 

      // lower case to email input 
      this.memberForm.get('email').valueChanges.subscribe((event) => {
        this.memberForm.get('email').setValue(event.toLowerCase(), {emitEvent: false});
     });
        
      }

      ionViewDidEnter(){
        console.log("ion view did enter");
      }
    
      ionViewWillLeave(){
        console.log("ion view will leave");
      }
    
      ionViewDidLeave(){
        console.log("ion view did leave");
      }
    
      ionViewWillEnter()  {    
        
        console.log("ION VIEW WILL ENTER");
        // get member associated with this gym only
        // this.getMembers();
      
       }

      dateTotime(){          
                const d = new Date(); // Parses a ISO 8601 Date
                console.log(d.getHours()); // gets the hours in the timezone of the browser.
                console.log(d.getUTCHours()); // gets the hours in UTC timezone.
                console.log(d.getMinutes()); // gets the minutes in the timezone of the browser.
                console.log(d.getUTCMinutes()); // gets the minutes in UTC timezone.
                console.log(d.getHours() + ':' + d.getMinutes());
                console.log(d.getUTCHours() + ':' + d.getUTCMinutes());
                this.defaultTime = 
                console.log(d.getDate());
      }


        onFormSubmit() {
          this.isLoadingResults = true;
          console.log(this.memberForm.controls['email'].value.toLowerCase());
          // check here if added member is  admin of any gym or not , if he is admin of any gym then 
          // show alert that member is admin of Gym name 
          this.memberApi.addMember(this.memberForm.value).subscribe({
            next:(res) => {
                const id = res._id;
                localStorage.setItem('ID',JSON.stringify(id));
                localStorage.setItem('GYM_ID',JSON.stringify(res.gym_id));
                this.isLoadingResults = false;
                // this.navCtrl.pop();
                // this.router.navigate(['/member/', id],{replaceUrl:true});
                this.router.navigateByUrl('/gymtabs/member-list');
              }, 
              error:(err) => {
                console.log(err);
                this.presentAlert("Alert !!!",err.errors.message,"Or Wrong Data Entered!");
                this.isLoadingResults = false;
              }
            });
                this.memberType = this.membertype;
                this.m_accesstype = this.accesstype;
             
        }

         value: string = '';
            change(value: string) {
              this.value = value;
                  }

          handleChange_AT(e) {
          // this.pushLog('ionChange fired with value: ' + e.detail.value);
          console.log(e.detail.value);
          this.accesstype = e.detail.value;    
        }

        // this for select option use to select paid or free , member or staff..
        handleChange_MT(e) {
          // this.pushLog('ionChange fired with value: ' + e.detail.value);
          console.log(e.detail.value);
          // this.membertype = e.detail.value;
          // this.memberForm.get('memberType').setValue(e, {
          //   onlySelf: true,
          //   })
        }

        //to convert input data as lowercase 
        ConvertToLower(evt)
         {
          this._textValue = evt.toLowerCase();
        }
       
        BacktoList(){
          this.router.navigate(['/gymtabs/member-list'],{replaceUrl:true});
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

        
}
