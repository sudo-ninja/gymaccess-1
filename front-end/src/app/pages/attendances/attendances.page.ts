import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

import { Attenshift } from 'src/app/models/attenshift'; 
 
import { AttenshiftService } from 'src/app/services/attenshift.service';
//import modal day scheduler
import { ModaldayscheduleComponent } from './modaldayschedule/modaldayschedule.component';
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.page.html',
  styleUrls: ['./attendances.page.scss'],
})
export class AttendancesPage implements OnInit {

  @ViewChild('dateTime') Itime;
  @ViewChild('dateTime') Otime;


  AttendaceId: string;
  attendances:Attenshift[]=[];
  memberForm!: FormGroup;
  id: any;
  isLoadingResults: boolean;
  idu: any;

  intimeValue: any;
  dbInTimeUTC: any;
  dbOutTimeUTC: any;
  outtimeValue: string;

  In_Time_UTC_: number;
  Out_Time_UTC_: any;
  isButtonSubmit: boolean;
  shift_name: any;
  showDays: boolean;
  weekdays: any = [];
  // shiftname: any;


  constructor(
    private alertCtrl: AlertController,
    
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private attendanceApi:AttenshiftService,
    private dataTransferservice:DatatransferService
  ) {
    
   }

  ngOnInit() {
    this.AttendaceId = this.route.snapshot.paramMap.get('id');
    this.getMember(this.AttendaceId);

    this.memberForm = this.formBuilder.group({
      'shiftname' : ['', Validators.required],
      'gymid' : [''],
      'gym_name': ['', Validators.required],
      'shift_start_time': ['', Validators.required],
      'shift_end_time':['', Validators.required],
      'repeat':[''],
      'working_days': [''],
      // 'holiday_list_id': ['', Validators.required],
      
    });
  }

  ionViewWillEnter(){
    this.getMember(this.AttendaceId);
    console.log(this.checkValidity());
  }

  //check if end time is always more than start time
  async checkValidity(){
    
    // Set up custom validation for birthDate < expiryDate
    this.memberForm.get('shift_start_time').valueChanges.subscribe(() => {
      this.memberForm.get('shift_end_time').updateValueAndValidity();
    });

    this.memberForm.get('shift_end_time').setValidators((control) => {
      if (
        this.memberForm.get('shift_start_time').value &&
        this.memberForm.get('shift_end_time').value
      ) {
        const shift_start_time = new Date(this.memberForm.get('shift_start_time').value);
        const shift_end_time = new Date(this.memberForm.get('shift_end_time').value);

        if (shift_start_time >= shift_end_time) {
          return { endTimeInvalid: true }; // this will return invalid end time true;
        }
      }
      return null;
    });
  }

  async getMember(id: any) {  
    this.attendanceApi.getShift(id).subscribe((data: any) => {
      console.log(data);
      this.id = data.id;
      this.isToggled = !data.repeat;
      // this.dbInTimeUTC = data.shift_start_time;
      // this.dbOutTimeUTC = data.shift_end_time;
      this.outtimeValue = data.shift_end_time;
      this.intimeValue = data.shift_start_time;
      this.weekdays = data.working_days;

      this.memberForm.patchValue({         
        shiftname:data.shiftname,
        gymid:data.gymid,
        gym_name:data.gym_name,
        // shift_start_time: this.toISOStringWithTimezone(new Date(this.dbInTimeUTC*1)),
        // shift_end_time:this.toISOStringWithTimezone(new Date(this.dbOutTimeUTC*1)),

        // shift_start_time: [this.intimeValue, Validators.required],
        
        // shift_start_time: [this.In_Time_UTC_, Validators.required],
        // shift_end_time:[this.outtimeValue, Validators.required],
        repeat:data.repeat,
        // working_days:data.working_days,
      });
          
    });    
    

  }

