import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MemberserviceService} from 'src/app/services/memberservice.service';
import { AlertController, ModalController } from '@ionic/angular';
import { parseISO } from 'date-fns';

// to get storage
import { StorageService } from 'src/app/services/storage.service';



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
export class MemberAddPage implements OnInit {

  defaultGymID:any;
  
  memberForm!: FormGroup;
    gym_id='';
    m_name='';
    Emergency_mobile='';
    mobile= '';
    aadhar='';
    email='';
    m_address_lat= '';
    m_address_long= '';
    memberType='Member';
    m_joindate='';
    m_accesstype='Paid';
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



  constructor(
    private router: Router,
    // public fb: FormBuilder,
    private formBuilder: FormBuilder,
    public memberApi:MemberserviceService,
   
  ) {
    // get gym id from sesson storage here 
    this.defaultGymID =sessionStorage.getItem('defaultGymId'); 
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
      this.memberForm = this.formBuilder.group({
        'gym_id' : [localStorage.getItem('gymID'), Validators.required],
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
        'aadhar':[null, Validators.required],
        'email':[null, [
          Validators.required,
          // Validators.toLowerCase(),
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]],
        'memberType': ['Member',Validators.required],
        'm_joindate': [Date.now(), Validators.required],
        'm_accesstype': ['Paid',Validators.required],

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

        // Choose options with select-dropdown
        // selectMemberType(e) {
        // this.memberForm.get('memberType').setValue(e, {
        //   onlySelf: true,
        //   })
        // }

        // selectAccessType(e) {
        //   this.memberForm.get('m_accesstype').setValue(e, {
        //     onlySelf: true,
        //     })
        //   }

        onFormSubmit() {
          this.isLoadingResults = true;
          console.log(this.memberForm.controls['email'].value.toLowerCase());
          this.memberApi.addMember(this.memberForm.value)
            .subscribe((res: any) => {
                const id = res._id;
                localStorage.setItem('ID',JSON.stringify(id));
                localStorage.setItem('GYM_ID',JSON.stringify(res.gym_id));
                this.isLoadingResults = false;
                this.router.navigate(['/member/', id],{replaceUrl:true});
              }, (err: any) => {
                console.log(err);
                this.isLoadingResults = false;
              });
                this.memberType = this.membertype;
                this.m_accesstype = this.accesstype;

                // this.memberForm.patchValue({
                //   memberType:"this.memberType",
                // });
             
        }

          handleChange_AT(e) {
          // this.pushLog('ionChange fired with value: ' + e.detail.value);
          console.log(e.detail.value);
          this.accesstype = e.detail.value;    
        }

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
        
}
