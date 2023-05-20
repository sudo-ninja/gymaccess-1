import { Injectable } from '@angular/core';
import {CanLoad, Route, UrlSegment, UrlTree} from '@angular/router';
import { Router } from 'express';
import { Observable } from 'rxjs';

import { Users } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor() { }
  public signIn(userData: Users){
    localStorage.setItem('ACCESS_TOKEN', "access_token");
  }
  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public logout(){
    localStorage.removeItem('ACCESS_TOKEN');
  }


}
