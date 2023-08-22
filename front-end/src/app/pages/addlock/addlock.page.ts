import { Component, OnInit } from '@angular/core';

//to know network parameter 
import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';
import { Network } from '@capacitor/network';

// for range 
import { RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';

@Component({
  selector: 'app-addlock',
  templateUrl: './addlock.page.html',
  styleUrls: ['./addlock.page.scss'],
})
export class AddlockPage implements OnInit {
  lock_id: any;

  public isToggled: boolean;

  constructor(  private networkInterface: NetworkInterface ) {
    this.networkInterface.getWiFiIPAddress()
    .then(address => console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`))
    .catch(error => console.error(`Unable to get IP: ${error}`));

  this.networkInterface.getCarrierIPAddress()
    .then(address => console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`))
    .catch(error => console.error(`Unable to get IP: ${error}`));

  const url = 'www.github.com';
  this.networkInterface.getHttpProxyInformation(url)
    .then(proxy => console.info(`Type: ${proxy.type}, Host: ${proxy.host}, Port: ${proxy.port}`))
    .catch(error => console.error(`Unable to get proxy info: ${error}`));

     }

  ngOnInit() {

    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
    });

    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
    
      console.log('Network status:', status);
    };

    // this.showPassageMode(this.lock_id);
  }


  logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }


  currentLock :any;
  DefaultLockValue:any = 1; //passed here ID 

locks = [
    {
      id: 1,
      name: 'Rim Lock',
      type: 'rimLock',
    },
    {
      id: 2,
      name: 'Solenoid Lock',
      type: 'rimlock',
    },
    {
      id: 3,
      name: 'Motorised Lock',
      type: 'motor',
    },
    {
      id: 4,
      name: 'EM Lock',
      type: 'em',
    },
    {
      id: 5,
      name:'Drop Bolt Lock',
      type: 'em',
    },
    {
      id: 6,
      name: 'Glass Door Bolt Lock',
      type: 'em',
    },
    
  ];

  compareWith(o1, o2) {
    return  o1 === o2;
  }

  selecthandleChange(ev) {
    this.currentLock = ev.target.value;
    console.log("this current lock ****",this.currentLock);
    // this.DefaultLockValue = ev.target.value;
    console.log(ev.target.value);
    this.lock_id = this.currentLock; // this is changing defalt GYM ID for admin app as _gym_id is useed as gymID in local storage 
    console.log("this lock_id *****",this.lock_id);
    this.showPassageMode(this.lock_id);
     
// this.getMembers();
  }

  showPassage:boolean = false;
  showOpeningRange:boolean=false;
  // based on lock type show div for opening time selection and passage mode 
  showPassageMode(locktype){
    console.log("lock type in show passage mode function",locktype);
    if((locktype == 1) || (locktype == 2)){
      this.showPassage = false;
      this.showOpeningRange =false;
      console.log("this.showPassage",this.showPassage);
    }else if((locktype == 4 )|| (locktype == 5) || (locktype ==6)){
      this.showPassage = true;
      this.showOpeningRange = true;
      console.log("this .show passage in 4 5 6",this.showPassage);
    } else if(locktype == 3 ){
      this.showPassage = true;
      this.showOpeningRange = false;
    }
  }


  handleChange(e) {
    this.pushLog('ionChange fired with value: ' + e.detail.value);
  }

  moveStart: RangeValue;
  moveEnd: RangeValue;

  onIonKnobMoveStart(ev: Event) {
    this.moveStart = (ev as RangeCustomEvent).detail.value;
    console.log("start knob ",ev);
  }

   pinFormatter(value: number) {
    return `${value} Second`;
  }

  onIonKnobMoveEnd(ev: Event) {
    this.moveEnd = (ev as RangeCustomEvent).detail.value;
    console.log("end knob ",ev);
  }

  toggleButton(ev){
    console.log("Toggle Button : -- ", ev    );
    if(this.lock_id == 3){
      this.showOpeningRange = false;
    }
    if(ev.detail.checked = true){
            console.log(this.showOpeningRange , this.showPassage);
    }else {
      console.log("🚀 ~ file: addlock.page.ts:153 ~ AddlockPage ~ toggleButton ~ el̥se:",this.showOpeningRange,this.showPassage);

    }
    
  }

  notifyAndUpdateIsToggled(event){
    console.log("Toggled: "+ this.isToggled,"Event ", event); 
    if(event == true){
      if(this.showOpeningRange){
      this.showOpeningRange = false;}

      // this.showOpeningRange = !event;
      // console.log((this.showPassage));
    }else {
      if(this.lock_id == 3){
        this.showOpeningRange = false;
      }else{
      this.showOpeningRange = !event;}
      // console.log("🚀 ~ file: addlock.page.ts:153 ~ AddlockPage ~ toggleButton ~ el̥se:",(this.showOpeningRange && this.showPassage));

    }

  }
 




}
