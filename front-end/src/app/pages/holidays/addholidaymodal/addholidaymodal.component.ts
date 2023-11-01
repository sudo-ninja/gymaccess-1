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
export class AddholidaymodalComponent  implements OnInit {

  @ViewChild('dateTime') Itime;
  @ViewChild('dateTime') Otime;
  
  isHolidaySet:any;
  myForm!: FormGroup;
  intimeValue:any;
  outtimeValue:any;
  isOpen:boolean;
  isButtonSubmit: boolean = false;
  isLoadingResults: boolean;
  id: string;
  dataFromPage: any;
  pageTitle: any;
  holidaylist: any;

//for ng model 
  holiday_name:string;
  selectedSegment: string = 'start_date';
  selectedDate: string = new Date().toISOString().split(".")[0];
   

  In_Time2:any
  

  constructor(
    private alertCtrl: AlertController,    
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private holidayApi:HolidayService,  
    private dataTransferservice:DatatransferService,
    // private datePipe: DatePipe
 
  ) {

    this.dataFromPage = this.dataTransferservice.getHolidayData();
    console.log(this.selectedDate);
    // this.pageTitle = this.dataFromPage.day.fullname;
    // this.dayNumber = this.dataFromPage.day.day_number;
    this.id = this.dataFromPage.id
    this.holidayApi.getHolidaylist(this.id).subscribe({
      next:data=>{
        this.holidaylist = data;
        this.pageTitle = data.holidaylistname;
      },
      error:err=>{}
    });


    console.log(this.holidaylist);
   }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      // selectedDate: new FormControl(new Date().toISOString())
      'holiday_name': ['',Validators.required],
      'holiday_start_date': [new Date().toISOString().split(".")[0],Validators.required],
      'holiday_end_date': [new Date().toISOString().split(".")[0],Validators.required],

    },
    {
      validator: this.dateComparisonValidator('holiday_start_date', 'holiday_end_date'),
    }
    );

    console.log(this.selectedSegment);
    this.selectDateBasedOnSegment(this.selectedSegment,this.In_Time2);

  }


  dateComparisonValidator(birthdayControlName: string, expiryControlName: string): ValidatorFn {
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
  this.selectDateBasedOnSegment(this.selectedSegment,this.In_Time2);
 
}

  segmentSelcted(e){
    this.selectedSegment = e.detail.value;
    console.log('Selected segment:', this.selectedSegment);
    
  }


  selectDateBasedOnSegment(segment:string,date:string){
    if(this.selectedSegment === 'start_date'){
      this.In_Time = date;
    }else if(this.selectedSegment === 'end_date'){
      this.Out_Time = date;
    }
  }


  In_Time:any
  In_Time_UTC: any;
  
  InTimeChange(event){
    console.log(event.detail.value);
    this.In_Time = event.detail.value

  }


  Out_Time: any;
  Out_Time_UTC:any;
  OutTimeChange(event){
    console.log(event.detail.value);
    this.Out_Time = event.detail.value;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
 
  onSubmit() {
    const formData = this.myForm.value;
    console.log(formData.holiday_name);    
    this.isLoadingResults = true;

    // const modifiedForm = this.formBuilder.group({
    //   holiday_name:[formData.holiday_name,Validators.required],
    //   holiday_start_date: [this.In_Time,Validators.required],
    //   holiday_end_date:[this.Out_Time,Validators.required],
    // });

    // check form validity also 
    if(this.myForm.valid){
      this.isButtonSubmit = true;
      this.holidayApi
    .addHoliday(this.id, this.myForm.value)
    .subscribe((res: any) => {     
        console.log(res);
        this.isLoadingResults = false;
        return this.modalCtrl.dismiss(res, 'confirm');
       
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      ); 
    }

    // console.log(modifiedForm.value);

         

  }

}
