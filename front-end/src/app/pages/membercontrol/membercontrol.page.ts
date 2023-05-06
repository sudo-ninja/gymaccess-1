import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MemberserviceService} from 'src/app/services/memberservice.service';
import { Member } from 'src/app/models/member.model';

// for date time 
import { format, parseISO } from 'date-fns';
// for modal controller
import { LoadingController, ModalController } from '@ionic/angular';
//moment from Java package for all date calculations;
import * as moment from 'moment';

import * as TimeUnit from 'timeunit';
import { parse } from 'path';
import { AnyRecord } from 'dns';


@Component({
  selector: 'app-membercontrol',
  templateUrl: './membercontrol.page.html',
  styleUrls: ['./membercontrol.page.scss'],
})
export class MembercontrolPage implements OnInit {
  value: any;
  startDateValue: any;
  endDateValue: any;
  intimeValue: any;
  outtimeValue: any;
  isCalenderDate:boolean = false;
  isButtonSubmit:boolean = true;
  // dateValue:new Date('2022-03-15').toISOString();
  date_value:any
  myDate: String;
  myEndDate:String;
  myInTime:String;
  myOutTime:String;
  /***if wrong variable type assigned then variable wont be available globally;***/

  //for delayed Loading 
  isLoadingResults = false;

  format = 'yyyy-MM-dd';
  //  format = 'HH:mm';
  formatedStartDate: any;
  formatedEndDate: any;

  id: any;
  idu: any;
  idun: any;
  date: any;
  StartDate: any;
  EndDate: any;
  BalanceDays: any;
  EntryTime: any;
  ExitTime: any;

  dateDifference = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  members: Member[] = [];

  member: Member = {
    _id: '',
    m_name: '',
    gym_id: '',
    email: '',
    aadhar: '',
    mobile: '',
    Emergency_mobile: '',
    m_address_lat: '',
    m_address_long: '',
    memberType: '',
    m_joindate: '',
    m_accesstype: '',
    isInviteAccepted: '',
    m_startdate: '',
    m_enddate: '',
    m_validdays: '',
    m_intime: '',
    m_outtime: '',
  }

  memberForm!: FormGroup;
  memberForm2!: FormGroup;
   

  constructor(
    public loadingController:LoadingController,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public memberApi: MemberserviceService,
    private modalCtrl: ModalController
  ) {
    // this.date_value =Date.now().toString();
    console.log(this.myDate);
   
  }

