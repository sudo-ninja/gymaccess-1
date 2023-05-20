import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  loggeduserIsAdmin: boolean;

  constructor(
    private router:Router,
    private userApi:UserService,

  ) {
    const UserIsAdmin = localStorage.getItem('UserIsAdmin');
    const UserIsMember = localStorage.getItem('UserIsMember');
    if(UserIsAdmin === 'true'){
      this.loggeduserIsAdmin = true;
      
    }if(UserIsMember === 'false'){
      this.loggeduserIsAdmin = false;
    }
   }

  ngOnInit() {
  }


  logout(){
    // clear all local storage data
    localStorage.clear();
    //if want to clear some perticualr data then use
    // localStorage.removeItem('user'); // this will clear only user data
    //clear all session storage data
    // nevigate to login page 
    this.userApi.deleteToken();
      this.router.navigate(['/login'],{replaceUrl:true});
     
  }
}
