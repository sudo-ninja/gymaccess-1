import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { AlertController, GestureController, LoadingController, ModalController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';

import {MemberserviceService}  from 'src/app/services/memberservice.service';
import { MemberUpdatePage } from '../member-update/member-update.page';
import { MembercontrolPage } from '../membercontrol/membercontrol.page';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.page.html',
  styleUrls: ['./member-list.page.scss'],
})
export class MemberListPage implements OnInit {
  // @ViewChildren(IonCard,{read:ElementRef})

  members: Member[] = [];
  _id :string; // This is an observable

  constructor(
    private gestureCtrl: GestureController,
    public loadingController:LoadingController,
    public router :Router,
    public route :ActivatedRoute,
    public memberApi:MemberserviceService,
    private cd: ChangeDetectorRef, 
    private alertCtrl: AlertController, 
    private modalCtrl: ModalController,

  ) { 
    
  }

  ngOnInit() {
    this.getMembers();
    
  }


async getMembers(){
  const loading = await this.loadingController.create({
    message: 'Loading....'
  });
  await loading.present();
  await this.memberApi.getAll()
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
    this.memberApi.getMember(res.id);});
  await modal.present();
}

  async inviteMember(uid:string){
   console.log(uid);
    var iCode = Math.floor(1000000*Math.random());
      console.log(iCode);
      const alert = await this.alertCtrl.create({
        header: 'Invitation Code',
        subHeader: iCode.toString(),
        message: 'Please ask member to enter this code in "JOIN GYM", ***Valid For 1 Hours***',
        buttons: ['OK'],
      });  
      await alert.present();

      // here need to save this generated number and pass to DB using formbuilder
      /* say Icode = iCode
             Duration = 1 Hr
             generated = date().now()
             email = uid.email
             mobile = uid.mobile
             accepted = false
             gymID= gymid; 

      */
  }

 

 

  async basicShare(){
    await Share.share({
      title:' This will appear in subject  ',
      text:' this will appear in message body',
      url:'url link from here '
    });
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

  onSwipe(event: any) {
    console.log(event);
  }
  

}
