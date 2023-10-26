import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

// get service call 
import { HolidayService } from 'src/app/services/holiday.service';
import { StorageService } from 'src/app/services/storage.service';
import { Holiday } from 'src/app/models/holiday';



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
  gym_id:any="gymid";
  gym_name_existing:any="gym_name_existing";
  holidayListid: any;
  holidaylist_name_added: any;
  fullholiday_list:any =[];
  holidays_db:any=[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService, // storage service is used insted of get set method
    private holidayApi : HolidayService,
    private alertCtrl: AlertController,

  ) { }

  ngOnInit() {
    // This holiday form will take data and update it
    // this.holidayForm = this.formBuilder.group({
    //   gymid:[''],
    //   gym_name:[''],
    //   holidaylistname:[''],
    //   h_name:[''],
    //   h_startdate: [''],
    //   h_enddate: [''],
    // });

    // this.startDateValue = this.toISOStringWithTimezone(Date.now()); // set default Date value as of today 
    // this.endDateValue = this.toISOStringWithTimezone(Date.now()); // set default date value as of today 
    // this.holidayApi.queryHolidaylist({"gymid":"gymid"}).subscribe((res:any)=>{
    //   console.log(res);
    //   this.fullholiday_list = res;
    //   this.holidays_db = res.holidays;
    // });

  }

  ionViewWillEnter(){
    // this.holidayApi.queryHolidaylist({"gymid":"gymid"}).subscribe((res:any)=>{
    //   console.log(res);
    //   this.fullholiday_list = res;
    //         this.holidays_db = res.holidays;

    // });
    
  }

  showlist(event){
    console.log(event);
    this.isShowList = true;
  }

  addHoliday(event,listid){
    console.log(event);
    // if (!this.holidayForm.valid) {
      // return false;
    // }else{
      this.holidayApi.addHoliday(listid,{    
        "holiday_name":"holi",
        "holiday_start_date":589478956,
        "holiday_end_date":564789569    
    }).subscribe((res:any)=>{
        console.log(res);
        this.holidayListid = res._id;
        this.gym_id = res.gymid;
        this.gym_name_existing = res.gym_name;
        this.holidaylist_name_added = res.holidaylistname;
      });
    // }

  }

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() { // same working as onFormsubmit
    // this.submitted = true; 
    this.holidayForm.patchValue({
      // gym_address_lat :this.gymLAT,
      // gym_address_long :this.gymLNG,
    });        
    console.log(this.holidayForm.value);     
    if (!this.holidayForm.valid) {
      return false;
    } else {
      // return this.holidayApi.addHolidaylist(this.holidayForm.value).subscribe((res: any) => {
      //   // this.gymId = res._id;
      //   // this.gymIdName = res.gym_name;
      //   // localStorage.setItem('ID',JSON.stringify(id));
      //   // this.isLoadingResults = false;
      // // localStorage.setItem('GYM',JSON.stringify(res)) // trick use to transfer added gym info gym list page
      
      // this.storageService.store('gymList', res);
      // // console.log(data[0].gym_name); // use this info to make default select GYM value and refer this further https://forum.ionicframework.com/t/ion-select-and-default-values-ionic-4-solved/177550/5
      // localStorage.setItem('DefaultGym', JSON.stringify(res[0]));
      // /********************************************************* */
      // // logic added if any login user add GYM it means he is admin for that gym 
      // // if gym successfully added with gym ID then user detail to be added in Gym Admin
      // //as Gym Admin with Free access and with linked gym ID without any scan 
      // //just using access button,
      // /********************************************************** */
      //     this.updateUserToAdmin();
      //     this.adminAdd();      
      //     // patch value to admin form
      //      this.adminForm.patchValue({
      //        gym_id : this.gymId,
      //        user_id : this.loggeduser._id,
      //        mobile : this.loggeduser.mobile,
      //        email: this.loggeduser.email,
      //      });
      //     this.gymadminApi.addGymadmin(this.adminForm.value).subscribe((res)=>{
      //       console.log(res);
      //     });
      //     this.router.navigateByUrl("/gym-list",{replaceUrl:true}); 
     
      //  },(err: any) => {
      //     console.log(err);
      //     // this.isLoadingResults = false;
      //   });
    }

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
    console.log("start date",event.detail.value);
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
        console.log("end date",event.detail.value);
    this.End_Date_UTC = Date.parse(event.detail.value);
    console.log("end date",this.End_Date_UTC);
    this.End_Date = this.toISOStringWithTimezone(new Date(this.End_Date_UTC))
  }

  async addHolidaylistAlert() {
    const alert = await this.alertCtrl.create({
      mode:'ios',
      header: 'Please enter Holiday List Name',
      buttons: [
                {
                  text: 'Ok',
                  handler: (alertData) => { //takes the data 
                      const hlName = alertData.holidaylist_name;
                      console.log(hlName);
                      this.holidayForm.patchValue({
                        gymid: this.gym_id,
                        gym_name: this.gym_name_existing,
                        holidaylistname:hlName,
                        });
                            this.holidayApi.addlistName(this.holidayForm.value).subscribe((res:any)=>{
                              console.log(res);
                            })

                            this.holidayApi.queryHolidaylist({"gymid":"gymid"}).subscribe((res:any)=>{
                              console.log(res);
                              this.fullholiday_list = res;
                                    this.holidays_db = res.holidays;

                            });
                        }
                }           
            ],
      inputs: [
        {
          name:'holidaylist_name',
          placeholder: 'holiday list name',
          attributes: {
                        minlength: 6,
                      },
        },
      ],
    });

    await alert.present();
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


  async addNewHoliday(){

  }


  searchTerm: string = '';
  filterHolidays: any[] = this.fullholiday_list;

  searchItems() {
    this.filterHolidays = this.fullholiday_list.filter(product => {
      return product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  handleRefresh(event) {
    setTimeout(() => {
      // this.getGyms(this.loggeduser._id);
      event.target.complete();
    }, 2000);
  };

}
