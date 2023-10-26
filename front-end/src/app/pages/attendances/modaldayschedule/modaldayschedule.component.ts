import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { NavParams } from '@ionic/angular';
import { AttenshiftService } from 'src/app/services/attenshift.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-modaldayschedule',
  templateUrl: './modaldayschedule.component.html',
  styleUrls: ['./modaldayschedule.component.scss'],
})
export class ModaldayscheduleComponent  implements OnInit {
  @ViewChild('dateTime') InTime: any;
  @ViewChild('dateTime') PunchOutTime: any;

  name: any;
  selectedTime:any;
  pageTitle:any;
  dataFromPage:any;
  showDays: boolean;
  AttendaceId: any;
  id: any;
  dayNumber: any;
  Days: any=[];
  myForm!: FormGroup;
  isHolidaySet: any;
  outtimeValue: any;
  intimeValue: any;
  
  foundObject: any;
  selectedDayid: any;
  DayChanged: any;

  constructor(
    private modalCtrl: ModalController,
    private dataTransferservice : DatatransferService,
    private attendanceApi:AttenshiftService,
    private formBuilder: FormBuilder,
  ) { 
    this.dataFromPage = this.dataTransferservice.getData();
    console.log(this.dataFromPage);
    this.pageTitle = this.dataFromPage.day.fullname;
    this.dayNumber = this.dataFromPage.day.day_number;
    this.id = this.dataFromPage.id;
  }

  ngOnInit() {
    
    this.getDay(this.id);

    this.myForm = this.formBuilder.group({
      punchIn: [''],
      punchOut: [''],
      isHoliday: [''],

    });
     
  }

  //get day data
  async getDay(id: any) {    
    this.attendanceApi.getShift(id).subscribe({
      next:res=>{
          this.Days = res.working_days;
          this.foundObject = this.Days.find(obj => obj.day_number === this.dayNumber);// get exact data from DB
          console.log(this.foundObject);
          this.isHolidaySet = this.foundObject.isHoliday;
          this.outtimeValue = this.foundObject.punchOut;
          this.intimeValue = this.foundObject.punchIn;
          this.selectedDayid = this.foundObject._id;

          this.myForm.patchValue({         
            isHoliday:this.foundObject.isHoliday,
            // punchIn:[this.intimeValue, Validators.required],
            // punchOut:[this.outtimeValue, Validators.required],
           });
      },
      error:err=>{}
    });   
  }

  // public isHolidaySet: boolean ;
  holidayToggle(event){
    // console.log("Toggled: "+ this.isHolidaySet,"Passage Mode is ..", event);    
      this.isHolidaySet = event;   
      // this.attendanceApi.updateDay(this.id,this.selectedDayid,{"isHoliday":event}).subscribe({
      //   next:res=>{
      //     console.log(res);
      //   },
      //   error:err=>{
      //     console.log(err);
      //   },
      // });

  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.onSubmit();
    return this.modalCtrl.dismiss(this.Days, 'confirm');
  }

  showSelectedTime() {
    console.log('Selected Time:', this.selectedTime);
  }


  @ViewChild('popover') popover;

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  In_Time:any
  In_Time_UTC: any;

  async InTimeChange(event) {
    // console.log(event.detail.value);
    this.In_Time = event.detail.value;
      // this.In_Time_UTC = Date.parse(event.detail.value);
      // console.log(this.In_Time_UTC);
      // this.In_Time = this.toISOStringWithTimezone(new Date(this.In_Time_UTC))
      console.log(this.In_Time);
  }

  Out_Time: any;
  Out_Time_UTC:any;
  async OutTimeChange(event) {
    // console.log(event.detail.value);
    this.Out_Time = event.detail.value;
    // this.Out_Time_UTC = Date.parse(event.detail.value);
    // console.log(this.Out_Time_UTC);
    // this.Out_Time = this.toISOStringWithTimezone(new Date(this.Out_Time_UTC));
    console.log(this.Out_Time);
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
  }

  onSubmit() {
    const formData = this.myForm.value;
 
    const DayFormData = {
      "isHoliday":this.isHolidaySet,
      "punchIn":this.In_Time,
      "punchOut":this.Out_Time
    }
    // console.log(formData);
 
    this.attendanceApi.updateDay(this.id,this.selectedDayid,DayFormData).subscribe({
      next:res=>{
        console.log(res);
        this.attendanceApi.getShift(this.id).subscribe({
          next:res=>{
            this.DayChanged = res.working_days;
            console.log(this.DayChanged);
            return this.modalCtrl.dismiss(this.DayChanged, 'confirm');
          }
        });
      },
      error:err=>{
        console.log(err);
      },
    });

  }


}
