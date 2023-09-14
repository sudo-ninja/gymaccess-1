import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  isShowList:boolean=false;
  holidayForm!: FormGroup;

  startDateValue: any;
  endDateValue: any;
  join_date:any;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // This holiday form will take data and update it
    this.holidayForm = this.formBuilder.group({
      h_name:[''],
      h_startdate: [''],
      h_enddate: [''],
    });
  }

  showlist(event){
    console.log(event);
    this.isShowList = true;
  }

  addHoliday(event){
    console.log(event);
  }

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() { // same working as onFormsubmit
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  Start_Date:any;
  Start_Date_UTC: any;
  isButtonSubmit:boolean = true;
  async StartDateChange(event) {
    console.log(event.detail.value);
    console.log('sdate event trigger when touch', event);
    if(event.detail.value){
      this.Start_Date_UTC = Date.parse(event.detail.value);
    }else{
      console.log("Start Date not touch ");
    }  
    this.Start_Date = this.toISOStringWithTimezone(new Date(this.Start_Date_UTC)); 
    this.isButtonSubmit = false;
  }

  End_Date: any;
  End_Date_UTC:any;
  async EndDateChange(event) {
        console.log(event.detail.value);
    this.End_Date_UTC = Date.parse(event.detail.value);
    this.End_Date = this.toISOStringWithTimezone(new Date(this.End_Date_UTC))
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
