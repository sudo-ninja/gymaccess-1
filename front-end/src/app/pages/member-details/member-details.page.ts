import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Input, Output, EventEmitter } from '@angular/core';

import { Member } from 'src/app/models/member.model';
import { MemberserviceService } from 'src/app/services/memberservice.service';
import { UserService } from 'src/app/services/user.service';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.page.html',
  styleUrls: ['./member-details.page.scss'],
})
export class MemberDetailsPage implements OnInit {
  // @Input() id: string | undefined;

members: Member[] = [];

member:Member={
_id:'',
m_name:'',
gym_id:'',
email: '',
aadhar:'',
mobile:'',
Emergency_mobile:'',
m_address_lat:'',
m_address_long:'',
memberType:'',
m_joindate:'',
m_enddate:'',
m_validdays:'',
m_intime:'',
m_outtime:'',
m_accesstype:'',
isInviteAccepted:'',
}

isLoadingResults = false;

  constructor(
    public loadingController:LoadingController,
    public alertController :AlertController,
    public router :Router,
    public route :ActivatedRoute,
    public memberApi:MemberserviceService,
    private userApi :UserService,
    private attendApi:AttendanceService,

  ) { }

  ngOnInit() {
    this.getMembers();
  }

  async getMembers(){
    const loading = await this.loadingController.create({
      message: 'Loading....'
    });
    if (this.route.snapshot.paramMap.get('id')==='null'){
      this.presentAlertConfirm('You Are not selecting');
    }else{
      this.isLoadingResults = true;
      await this.memberApi.getMember(this.route.snapshot.paramMap.get('id')).subscribe({
        next:(res)=>{
        // console.log("get product",res._id);
        // console.log(res);
        this.member = res;
        loading.dismiss();
        this.isLoadingResults=false;
      },
      error:(err)=> {
        // console.log(err);
        this.isLoadingResults=false;
        loading.dismiss();
      }
    });
     }
  }


  async presentAlertConfirm(msg:string){
    const alert = await this.alertController.create({
      header :'Warning!',
      message: msg,
      buttons:[
        {
          text : 'Okay',
          handler:()=>{
            this.router.navigate(['/gymtabs/member-list']);
          }
        }
      ]
    });
    await alert.present();
  }

// delet alert 
async presentAlertDelete(msg:string, id:any){
  const alert = await this.alertController.create({
    header :'Warning!',
    message: msg,
    buttons:[
      {
        text : 'Okay',
        handler:async ()=>{
                  // console.log("delet",id);
            this.isLoadingResults= true;
            await this.memberApi.delete(id).subscribe({
            next:(res)=>{
            this.isLoadingResults= false;
            this.attendApi.delete_memberId(this.member._id).subscribe({});
            // delete and set user is member false use update 
            this.userApi.getUserbyEmail(this.member.email).subscribe({
              next:res=>{
                this.userApi.update(res._id,{"isMember":false}).subscribe({
                  next:res=>{}
                });
              }
            });
            this.router.navigate(['/gymtabs/member-list']);
            },
            error:(err)=>{
              // console.log(err);
            this.isLoadingResults= false;
            }
          });
        }
      },
      {
        text : 'Cancel',
        handler:async ()=>{
            this.router.navigate(['/gymtabs/member-list']);
        }
      }
    ]
  });
  await alert.present();
}

  async deleteMember(id:any){
    this.presentAlertDelete("Do you really want to Delete?",id)
    
  }

  editMember(id){
    this.route.snapshot.paramMap.get(id)
    // console.log(id);
    this.router.navigate(['/member-update',id]);
  }

  BacktoList(){
    this.router.navigate(['/gymtabs/member-list'],{replaceUrl:true});
  }

  AddMore(){
    this.router.navigate(['/member-add'],{replaceUrl:true});
  }

}
