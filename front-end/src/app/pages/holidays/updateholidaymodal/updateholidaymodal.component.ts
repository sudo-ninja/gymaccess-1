import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { HolidayService } from 'src/app/services/holiday.service';

@Component({
  selector: 'app-updateholidaymodal',
  templateUrl: './updateholidaymodal.component.html',
  styleUrls: ['./updateholidaymodal.component.scss'],
})
export class UpdateholidaymodalComponent  implements OnInit {

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
  selectedDate: string = new Date().toISOString();
  In_Time2:any
  list_id: any;
  inTimeTouched: boolean;
  outTimeTouched: boolean;
  defaultRes: any;

  constructor(
    private alertCtrl: AlertController,    
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private holidayApi:HolidayService,  
    private dataTransferservice:DatatransferService,
  ) { 
    this.dataFromPage = this.dataTransferservice.getHoliday();
    console.log(this.dataFromPage);
    this.list_id = this.dataFromPage.list_id; // this is holiday list id
    // this.dayNumber = this.dataFromPage.day.day_number;
    this.id = this.dataFromPage.id // this is holiday id 
    
    // this.In_Time2 = this.In_Time;
    // this.getHoliday(this.id);
    // this.selectDateBasedOnSegment(this.selectedSegment,this.In_Time2);
  }
  // ngOnChange() {
  //   this.getHoliday(this.id);
  // }
  ngOnInit() {
   
    this.myForm = this.formBuilder.group({
      'holiday_name': ['',Validators.required],
      'holiday_start_date': ['',Validators.required],
      'holiday_end_date': ['',Validators.required],

    },
    {
      validator: this.dateComparisonValidator('holiday_start_date', 'holiday_end_date'),
    }
    );
    console.log(this.selectedSegment);
    // this.selectDateBasedOnSegment(this.selectedSegment,this.In_Time);
     this.getHoliday(this.id);
  }

 

  async getHoliday(id){
    this.holidayApi.getSpecificHoliday(id).subscribe({
      next:res=>{
        console.log(res);
        this.defaultRes=res; // same page closed
        this.In_Time = res.holiday_start_date;
        // this.In_Time = '2023-11-25T14:57:14'
        this.Out_Time = res.holiday_end_date;
        this.pageTitle = res.holiday_name;
        this.myForm.setValue({
          holiday_name:res.holiday_name,
          holiday_start_date:res.holiday_start_date,
          holiday_end_date:res.holiday_end_date,
        });
        console.log(this.In_Time);
        // this.selectDateBasedOnSegment(this.selectedSegment,new Date(this.In_Time).toISOString());
        // why firts time code running perfect but next time not ??
      },
      error:err=>{}
    });

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
    // this.getHoliday(this.id);
    // this.selectDateBasedOnSegment(this.selectedSegment,this.In_Time2);
   
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
    this.inTimeTouched = true; // to know if its event got changed or not
    console.log(event.detail.value);
    this.In_Time = event.detail.value
  }


  Out_Time: any;
  Out_Time_UTC:any;
  OutTimeChange(event){
    this.outTimeTouched = true; // to know if its event got changed or not
    console.log(event.detail.value);
    this.Out_Time = event.detail.value;

  }


  

  cancel() {
    return this.modalCtrl.dismiss(this.defaultRes, 'cancel');
  }

  onSubmit() {
    const formData = this.myForm.value;
    // console.log(formData.holiday_name);    
    this.isLoadingResults = true;  
    // console.log(this.myForm.value);
    // check form validity also 
    if(this.myForm.valid){
      this.isButtonSubmit = true;
      this.holidayApi
    .modifyHoliday(this.list_id,this.id,this.myForm.value)
    .subscribe((res: any) => {     
        // console.log(res);
        this.isLoadingResults = false;
        return this.modalCtrl.dismiss(res.holidays, 'confirm');
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      ); 
    }//else toast error

    // console.log(modifiedForm.value);

         

  }

}