  onFormSubmit() {

    const formData = this.memberForm.value;
    console.log(formData.shift_start_time);

    this.isButtonSubmit = true;
    this.isLoadingResults = true;
    let idux = this.id||this.route.snapshot.paramMap.get('id');

   
    // make final form that will be updated based on change in time
    const modifiedForm = this.formBuilder.group({
      shiftname:[formData.shiftname],
      shift_start_time: [this.In_Time],
      shift_end_time:[this.Out_Time],
      // repeat:data.repeat,
      // working_days:data.working_days,
    });

    this.attendanceApi.update(idux, modifiedForm.value).subscribe((res: any) => {     
        this.idu = res._id;
        this.isLoadingResults = false;
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      );


      

  }

  

  //input alert for time in and out and holiday 
  days = [
    {
    name:'SUN',
    fullname:'SUNDAY',
    value:0,
   },
   {
    name:'MON',
    fullname:'MONDAY',
    value:1,
   },
   {
    name:'TUE',
    fullname:'TUESDAY',
    value:3,
   },
   {
    name:'WED',
    fullname:'WEDNESDAY',
    value:3,
   },
   {
    name:'THU',
    fullname:"THURSDAY",
    value:5,
   },
   {
    name:'FRI',
    fullname:'FRIDAY',
    value:5,
   },
   {
    name:'SAT',
    fullname:'SATURDAY',
    value:6,
   },
];

  // async presentTimeAlert(dayid) {
  //   console.log(dayid)
  //   const alert = await this.alertCtrl.create({
  //     header: 'Set Time',
  //     inputs : [
  //       {
  //         label: 'Set Holiday',
  //         type: 'radio',
  //         value: 'holiday',
  //       },
  //       {
  //         label:'In Time',
  //         name: 'start_time',
  //         placeholder: 'IN Time',
  //         type: 'time',
  //         min: '00:00',
  //         max: '23:59',
  //       },
  //       {
  //         label:'Out Time',
  //         name: 'end_time',
  //         placeholder: 'OUT Time',
  //         type: 'time',
  //         min: '00:00',
  //         max: '23:59',
  //       },
        
  //     ],
      
      
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         handler: (data) => {
  //           console.log('Selected Time:', data.start_time);
  //           // You can do something with the selected time here
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }



  In_Time:any
  In_Time_UTC: any;

  async InTimeChange(event) {
    this.In_Time = event.detail.value
      // this.In_Time_UTC = Date.parse(event.detail.value);
      // this.In_Time = this.toISOStringWithTimezone(new Date(this.In_Time_UTC))
  }

  Out_Time: any;
  Out_Time_UTC:any;
  async OutTimeChange(event) {
    this.Out_Time = event.detail.value;
    // this.Out_Time_UTC = Date.parse(event.detail.value);
    // this.Out_Time = this.toISOStringWithTimezone(new Date(this.Out_Time_UTC));
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


  selectedTime: string;

  showSelectedTime() {
    console.log('Selected Time:', this.selectedTime);
  }

  public isToggled: boolean ;
  notifyAndUpdateIsToggled(event){
    // console.log("Toggled: "+ this.isToggled,"Passage Mode is ..", event);    
      this.isToggled = event;    
    this.attendanceApi.update(this.AttendaceId,{"repeat":!event}).subscribe(res=>{
      console.log(res);
      if(res.repeat == true){
         this.showDays = false;
      }else{
        this.showDays = true;}
        // console.log("🚀 ~ file: addlock.page.ts:153 ~ AddlockPage ~ toggleButton ~ el̥se:",(this.showOpeningRange && this.showPassage));
        }
       );
  }

  // open modal to update day timingg schedule
  // modal controller of gmap page 
  message:any;
    async customTiming(day:any)
     {
        console.log(day);
        this.dataTransferservice.setData({day,"id":this.AttendaceId});
        const modal = await this.modalCtrl.create({
        component: ModaldayscheduleComponent,
        // componentProps:{id:this.AttendaceId},
        breakpoints: [0, 0.5, 0.8],
        initialBreakpoint: 0.8,      
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log(data);
      // location.reload(); // this will force refresh page.
      this.weekdays = data;    
    }

    // when close model it will change the page also
    if(!window.history.state.modal){
      const modalState = {modal:true};
      history.pushState(modalState,null);
      }
    }



}

