import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { AlertController, GestureController, LoadingController, ModalController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import {Mcontrol} from 'src/app/models/mcontrol'

import {MemberserviceService}  from 'src/app/services/memberservice.service';
import { MemberUpdatePage } from '../member-update/member-update.page';
import { MembercontrolPage } from '../membercontrol/membercontrol.page';

import{McontrolService} from 'src/app/services/mcontrol.service' // to control invite code 
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// swiper 



@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.page.html',
  styleUrls: ['./member-list.page.scss'],
})
export class MemberListPage implements OnInit {
  // @ViewChildren(IonCard,{read:ElementRef})
  BalanceDays_ = localStorage.getItem('balanceDays');

  members: Member[] = [];
  mcontrols: Mcontrol[] =[];
  _id :string; // This is an observable
  _email:any;
  _memberid:any;
  _mobile:any;
  _duration:any;
  _invitationcode:any;

  searchField: FormControl;

  //range value for slider bar to show how much % left 
  RangeValue:Number;
  


  inviteControlForm!: FormGroup;
  memberForm!:FormGroup;
  isLoadingResults = false;
  member: Member;
  mcontrol : Mcontrol;
  _gym_id:any;
  _notAdmin: boolean = true;

  inviteMemberMail:any;
  inviteContolAlertMessage:any;

  inviteContolAlertSubHeaderMessage:any;
  inviteControlHeaderMessage:any;
  invitaionCodeGenerated:Boolean = false;
  invitaionAccepted:any;
  invitaionButtonDisabled:Boolean = false;

  loggeduserEmail:any;

  searchTerm: string;

  tempid:any;
  tempDuration:any;
  tempEmail:any;
  memberId:any;

  

  public results = [...this.members];


  constructor(
    private gestureCtrl: GestureController,
    public loadingController:LoadingController,
    public router :Router,
    public route :ActivatedRoute,
    
    private cd: ChangeDetectorRef, 
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,

    private formBuilder: FormBuilder,
    private inviteControlApi:McontrolService,
    private mcontrol_s: McontrolService,
    public memberApi:MemberserviceService,

  ) { 
    const GYM_ID = localStorage.getItem('GYM_ID');
    this._gym_id=GYM_ID;
    console.log(this._gym_id);
    this.searchField = new FormControl('');
  }

  ngOnInit() {
    
    // get member associated with this gym only
    this.getMembers();
    // const searchTerm = this.searchField.valueChanges.pipe(
    //   startWith(this.searchField.value));
    console.log(this.searchTerm);
    this.memberControl(); // here its call so that patch value can work

    
    
   }

   handleChange(event) {
    const query = event.target.value.toLowerCase();
    console.log(query);
    // this.results = this.members.filter(d => d.indexOf(query) > -1);
  }


async inviteControl(){
  this.inviteControlForm = this.formBuilder.group({
    'member_id' : ['', Validators.required],
    'email' : ['', Validators.required],
    'mobile': ['', [
      Validators.required,
      // Validators.minLength(10),
      // Validators.maxLength(13),
      // Validators.pattern('^[0-9]*$')
    ]
    ],
    'inviteCode':['', Validators.required],
    'duration':['',Validators.required],
    }); 
} 

async memberControl(){
    this.memberForm=this.formBuilder.group({
      'isInviteAccepted':[]
      /// was planning to get three state varibale .. like invite accepted , true , false , pending..
    });
}

async getMembers(){
  const loading = await this.loadingController.create({
    message: 'Loading....'
  });
  await loading.present();
  console.log(this._gym_id);
  await this.memberApi.wildSearch(this._gym_id)
  .subscribe(res=>{
    this.members=res;
    console.log(this.members);
    localStorage.setItem('thisMember',JSON.stringify(res));
    loading.dismiss();
  }),err=>{
    console.log(err);
    loading.dismiss();
    }
    
  }

  // drop(event:CdkDragDrop<string[]>){
  //   moveItemInArray(this.members,event.previousIndex,event.currentIndex);
  // }

  addProduct() {
    this.router.navigate(['/member-add']);
  }

  async updateMember(uid:string) {
      const modal = await this.modalCtrl.create({
      component: MemberUpdatePage,
      componentProps:{id:uid},
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8,      
    });
    console.log(res => {
      this.memberApi.getMember(res.id);});
    await modal.present();
  }

  async updateMemberControl(uid:string) {
    const modal = await this.modalCtrl.create({
    component: MembercontrolPage,
    componentProps:{id:uid},
    breakpoints: [0, 0.5, 0.8],
    initialBreakpoint: 0.8,      
  });
  console.log(res => {
    this.memberApi.getMember(res.id);
  });
  await modal.present();
}

  async inviteMember(uid:string){
   console.log(uid);
   this.memberApi.getMember(uid).subscribe((data)=>{
    try {
      console.log(data);
      console.log(data.isInviteAccepted);
      console.log(data.email); // this email will search in member control DB if already this exist 
      // once invite accepted or time passed lets delet this from DB so one time only one code is there
      this.invitaionAccepted = data.isInviteAccepted;

    if(this.invitaionAccepted==="Yes"){
        this.presentAlert('Invitaion Accepted','Already Member','');
        console.log("disable invitaion button");
        this.invitaionButtonDisabled=true;
     }else if(this.invitaionAccepted==="Pending")
     {
        console.log("call function to get alreay generated code");
        this.CheckIfInvited(uid);
     }
     else{  
          this.CodeAlert(uid,'Invitaion Code','Please Ask Member to Enter this code in JOIN GYM input *** Code Valid for 3 Days *** ');
      };
      } catch (error) {
      throw error;
    }    
   });
   

  //  if(this.mcontrol_s.getMcontrolEmail(this.inviteMemberMail)){
    
  //   this.inviteContolAlertSubHeaderMessage = "iCode";
  //   this.inviteControlHeaderMessage = "Invitaion Code";
  //   this.inviteContolAlertMessage = 'Please ask member to enter this code in "JOIN GYM", ***Valid For 1 Hours***';
  //  }else{
  //   this.inviteControlHeaderMessage = "Invitaion Acceptance Pending !";
  //   this.inviteContolAlertSubHeaderMessage = 'Already Invitaion Code Generted';
  //   this.inviteContolAlertMessage = "Please Ask Member to Enter Code after Clicking in JOIN GYM";
  //   this.invitaionCodeGenerated = true;
  //  }
  //   if(this.invitaionCodeGenerated){
  //     console.log("in 164 loop");
  //   }
      

  }



