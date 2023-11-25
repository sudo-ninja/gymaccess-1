import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { HolidayService } from 'src/app/services/holiday.service';

// import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-addholidaymodal',
  templateUrl: './addholidaymodal.component.html',
  styleUrls: ['./addholidaymodal.component.scss'],
})
export class AddholidaymodalComponent implements OnInit {
  @ViewChild('dateTime') Itime;
  @ViewChild('dateTime') Otime;

  isHolidaySet: any;
  myForm!: FormGroup;
  intimeValue: any;
  outtimeValue: any;
  isOpen: boolean;
  isButtonSubmit: boolean = false;
  isLoadingResults: boolean;
  id: string;
  dataFromPage: any;
  pageTitle: any;
  holidaylist: any;

  //for ng model
  holiday_name: string;
  selectedSegment: string = 'start_date';
  selectedDate: string = new Date().toISOString().split('.')[0];

  In_Time2: any;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private holidayApi: HolidayService,
    private dataTransferservice: DatatransferService
  ) // private datePipe: DatePipe

  {
    this.dataFromPage = this.dataTransferservice.getHolidayData();
    this.id = this.dataFromPage.id;
    this.holidayApi.getHolidaylist(this.id).subscribe({
      next: (data) => {
        // this.holidaylist = data;
        this.pageTitle = data.holidaylistname;
      },
      error: (err) => {},
    });

    // console.log(this.holidaylist);
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      holiday_name: ['', Validators.required],
      holiday_start_date: [
        new Date().toISOString().split('.')[0],
        Validators.required,
      ],
      holiday_end_date: [
        new Date().toISOString().split('.')[0],
        Validators.required,
      ],
    });

    // console.log(this.selectedSegment);
    // this.selectDateBasedOnSegment(this.selectedSegment,this.In_Time2);
  }

  dateComparisonValidator(
    birthdayControlName: string,
    expiryControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const birthdayControl = formGroup.get(birthdayControlName);
      const expiryControl = formGroup.get(expiryControlName);

      if (birthdayControl && expiryControl) {
        const birthdayDate = new Date(birthdayControl.value);
        const expiryDate = new Date(expiryControl.value);

        if (birthdayDate > expiryDate) {
          return { dateComparison: true };
        }
      }

      return null;
    };
  }

    ionViewWillEnter(){
      this.In_Time2 = new Date().toISOString();
      console.log(this.In_Time2);
      this.selectDateBasedOnSegment(this.selectedSegment,this.In_Time2);

  }

  segmentSelcted(e) {
    this.selectedSegment = e.detail.value;
    console.log('Selected segment:', this.selectedSegment);
  }

  selectDateBasedOnSegment(segment: string, date: string) {
    if (this.selectedSegment === 'start_date') {
      this.In_Time = date;
    } else if (this.selectedSegment === 'end_date') {
      this.Out_Time = date;
    }
  }

  In_Time: any;
  In_Time_UTC: any;

  InTimeChange(event) {
    console.log(event.detail.value);
    this.In_Time = event.detail.value;
  }

  Out_Time: any;
  Out_Time_UTC: any;
  OutTimeChange(event) {
    console.log(event.detail.value);
    this.Out_Time = event.detail.value;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onSubmit() {
    this.isLoadingResults = true;
    // check form validity also
    if (this.myForm.valid) {
      this.isButtonSubmit = true;
      this.holidayApi.addHoliday(this.id, this.myForm.value).subscribe({
        next: (res) => {
          // console.log(res.holidays);
          this.isLoadingResults = false;
          return this.modalCtrl.dismiss(res.holidays, 'confirm');
        },
        error: (err) => {
          console.log(err);
          this.isLoadingResults = false;
        },
      });
    }
  }
}