  ngOnInit() {
    
    
    let idu = this.id || this.route.snapshot.params['id'];
    console.log(this.idu);
    console.log(this.route.snapshot.paramMap.get['id']);
    // this.getProduct(this.route.snapshot.params['id']);
    // this.getProduct(this.route.snapshot.paramMap.get('id'));
    this.idun = this.id;
    console.log(this.idu,this.id,this.idun);

    
    this.getMembercontrol(this.id);
    console.log(this.endDateValue);

    localStorage.setItem('ID', this.idu);
    

    // this.route.snapshot.params[this.id];
    // This member form will take data and update it
    this.memberForm = this.formBuilder.group({
      m_startdate: ['', Validators.required],
      m_enddate: ['', Validators.required],
      m_validdays: ['', Validators.required],
      m_intime: ['', Validators.required],
      m_outtime: ['', Validators.required],
    });
  }

  
  async getMembercontrol(id) {

    const loading = await this.loadingController.create({
      message: 'Loading....'
    });
    await loading.present();
        var oldEndDateUTC;
        var oldStartDateUTC;
        var oldInTimeUTC;
        var oldOutTimeUTC;
    this.memberApi.getMember(id).subscribe((data:any) => {
      try {
        console.log(data);
        oldStartDateUTC = data.m_startdate;
        oldEndDateUTC = data.m_enddate;
        oldInTimeUTC = data.m_intime;
        oldOutTimeUTC = data.m_outtime;
        // this to get existing data to display as to be updated
        
        // console.log(new Date(this.outtimeValue*1).toTimeString();
        // this.id = data.id;
        this.memberForm.patchValue({
          // m_startdate: data.m_startdate,
          // m_enddate: data.m_enddate,
          // m_validdays: data.m_validdays,
          // m_intime: data.m_intime,
          // m_outtime: data.m_outtime,
          m_startdate: this.toISOStringWithTimezone(new Date(oldStartDateUTC*1)),
          // m_enddate: new Date(oldEndDateUTC*1).toISOString(),
          // m_validdays: data.m_validdays,
          // m_intime: new Date(oldInTimeUTC*1).toISOString(),
          // m_outtime: new Date(oldOutTimeUTC*1).toISOString(),

          m_enddate: this.toISOStringWithTimezone(new Date(oldEndDateUTC*1)),
          m_validdays: data.m_validdays,
          m_intime: this.toISOStringWithTimezone(new Date(oldInTimeUTC*1)),
          m_outtime: this.toISOStringWithTimezone(new Date(oldOutTimeUTC*1)),
        });
        
        // this.startDateValue = new Date(oldStartDateUTC*1).toISOString();
        // this.endDateValue = new Date(oldEndDateUTC*1).toISOString();
        // this.intimeValue = new Date(oldInTimeUTC*1).toISOString();
        // this.outtimeValue = new Date(oldOutTimeUTC*1).toISOString();

        this.startDateValue = this.toISOStringWithTimezone(new Date(oldStartDateUTC*1));
        this.endDateValue = this.toISOStringWithTimezone(new Date(oldEndDateUTC*1));
        this.intimeValue = this.toISOStringWithTimezone(new Date(oldInTimeUTC*1));
        this.outtimeValue = this.toISOStringWithTimezone(new Date(oldOutTimeUTC*1));
         
        this.isCalenderDate = true;
        // console.log(this.startDateValue);
        // console.log(this.endDateValue);
        this.myDate = this.startDateValue;
        this.myEndDate = this.endDateValue;
        this.myInTime = this.intimeValue;
        // this.myInTime = '2020-10-06T20:43:33+05:30';
        this.myOutTime = this.outtimeValue;
        console.log(this.myInTime);
        console.log(this.myOutTime);
        loading.dismiss();
      } catch (error) {
        loading.dismiss();
        throw error;
        
      }
    });
        
    console.log(oldInTimeUTC);
    console.log(this.startDateValue);
    console.log(this.endDateValue);
  }