  async presentAlert(header:string,subheader:string, message:string) {
    const alert = await this.alertCtrl.create({
      header:header,
      subHeader: subheader,
      message:message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async CodeAlert(uid:any,header:string,message:string){

    var iCode = Math.floor(1000000*Math.random());
    console.log(iCode);
    this._invitationcode = iCode;
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: this._invitationcode.toString(),
      message: message,
      buttons: [
        {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          this.inviteControl(); // invite control form from FB
          this.memberApi.getMember(uid).subscribe(res=>
            {
            this.member=res;
            console.log(this.member);
            this._duration=Date.now()+(3*60*60*1000);
            console.log('in handelr = ',this._email,this._duration,this._invitationcode,this._memberid,this._mobile)
            this.inviteControlForm.patchValue({
              member_id : this.member._id,
              email : this.member.email,
              mobile: this.member.mobile,
              inviteCode:this._invitationcode,
              duration:this._duration,
            }); 

            // this.memberForm.patchValue({
            //   isInviteAccepted:"Pending"
            // });

            this.inviteControlApi.addMcontrol (this.inviteControlForm.value)
            .subscribe((res: any) => {
                const id = res._id;
                console.log('Added invitation code');
                console.log(this.member.email);
                this.setInvitaion(this.member.email,"Pending");
              }, (err: any) => {
                console.log(err)
              });
              
            }),err=>{
          console.log(err);   
           } },
      }
      ],
      
    });    
 
    await alert.present();

  }
 
  handleRefresh(event) {
    setTimeout(() => {
      this.getMembers();
      event.target.complete();
    }, 2000);
  };

  setInvitaion(email:any,pending:any){
  
    console.log("in invitaion code setup")
    this.memberApi.getMemberByEmail(email).subscribe((data: any)=>{
      this.memberId = data._id
      // console.log(this.memberId);
      this.memberForm.patchValue(
        {
          isInviteAccepted:pending // Status Change to Pending
        });

    // some error as update PUT not getting ID
    console.log(this.memberId);
    this.memberApi.update(this.memberId,this.memberForm.value).subscribe((res: any) => {
      const id = res._id;
      console.log('invitaion type change to =',res.isInviteAccepted);
    }, (err: any) => {
      console.log(err)
    });
        
    });    
    
  }

  async basicShare(){
    await Share.share({
      title:' This will appear in subject  ',
      text:' this will appear in message body',
      url:'url link from here '
    });
  }

  CheckIfInvited(uID:any)
  {
    this.memberApi.getMember(uID).subscribe((res:any)=>{
      try {
        this.tempEmail = res.email;
        console.log(this.tempEmail);
        this.inviteControlApi.getMcontrolEmail(this.tempEmail).subscribe((res:any)=>{
          try {
          console.log(res);
          if(res.inviteCode)
          {
            console.log("already invited..get invitaion code from DB only")
            console.log(res.inviteCode);
            this.presentAlert(res.inviteCode,"Already Invited","Invitaion Acceptance is Still Pending!!");
            // return res.invitationCode;
          }else
          {
            console.log("not yet invited or invitation expired");
            // this.CodeAlert(uID,'Invitation Code','Please Ask Member to Enter this code in JOIN GYM input *** Code Valid for 3 Days *** ');
    
            // return false;
          }
          } catch (error) {
            throw error;
          }
        });
      } catch (error) {
        throw error;
      }
    });       

    
  }

  deleteCodeIfacceptedOrExpired(email:any,ifAccepted:boolean){    
    this.inviteControlApi.getMcontrolEmail(email).subscribe((res:any)=>{
      try {
        this.tempid=res._id;
        this.tempDuration = res.duration;
      } catch (error) {
        throw error;
      }
    });
    if(ifAccepted){
      this.inviteControlApi.delete(this.tempid);      
    }else{
      if(Date.now()>this.tempDuration){
        this.inviteControlApi.delete(this.tempid);
      }return;
    }
  }
 

  onTap(event: any) {
    console.log('tap: ', event);
  }

  onDoubleTap(event: any) {
    console.log('double tap: ', event);
  }

  onPress(event: any) {
    console.log('press: ', event);
  }

  onSwipe(event:any) {
    console.log(event);    
    if(event.dirX==="right"){
      console.log(event.dirX);
      // this.updateMember(uid);
    }
  }
  
  CallTel(tel) {
    window.location.href = 'tel:'+ tel;
}

rangeValue(endate:any,balanceDays:any){
  let currentDate = new Date();
  endate = new Date(endate);
  return  Math.floor((Math.floor((Date.UTC(endate.getFullYear(), endate.getMonth(), endate.getDate())-Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) /(1000 * 60 * 60 * 24)))/balanceDays);

  // console.log();
    // console.log(((new Date(endate)).getTime()-Date.now()));
    // console.log(balanceDays);

}

}
