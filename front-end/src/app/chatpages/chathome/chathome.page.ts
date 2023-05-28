import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-chathome',
  templateUrl: './chathome.page.html',
  styleUrls: ['./chathome.page.scss'],
})
export class ChathomePage implements OnInit {

  @ViewChild('new_chat') modal:ModalController;
  @ViewChild('popover') popover:PopoverController;

  segment='chat';
  open_new_chat= false;

   
  // users:Observable<any[]>;
  users=[
    {id:1,name:"manoj",photo:'https://i.pravatar.cc/396'},
    {id:2,name:"noj",photo:'https://i.pravatar.cc/397'},
    {id:3,name:"man",photo:'https://i.pravatar.cc/398'},
  ]

  chatRooms=[
    {id:1,name:"manoj",photo:'https://i.pravatar.cc/396'},
    {id:2,name:"noj",photo:'https://i.pravatar.cc/397'},
    {id:3,name:"man",photo:'https://i.pravatar.cc/398'},
  ]


//   rooms=[
// 1,2,3
//   ]

  constructor(

    private router:Router,
    
  ) { }

  ngOnInit() {
  }

  onSegmentChanged(event){
    console.log(event.detail.value);
  }
  onWillDismiss(event){

  }

  cancel(){
    this.modal.dismiss();
    this.open_new_chat=false;
  }

  newChat(){
    this.open_new_chat=true;
  }

  chat_exit(){
    // as as logout in chat app
    this.popover.dismiss();
  }

  startChat(item){

  }

  getChat(item) {
    this.router.navigate(['/','chathome','chats',item?.id]);
  }
}
