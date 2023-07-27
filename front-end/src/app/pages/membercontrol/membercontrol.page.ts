import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MemberserviceService} from 'src/app/services/memberservice.service';
import { Member } from 'src/app/models/member.model';

// for date time 
import { format, parseISO } from 'date-fns';
// for modal controller
import { LoadingController, ModalController } from '@ionic/angular';
//moment from Java package for all date calculations;
// import * as moment from 'moment';



@Component({
  selector: 'app-membercontrol',
  templateUrl: './membercontrol.page.html',
  styleUrls: ['./membercontrol.page.scss'],
})
export class MembercontrolPage implements OnInit {

  @ViewChild('dateTime') sdate;
  @ViewChild('dateTime') edate;
  @ViewChild('dateTime') Itime;
  @ViewChild('dateTime') Otime;

  //for intitial value 
  dbEndDateUTC:any;
  dbStartDateUTC:any;
  dbInTimeUTC:any;
  dbOutTimeUTC:any;
  dbJoinDateUTC:any;
  
  // value: any;
  startDateValue: any;
  endDateValue: any;
  intimeValue: any;
  outtimeValue: any;
  isCalenderDate:boolean = false;
  isButtonSubmit:boolean = true;
  // dateValue:new Date('2022-03-15').toISOString();
  date_value:any
  join_date:any;
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

   memberForm!: FormGroup;
  name: any;
  Start_Date_UTC_: any;
  End_Date_UTC_: number;
  In_Time_UTC_: number;
  Out_Time_UTC_: any;
    

  constructor(
    public loadingController:LoadingController,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public memberApi: MemberserviceService,
    private modalCtrl: ModalController
  ) {
    
  }

  ngOnInit() {
       
    // this.route.snapshot.params['id'];
    // console.log(this.idu);
    // console.log(this.route.snapshot.paramMap.get['id']);
    // this.getProduct(this.route.snapshot.params['id']);
    // this.getProduct(this.route.snapshot.paramMap.get('id'));
    this.idun = this.id;
    console.log(this.idu,this.id,this.idun);

    this.memberApi.getMember(this.id).subscribe((res)=>{
        console.log(res);
      // this.join_date = res.m_joindate;
      // this.myDate = res.m_startdate;
      // this.myEndDate = res.m_enddate;
      // this.myInTime = res.m_intime;
      // this.myOutTime = res.m_outtime;

      // this.sdate.value = this.myDate;
      // this.edate.value = this.myEndDate;
      // this.Itime.value = this.myInTime;
      // this.Otime.value = this.myOutTime;
    });

    
    this.getMembercontrol(this.id);
    console.log(this.endDateValue);

    localStorage.setItem('ID', this.idu);
    

    // this.route.snapshot.params[this.id];
    // This member form will take data and update it
    this.memberForm = this.formBuilder.group({
      m_startdate: [''],
      m_enddate: [''],
      m_validdays: [''],
      m_intime: [''],
      m_outtime: [''],
    });
  }


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
  
  async getMembercontrol(id) {
    const loading = await this.loadingController.create({
      message: 'Loading....'
    });
    await loading.present();

    this.memberApi.getMember(id).subscribe((data:any) => {
      try {
        console.log(data);
        this.dbStartDateUTC = data.m_startdate;
        this.dbEndDateUTC = data.m_enddate;
        this.dbInTimeUTC = data.m_intime;
        this.dbOutTimeUTC = data.m_outtime;
        this.dbJoinDateUTC = data.m_joindate;

        // console.log("myDate Start Date") ;
        console.log(data.m_startdate);
        // set intial value to be loaded using patchValue 
        this.memberForm.patchValue({

          m_startdate: this.toISOStringWithTimezone(new Date(this.dbStartDateUTC*1)),
        
          m_enddate: this.toISOStringWithTimezone(new Date(this.dbEndDateUTC*1)),

          m_validdays: data.m_validdays,

          m_intime: this.toISOStringWithTimezone(new Date(this.dbInTimeUTC*1)),

          m_outtime: this.toISOStringWithTimezone(new Date(this.dbOutTimeUTC*1)),
        });
        
        this.startDateValue = this.toISOStringWithTimezone(new Date(this.dbStartDateUTC*1));
        this.endDateValue = this.toISOStringWithTimezone(new Date(this.dbEndDateUTC*1));
        this.intimeValue = this.toISOStringWithTimezone(new Date(this.dbInTimeUTC*1));
        this.outtimeValue = this.toISOStringWithTimezone(new Date(this.dbOutTimeUTC*1));
        this.join_date = this.toISOStringWithTimezone(new Date(this.dbJoinDateUTC*1));

        this.isCalenderDate = true;
        console.log(this.startDateValue);
        console.log(this.intimeValue);
        console.log(this.outtimeValue);
        console.log(this.endDateValue);
        // console.log(this.myDate);
        loading.dismiss();
      } catch (error) {
        loading.dismiss();
        throw error;
        
      }
    });
        
    console.log(this.dbInTimeUTC);
    console.log(this.startDateValue);
    console.log(this.endDateValue);
  }