  onFormSubmit() {
    this.isButtonSubmit = true;
    this.isLoadingResults = true;
    // console.log(this.idun);
    let idux = this.id || this.route.snapshot.paramMap.get('id') || this.idun;
    console.log(idux, this.id, this.idun);
    this.memberForm = this.formBuilder.group({
      m_startdate: [this.Start_Date_UTC, Validators.required],
      m_enddate: [this.End_Date_UTC, Validators.required],
      m_validdays: [this.BalanceDays, Validators.required],
      m_intime: [this.In_Time_UTC, Validators.required],
      m_outtime: [this.Out_Time_UTC, Validators.required],
    });
    console.log(this.memberForm.value);
    console.log(idux);

    this.memberApi.update(idux, this.memberForm.value).subscribe(
      (res: any) => {
        this.idu = res._id;
        // localStorage.setItem('ID', JSON.stringify(this.id));
        this.isLoadingResults = false;

        this.router.navigateByUrl('/gymtabs/member-list', { replaceUrl: true });
        this.modalCtrl.dismiss();
      },
      (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );

    // this.memberForm2 = this.formBuilder.group({
    //   'm_validdays': this.BalanceDays,
    // });
    console.log('End Daye', this.End_Date, 'Start Date', this.Start_Date_UTC);

    // console.log("146 line",this.StartDate);
    this.idu = this.idun;
    this.validDaysCalc();
  }

  // change(event) {
  //   this.StartDate=event;
  //   // this.m_startdate = event;
  //   console.log((new Date(event)).getTime()); // to convert in millisecond time stamp as same will be used to compare
  //   // this.startDateValue = event;
  //   // this.startDateValue = ((new Date(event)).getTime()).toString();
  //   // const new_date_value = this.formatDate(this.startDateValue, this.format);
  //   // console.log(new_date_value);
  //   // this.StartDate=new_date_value;
  // }

  // EndDatechange(event) {
  //   this.EndDate=event;
  //   // this.m_startdate = event;
  //   console.log((new Date(event)).getTime());
  //   this.endDateValue = event;
  //   const new_date_value = this.formatDate(this.endDateValue, this.format);
  //   console.log(new_date_value);
  //   // this.validDaysCalc();
  //   // this.endDateValue = ((new Date(event)).getTime()).toString();
  //   // const new_date_value = this.formatDate(this.endDateValue, this.format); // this date is not in ISOstring so formate not needed
  //   // console.log(new_date_value);
  //   // this.StartDate=new_date_value;
  //   // this.formatedEndDate=this.formatDate( format(event,'dd-MM-yyyy'), this.format);
  //   // console.log(this.formatedEndDate);
  // }

  formatDate(value: string, date_format = 'MMM dd yyyy') {
    return format(parseISO(value), date_format);
  }

  async validDaysCalc() {
    console.log(this.Start_Date_UTC);
    console.log(this.End_Date);
    var _todayDate = moment(new Date());
    var _StartDate = moment(new Date(this.Start_Date_UTC));
    var _EndDate = moment(new Date(this.End_Date));

    var _todayModified = new Date();
    var _SDModified = new Date(this.Start_Date_UTC);
    var _EDModified = new Date(this.End_Date);

    const Time = _EDModified.getTime() - _SDModified.getTime();
    this.BalanceDays = Math.floor(Time / (1000 * 3600 * 24)) + 1;
    console.log('Duration Balance Days:', this.BalanceDays);
    localStorage.setItem('balanceDays', this.BalanceDays);

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

  // after that correct memeber action page use same parsing methode for date time
  End_Date: any;
  End_Date_UTC:any;
  EndDateChange(event) {
    //     console.log(event);
    // console.log('Return Value True', event.detail.value);
    this.End_Date_UTC = Date.parse(event.detail.value);
    // console.log(new Date(this.End_Date).toTimeString());
    // this.validDaysCalc();
    this.End_Date= new Date(this.End_Date_UTC).toISOString();
  }
  Start_Date:any;
  Start_Date_UTC: any;
  StartDateChange(event) {
     // if this is not touched then set old value as new value 
    // so that null can not be passed to DB
  
    console.log(event.detail.value);
    // console.log('Return Value True', event.detail.value);
    this.Start_Date_UTC = Date.parse(event.detail.value);
    // this.StartDate = new Date(event.detail.value).getTime();
    // console.log('238 line for String', this.Start_Date_UTC);
    // console.log(new Date(this.Start_Date_UTC).toLocaleString());
    // console.log(this.Start_Date_UTC);
    // console.log(new Date(this.Start_Date_UTC).toString());
    this.Start_Date = new Date(this.Start_Date_UTC).toISOString();
    // console.log(this.Start_Date);
    // var a = new Date(this.Start_Date_UTC).toLocaleString().split(',');
    // var date = a[0];
    // var time = a[1];
    // console.log('243 life for Date time Seprate', date, time);
    this.isButtonSubmit = false;
  }

  In_Time:any
  In_Time_UTC: any;
  InTimeChange(event) {
    console.log("IN TIME ",event);
    // console.log('Return Value True', event.detail.value);
    this.In_Time_UTC = Date.parse(event.detail.value);
    // console.log(this.In_Time_UTC);
    console.log(new Date(this.In_Time_UTC).toTimeString());
    this.In_Time = new Date(this.In_Time_UTC).toISOString();
    // console.log(this.In_Time);
  }

  Out_Time: any;
  Out_Time_UTC:any;
  OutTimeChange(event) {
    console.log("OUT TIME ",event);
    // console.log('Return Value True', event.detail.value);
    this.Out_Time_UTC = Date.parse(event.detail.value);
    console.log(new Date(this.Out_Time_UTC));
    console.log(this.toISOStringWithTimezone(new Date(this.Out_Time_UTC)))
    this.Out_Time = new Date(this.Out_Time_UTC).toISOString();
  }

  // convert date to ISO string with timezone
  toISOStringWithTimezone(date)
   {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      diff + pad(tzOffset / 60) +
      ':' + pad(tzOffset % 60);
  };

}

