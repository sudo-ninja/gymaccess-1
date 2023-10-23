import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Attendance_ } from 'src/app/models/attendance.model';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.page.html',
  styleUrls: ['./attendances.page.scss'],
})
export class AttendancesPage implements OnInit {
  AttendaceId: string;
  attendances:Attendance_[]=[];
  memberForm!: FormGroup;
  id: any;
  isLoadingResults: boolean;
  idu: any;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private attendanceApi:AttendanceService,
  ) { }

  ngOnInit() {
    this.AttendaceId = this.route.snapshot.paramMap.get('id');
    this.getMember(this.AttendaceId);

    this.memberForm = this.formBuilder.group({
      'shiftname' : ['', Validators.required],
      'gymid' : ['', Validators.required],
      'gym_name': ['', Validators.required],
      'shift_start_time': ['', Validators.required],
      'shift_end_time':['', Validators.required],
      'repeat':['', Validators.required],
      'working_days': ['', Validators.required],
      // 'holiday_list_id': ['', Validators.required],
      
    });
  }

  async getMember(id: any) {  
    this.attendanceApi.getAttendance(id).subscribe((data: any) => {
      this.id = data.id;
      this.memberForm.setValue({
        gym_id: data.gym_id,
        shiftname:data.shiftname,
        gymid:data.gymid,
        gym_name:data.gym_name,
        shift_start_time:data.shift_start_time,
        shift_end_time:data.shift_end_time,
        repeat:data.repeat,
        working_days:data.working_days,
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    let idux = this.id||this.route.snapshot.paramMap.get('id');
    this.attendanceApi.update(idux, this.memberForm.value).subscribe((res: any) => {     
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
    value:0,
   },
   {
    name:'MON',
    value:1,
   },
   {
    name:'TUE',
    value:3,
   },
   {
    name:'WED',
    value:3,
   },
   {
    name:'THU',
    value:5,
   },
   {
    name:'FRI',
    value:5,
   },
   {
    name:'SAT',
    value:6,
   },
];

  async presentTimeAlert(dayid) {
    console.log(dayid)
    const alert = await this.alertCtrl.create({
      header: 'Set Time',
      inputs : [
        {
          label: 'Set Holiday',
          type: 'radio',
          value: 'holiday',
        },
        {
          label:'In Time',
          name: 'start_time',
          placeholder: 'IN Time',
          type: 'time',
          min: '00:00',
          max: '23:59',
        },
        {
          label:'Out Time',
          name: 'end_time',
          placeholder: 'OUT Time',
          type: 'time',
          min: '00:00',
          max: '23:59',
        },
        
      ],
      
      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => {
            console.log('Selected Time:', data.start_time);
            // You can do something with the selected time here
          }
        }
      ]
    });

    await alert.present();
  }

}