  onFormSubmit() {
    this.isButtonSubmit = true;
    this.isLoadingResults = true;
    // console.log(this.idun);
    let idux = this.id || this.route.snapshot.paramMap.get('id') || this.idun;
    console.log(this.dbStartDateUTC,this.dbEndDateUTC);


    if(!this.Start_Date_UTC){
      this.Start_Date_UTC_ = +this.dbStartDateUTC;
      console.log("null",this.dbStartDateUTC);
    } else{
      console.log("IF",this.Start_Date_UTC);
      this.Start_Date_UTC_ = this.Start_Date_UTC;
        }

    if(!this.End_Date_UTC){
      this.End_Date_UTC_= +this.dbEndDateUTC;
     
    } else{
      this.End_Date_UTC_ = this.End_Date_UTC; 
    }    

    if(!this.In_Time_UTC){
      this.In_Time_UTC_= +this.dbInTimeUTC;
  
    } else{
      this.In_Time_UTC_ = this.In_Time_UTC;
    }

    if(!this.Out_Time_UTC){
      this.Out_Time_UTC_= +this.dbOutTimeUTC;
    
    } else{
      this.Out_Time_UTC_=this.Out_Time_UTC;
    }


    this.validDaysCalc();

    this.memberForm = this.formBuilder.group({
      m_startdate: [this.Start_Date_UTC_],
      m_enddate: [this.End_Date_UTC_, Validators.required],
      m_validdays: [this.BalanceDays, Validators.required],
      m_intime: [this.In_Time_UTC_, Validators.required],
      m_outtime: [this.Out_Time_UTC_, Validators.required],
    });
    console.log(this.memberForm.value);
    console.log(idux);

    this.memberApi.update(idux, this.memberForm.value).subscribe(
      (res) => {
        console.log(res);
        this.idu = res._id;
        // localStorage.setItem('ID', JSON.stringify(this.id));
        this.isLoadingResults = false;
              

        // this.modalCtrl.dismiss();
        this.modalCtrl.dismiss(
          () => {
            // Call the method to do whatever in your home.ts
               console.log('Modal closed');
        });
        this.router.navigateByUrl('/gymtabs/member-list');
      },
      (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
   
    this.idu = this.idun;
   
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
    // var _todayDate = moment(new Date());
    // var _StartDate = moment(new Date(this.Start_Date_UTC));
    // var _EndDate = moment(new Date(this.End_Date));

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
  async EndDateChange(event) {
        console.log(event.detail.value);
    // console.log('Return Value True', event.detail.value);
    this.End_Date_UTC = Date.parse(event.detail.value);
    // console.log(new Date(this.End_Date).toTimeString());
    // this.validDaysCalc();
    // this.End_Date= new Date(this.End_Date_UTC).toISOString();
    this.End_Date = this.toISOStringWithTimezone(new Date(this.End_Date_UTC))
  }

  Start_Date:any;
  Start_Date_UTC: any;

  async StartDateChange(event) {
    console.log(event.detail.value);
    console.log('sdate event trigger when touch', event);
    if(event.detail.value){
      this.Start_Date_UTC = Date.parse(event.detail.value);
    }else{
      console.log("Start Date not touch ");
    }
    // this.StartDate = new Date(event.detail.value).getTime();
    // console.log('238 line for String', this.Start_Date_UTC);
    // console.log(new Date(this.Start_Date_UTC).toLocaleString());
    // console.log(this.Start_Date_UTC);
    // console.log(new Date(this.Start_Date_UTC).toString());
    // this.Start_Date = new Date(this.Start_Date_UTC).toISOString();
    this.Start_Date = this.toISOStringWithTimezone(new Date(this.Start_Date_UTC));
    // console.log(this.Start_Date);
    // var a = new Date(this.Start_Date_UTC).toLocaleString().split(',');
    // var date = a[0];
    // var time = a[1];
    // console.log('243 life for Date time Seprate', date, time);
    this.isButtonSubmit = false;
  }

  In_Time:any
  In_Time_UTC: any;

  async InTimeChange(event) {
    console.log("IN TIME ",event);
    // console.log('Return Value True', event.detail.value);
    this.In_Time_UTC = Date.parse(event.detail.value);
    // console.log(this.In_Time_UTC);
    console.log(new Date(this.In_Time_UTC).toISOString());
        console.log(this.toISOStringWithTimezone(new Date(this.In_Time_UTC)))

    // this.In_Time = new Date(this.In_Time_UTC).toISOString();
    this.In_Time = this.toISOStringWithTimezone(new Date(this.In_Time_UTC))
    console.log(this.In_Time);
  }

  Out_Time: any;
  Out_Time_UTC:any;
  async OutTimeChange(event) {
    console.log("OUT TIME ",event);
    // console.log('Return Value True', event.detail.value);
    this.Out_Time_UTC = Date.parse(event.detail.value);
    console.log(new Date(this.Out_Time_UTC));
    console.log(this.toISOStringWithTimezone(new Date(this.Out_Time_UTC)))
    // this.Out_Time = new Date(this.Out_Time_UTC).toISOString();
    this.Out_Time = this.toISOStringWithTimezone(new Date(this.Out_Time_UTC));
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

