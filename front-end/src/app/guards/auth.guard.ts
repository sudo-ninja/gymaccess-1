import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
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
