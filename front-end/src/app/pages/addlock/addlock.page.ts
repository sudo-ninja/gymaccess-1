import { Component, OnInit } from '@angular/core';

//to know network parameter 
import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-addlock',
  templateUrl: './addlock.page.html',
  styleUrls: ['./addlock.page.scss'],
})
export class AddlockPage implements OnInit {

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
  }

 




}
