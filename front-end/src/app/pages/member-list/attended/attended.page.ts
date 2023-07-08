import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonDatetime, IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { highlighteDate } from 'src/app/models/highlighteDate';
import { AttendanceService } from 'src/app/services/attendance.service';
import { MemberserviceService } from 'src/app/services/memberservice.service';

@Component({
  selector: 'app-attended',
  templateUrl: './attended.page.html',
  styleUrls: ['./attended.page.scss'],
})
export class AttendedPage implements OnInit {
  start_Date: string;
  end_Date: string;
  attendanceDays: any;
  highlightedDates:any ;
  highlightedDates_:highlighteDate[]=[];

  @ViewChild(IonDatetime) datetime:IonDatetime;
  @ViewChild(IonModal) modal: IonModal;
  id: any;

  constructor(
    private attendApi:AttendanceService,
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public loadingController:LoadingController,
    public route :ActivatedRoute,

    public memberApi:MemberserviceService,
  

  ) { 
    // this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit() {
    console.log(this.id);
    this.attenRecord(this.id);
  }

  async attenRecord(id){   
    this.CallmemberDates(id);
    // now get attendance and save them in highlighed 
    this.getAttendance(id);      
    }

    // Startdate and end date of perticular memers
async CallmemberDates(id){
  const loading = await this.loadingController.create({
    message: 'Loading....'
  });

  await loading.present();
  this.memberApi.getMember(id).subscribe({
    next:res=>{
      this.start_Date = this.toISOStringWithTimezone(new Date(+res.m_startdate));
      this.end_Date = this.toISOStringWithTimezone(new Date(+res.m_enddate));
      // console.log(this.start_Date , this.end_Date);
      loading.dismiss();
    },
    error:error=>{
      console.log(error);
      loading.dismiss();
    }
  });
}

//get attendance by ID
async getAttendance(id){
  const loading = await this.loadingController.create({
    message: 'Loading....'
  });
  await loading.present();
  this.attendApi.getMemberAttendance(id).subscribe({
    next:res=>{      
      this.attendanceDays = res;
      console.log(this.attendanceDays); 
      for (let i = 0; i < this.attendanceDays.length; i++) {
        this.highlightedDates_.push(
          {
            date:this.toISOStringWithTimezone(new Date(+this.attendanceDays[i].checkin_date)).split("T")[0],
            textColor: 'var(--ion-color-warning-contrast)',
            backgroundColor:'var(--ion-color-warning)',
          }
        );
       }      
      this.highlightedDates = this.highlightedDates_;
      console.log(this.highlightedDates_);
      loading.dismiss();
    },
    error:err=>{
      console.log(err);
      loading.dismiss();
    },
  });

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


//ion date time dismiss button 
close(){
  this.datetime.cancel(true);
  //set highligthed date array empty
  this.highlightedDates=[];
  // this.modal.dismiss(true);
}

// as modal can be dismiss only cant go back to page so use this
cancel() {
  return this.modalCtrl.dismiss(null, 'cancel');
}

confirm() {
  return this.modalCtrl.dismiss(null, 'confirm');
}

// date touched 
dateTouched(value:any){
  // this.isModalOpen = false;
  console.log("date touched", value);
}

}
