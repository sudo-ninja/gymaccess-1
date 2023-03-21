import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MemberserviceService} from 'src/app/services/memberservice.service';
import { AlertController, ModalController } from '@ionic/angular';
import { parseISO } from 'date-fns';



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
  
  memberForm!: FormGroup;
    gym_id='';
    m_name='';
    Emergency_mobile='';
    mobile= '';
    aadhar='';
    email='';
    m_address_lat= '';
    m_address_long= '';
    memberType='';
    m_joindate='';
    m_accesstype='';
    isInviteAccepted=false;
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



  constructor(
    private router: Router,
    // public fb: FormBuilder,
    private formBuilder: FormBuilder,
    public memberApi:MemberserviceService,
    private cd: ChangeDetectorRef, 
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,
   
  ) {   
  }

    ngOnInit() {
      // this.selectAccessType(this.AccessType);
      // this.selectMemberType(this.MemberType);
      console.log(localStorage.getItem('gymID'));
      this.memberForm = this.formBuilder.group({
        'gym_id' : [localStorage.getItem('gymID'), Validators.required],
        'm_name' : [null, [
          Validators.required,
          // Validators.minLength(3),
          // Validators.maxLength(30)
        ]],
        'Emergency_mobile': [null, [
          Validators.required,
          // Validators.minLength(10),
          // Validators.maxLength(13),
          // Validators.pattern('^[0-9]*$')
        ]],
        'mobile': [null, [
          Validators.required,
          // Validators.minLength(10),
          // Validators.maxLength(13),
          // Validators.pattern('^[0-9]*$')
        ]
        ],
        'aadhar':[null, Validators.required],
        'email':[null, [
          Validators.required,
          // Validators.minLength(5),
          // Validators.maxLength(80),
          // Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]],
        'memberType': ['member',Validators.required],
        'm_joindate': [Date.now(), Validators.required],
        'm_accesstype': ['paid',Validators.required],

        'm_address_lat': ['0'],
        'm_address_long': ['0'],

          'm_startdate':[Date.now()],
          'm_enddate':[Date.now()],
          'm_validdays':['0'],
          'm_intime':['05:20'],
          'm_outtime':['05:20'],
      }); 
        
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
          console.log(this.memberForm.value);
          this.memberApi.addMember(this.memberForm.value)
            .subscribe((res: any) => {
                const id = res._id;
                localStorage.setItem('ID',JSON.stringify(id));
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
       
        
}
