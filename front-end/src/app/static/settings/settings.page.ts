import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  loggeduserIsAdmin: boolean;
  // user for gmail login
  user = null;

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


  async logout(){
    // clear all local storage data
    localStorage.clear();
    this.userApi.deleteToken();
      this.router.navigate(['/login'],{replaceUrl:true});
    //google logout
    await GoogleAuth.signOut();
    this.user = null ;
     
  }
}
