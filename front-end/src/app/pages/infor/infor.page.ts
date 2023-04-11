import { Component, OnInit } from '@angular/core';

//for gym select
import { GymService } from 'src/app/services/gym.service';
import { Gym } from 'src/app/models/gym.model';
// to get members infor for perticular gymid
import { MemberserviceService } from 'src/app/services/memberservice.service';
// to store once fetched data from DB to store locally
import { StorageService } from 'src/app/services/storage.service';



@Component({
  selector: 'app-infor',
  templateUrl: './infor.page.html',
  styleUrls: ['./infor.page.scss'],
})
export class InforPage implements OnInit {

  // for gym selection 
  gyms:Gym[]=[];
  currentGym :any;
  MyDefaultGymValue:any;
  compareWith:any;
  _gym_id:any;
  gymsResult:any;

  // to get members count
  memberResults:any;
  totalMembers:any;
  paidMebers:any;
  freeMembers:any;
  goingtoExpireMembers:any;



  constructor(
    public gymApi:GymService, // for Gym selection 
    public memberApi:MemberserviceService, // to get total numer of members
  // to store daa once fetch
    private storageService :StorageService, // storage service is used insted of get set method

    ) { 
    // for select default gym in gym selector
    const defaultGym = localStorage.getItem('DefaultGym'); // got default GYM value from Gym list page
    this.MyDefaultGymValue = (JSON.parse(defaultGym))._id;
    this._gym_id=this.MyDefaultGymValue;
    console.log(this._gym_id); // this default Gym got from Gym List page ( first added Gym become Default Gym)
    this.storageService.get('gymList').then((val)=>{
      console.log(val); // here we store once fetched gym data
          this.gymsResult = val;
          console.log(this.gymsResult);
          this.gyms = this.gymsResult;
    });

    this.storageService.get('membersList').then((val)=>{
      console.log(val); // here we store once fetched gym data
          this.memberResults = val;
          console.log(this.memberResults.length);
          this.totalMembers = this.memberResults.length;
          if(this.memberResults.m_accesstype=="free")
          {
            
          }
          // this.paidMebers = 
    });


    // 
  }

  ngOnInit() {
  }

  logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

  selecthandleChange(ev){
    this.currentGym = ev.target.value;
    this.MyDefaultGymValue = ev.target.value;
    // console.log(this.currentGym);
    this._gym_id = this.currentGym;
    console.log(this._gym_id);
    // this.getMembers();
    this.compareWithFn(this._gym_id,ev.target.value);
    }

    compareWithFn(o1, o2) {
      return o1 === o2;
    };

}
