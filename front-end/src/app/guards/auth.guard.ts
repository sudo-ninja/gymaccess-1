import { NavController } from '@ionic/angular';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuardService } from './auth/auth-guard.service';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
              private authService: AuthGuardService,
              private userService :UserService,
              private router :Router,
               ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(!this.userService.isLoggedIn()){
        this.router.navigateByUrl('/login',{replaceUrl:true});
        this.userService.deleteToken();
        return false;
      }
      return true;
  }
  
}

// constructor(private permissions: Permissions, private currentUser: UserToken) {}

// canActivate(
// route: ActivatedRouteSnapshot,
// state: RouterStateSnapshot
// ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
// return this.permissions.canActivate(this.currentUser, route.params.id);
// }
// }
