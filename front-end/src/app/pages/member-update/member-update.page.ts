import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import {MemberserviceService} from 'src/app/services/memberservice.service';
import { Member } from 'src/app/models/member.model';


import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-member-update',
  templateUrl: './member-update.page.html',
  styleUrls: ['./member-update.page.scss'],
})
export class MemberUpdatePage implements OnInit {

  MemberType = [
    {name:'Member'},{name: 'Staff'}, {name:'Phyiotherepist'}, {name:'Utilities Staff'},{name:'Manager'}];
  AccessType = [{name:'Paid'}, {name:'Free'}];
  accesstype:'';
  membertype:'';

  members: Member[] = [];

  member:Member={
    _id:'',
    m_name:'',
    gym_id:'',
    email: '',
    aadhar:'',
    mobile:'',
    Emergency_mobile:'',
    m_address_lat:'',
    m_address_long:'',
    memberType:'',
    m_joindate:'',
    m_accesstype:'',
    isInviteAccepted:'',
    }

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
    isInviteAccepted='';

    isLoadingResults = false;
    // matcher = new MyErrorStateMatcher();
  // submitted = false;
  // ngZone: any;
  id:any;
  idu:any;
  idun:any;
  

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public memberApi:MemberserviceService,
    private modalCtrl: ModalController
  ) {
    
   }

  ngOnInit() {

    let idu = this.id || this.route.snapshot.params['id'];
    // this.getMember(this.route.snapshot.params['id']);
    // this.getMember(this.route.snapshot.paramMap.get('id'));
    this.idun=this.id;
    this.getMember(idu);
    localStorage.setItem('ID',this.idu);
    console.log(idu,this.id,this.idun);
    // this.route.snapshot.params[this.id];
   
    this.memberForm = this.formBuilder.group({
      'gym_id' : ['', Validators.required],
      'm_name' : ['', Validators.required],
      'Emergency_mobile': ['', Validators.required],
      'mobile': ['', Validators.required],
      'aadhar':['', Validators.required],
      'email':['', Validators.required],
      'm_address_lat': ['', Validators.required],
      'm_address_long': ['', Validators.required],
      'memberType':['', Validators.required],
      'm_joindate': ['', Validators.required],
      'm_accesstype':['', Validators.required],
      // 'isInviteAccepted': [''],
    });
  }

  async getMember(id: any) {  
    this.memberApi.getMember(id).subscribe((data: any) => {
      this.id = data.id;
      this.memberForm.setValue({
        gym_id: data.gym_id,
        m_name: data.m_name,
        Emergency_mobile: data.Emergency_mobile,
        mobile: data.mobile,
        aadhar: data.aadhar,
        email: data.email,
        m_address_lat: data.m_address_lat,
        m_address_long: data.m_address_long,
        memberType: data.memberType,
        m_joindate: data.m_joindate,
        m_accesstype: data.m_accesstype,
        // // isInviteAccepted: data.m.isInviteAccepted,
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    // const Id = localStorage.getItem('ID')    
    console.log(this.idun);

    let idux = this.id||this.route.snapshot.paramMap.get('id')||this.idun;
    console.log(idux , this.id, this.idun);
    this.memberApi.update(idux, this.memberForm.value).subscribe((res: any) => {
      // console.log(res._id);
      // console.log(this.idu);
      // console.log(this.idun);      
        this.idu = res._id;
        // localStorage.setItem('ID', JSON.stringify(this.id));
        this.isLoadingResults = false;
        console.log(idux);
        this.router.navigate(['/member/',idux]);
        this.modalCtrl.dismiss();
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      );

      this.idu= this.idun;
  }

  productDetails() {
    
    this.router.navigate(['/member/',this.id]);
  }

  handleChange_AT(e) {
    // this.pushLog('ionChange fired with value: ' + e.detail.value);
    // console.log(e.detail.value);
    this.accesstype = e.detail.value;    
  }

  handleChange_MT(e) {
    // this.pushLog('ionChange fired with value: ' + e.detail.value);
    // console.log(e.detail.value);
    // this.membertype = e.detail.value;
    // this.memberForm.get('memberType').setValue(e, {
    //   onlySelf: true,
    //   })
  }

}


