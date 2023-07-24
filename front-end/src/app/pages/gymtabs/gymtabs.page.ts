import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
// import { IonTab } from '@ionic/core/components';
import {AlertButton} from "@ionic/core";
import { GymService } from 'src/app/services/gym.service';

import {MemberserviceService}  from 'src/app/services/memberservice.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-gymtabs',
  templateUrl: './gymtabs.page.html',
  styleUrls: ['./gymtabs.page.scss'],
})
export class GymtabsPage implements OnInit {

  selectedTab:any;
  @ViewChild('gymtabs',{static:false}) tabs: IonTabs;
  _gym_id: any;
  loadMembers_P: any;
  loggeduser: any;

  constructor( 
    public gymApi:GymService,
    public memberApi:MemberserviceService,
    // to store data
    private storageService :StorageService, // storage service is used insted of get set method
) { 
  const user = localStorage.getItem('User'); // collected user detail from login
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);
}

  ngOnInit() {
  }

  setCurrentTab(){
    this.selectedTab = this.tabs.getSelected();
    console.log(this.selectedTab);
  }

  // ionViewDidEnter(){
  //   console.log("ion view did enter");
  // }

  // ionViewWillLeave(){
  //   console.log("ion view will leave");
  // }

  // ionViewDidLeave(){
  //   console.log("ion view did leave");
  // }

  ionViewWillEnter()  {    
    
    console.log("ION VIEW WILL ENTER");
    // get member associated with this gym only
    this.getMembers();
    this.getGyms();
   }

   async getMembers(){   
    this._gym_id = localStorage.getItem('gymID');
    console.log("Data coming from gym Tab page");    
    this.memberApi.wildSearch(this._gym_id)
    .subscribe(res1=>{
      // console.log(res1.slice());    
    }),err=>{
      // console.log(err);      
      }      
    }

  async getGyms(){
    this.gymApi.wildSearch(this.loggeduser._id).subscribe(
      (data:any)=>{
        // console.log(data.slice());
        this.storageService.get('gymlist').then(value=>{
          // console.log(value);
        });
        // this.gyms = data; // from here passing data to gym selector  for list of gyms   
    }
    );
  }
}
