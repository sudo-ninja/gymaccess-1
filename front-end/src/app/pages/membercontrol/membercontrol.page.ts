import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import {MemberserviceService} from 'src/app/services/memberservice.service';
import { Member } from 'src/app/models/member.model';

// for date time 
import { format, parseISO } from 'date-fns';
// for modal controller
import { ModalController } from '@ionic/angular';
//moment from Java package for all date calculations;
import * as moment from 'moment';

import * as TimeUnit from 'timeunit';
import { parse } from 'path';


@Component({
  selector: 'app-membercontrol',
  templateUrl: './membercontrol.page.html',
  styleUrls: ['./membercontrol.page.scss'],
})
export class MembercontrolPage implements OnInit {

 value:any;
 startDateValue = new Date(Date.now()).toISOString();
 endDateValue= new Date().toString();
 format = 'yyyy-MM-dd';
//  format = 'HH:mm';
formatedStartDate:any
formatedEndDate:any;

  id:any;
  idu:any;
  idun:any;
  date:any;
  StartDate:any;
  EndDate:any;
  BalanceDays:any;
  EntryTime:any;
  ExitTime:any;

  dateDifference = {
    years:0,
    months:0,
    weeks:0,
    days:0,
    hours:0,
    minutes:0,
    seconds:0,
              }

  members: Member[] = [];

  memberForm!: FormGroup;
  memberForm2!: FormGroup;
   isLoadingResults = false;

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
    // this.getProduct(this.route.snapshot.params['id']);
    // this.getProduct(this.route.snapshot.paramMap.get('id'));
    this.idun=this.id;
    this.getMembercontrol(idu);
    localStorage.setItem('ID',this.idu);
    console.log(idu,this.id,this.idun);
    
   
    // this.route.snapshot.params[this.id];
   
    this.memberForm = this.formBuilder.group({
      'm_startdate': this.id.m_joindate,
      'm_enddate': this.id.m_joindate,
      'm_validdays': this.id.m_validdays,
      'm_intime': this.id.m_intime,
      'm_outtime': this.id.m_outtime
    });
  }

 

  getMembercontrol(id) {
    this.memberApi.getMember(id).subscribe((data: any) => {
      this.id = data.id;
      this.memberForm.patchValue({

        m_startdate:data.m_startdate,
        m_enddate:data.m_enddate,
        m_validdays:this.BalanceDays,


        m_intime:data.m_intime,
        m_outtime:data.m_outtime,
      });
    });
}




onFormSubmit() {
  this.isLoadingResults = true;
  // console.log(this.idun);
  let idux = this.id||this.route.snapshot.paramMap.get('id')||this.idun;
  // console.log(idux , this.id, this.idun);
 
  this.memberApi.update(idux, this.memberForm.value).subscribe((res: any) => {
   
      this.idu = res._id;
      // localStorage.setItem('ID', JSON.stringify(this.id));
      this.isLoadingResults = false;
      
      this.router.navigateByUrl('/member-list',{replaceUrl:true});
      this.modalCtrl.dismiss();
    }, (err: any) => {
      console.log(err);
      this.isLoadingResults = false;
    });

    // this.memberForm2 = this.formBuilder.group({   
    //   'm_validdays': this.BalanceDays,    
    // });

    
    console.log("146 line",this.StartDate);
    this.idu= this.idun;
    this.validDaysCalc();

}

change(event) {
  this.StartDate=event;
  // this.m_startdate = event;
  console.log((new Date(event)).getTime()); // to convert in millisecond time stamp as same will be used to compare
  this.startDateValue = event;
  // this.startDateValue = ((new Date(event)).getTime()).toString();
  const new_date_value = this.formatDate(this.startDateValue, this.format);
  console.log(new_date_value);
  // this.StartDate=new_date_value;
} 

EndDatechange(event) {
  this.EndDate=event;
  // this.m_startdate = event;
  console.log((new Date(event)).getTime());
  this.endDateValue = event;
  // this.endDateValue = ((new Date(event)).getTime()).toString();
  // const new_date_value = this.formatDate(this.endDateValue, this.format); // this date is not in ISOstring so formate not needed
  // console.log(new_date_value);
  // this.StartDate=new_date_value;
  // this.formatedEndDate=this.formatDate( format(event,'dd-MM-yyyy'), this.format);
  // console.log(this.formatedEndDate);
} 



formatDate(value: string, date_format = 'MMM dd yyyy') {
  return format(parseISO(value), date_format);
}

async validDaysCalc(){
  console.log(this.StartDate);
  console.log(this.EndDate);
  var _todayDate = moment(new Date());
  var _StartDate = moment(new Date(this.StartDate));
  var _EndDate = moment(new Date(this.EndDate));

  var _todayModified = new Date();
  var _SDModified = new Date(this.StartDate);
  var _EDModified = new Date(this.EndDate);
  

  const Time = _EDModified.getTime()-_SDModified.getTime();
  this.BalanceDays = Math.floor(Time/(1000*3600*24))+1;
  console.log('Duration Balance Days:',this.BalanceDays);
  localStorage.setItem('balanceDays',this.BalanceDays);


  // var duration = moment.duration(_EndDate.diff(_todayDate));
  //  this.dateDifference.years = Math.floor(duration.years());
  //  this.dateDifference.months = Math.floor(duration.months());
  //  this.dateDifference.days = Math.floor(duration.days());
  //  this.dateDifference.hours = Math.floor(duration.hours());
  //  this.dateDifference.weeks = Math.floor(duration.weeks());
  //  this.dateDifference.minutes = Math.floor(duration.minutes());
  //  this.dateDifference.seconds = Math.floor(duration.seconds());

  //  var balanceDays = Math.floor((this.dateDifference.years*365+this.dateDifference.months*30+this.dateDifference.days))
  //  console.log('Duration days:',balanceDays);
  //   console.log('Duration:',this.dateDifference);
  //   const daysDiff = TimeUnit.DAYS.convert(duration, TimeUnit.MILLISECONDS);
  //   console.log('Duration time unit:',daysDiff);
  

}

// using get set method pass this balance days to member list page as .ts and from there use under {{}} at html page
//here as of now leave valid days field hidden , later on may use for other purpose
// also use date time picker componet with different id to time and time out setting also
// after that correct memeber action page use same parsing methode for date time

}
