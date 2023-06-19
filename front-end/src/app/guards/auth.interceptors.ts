//httpConfig.interceptor.ts
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { tap,map, catchError } from 'rxjs/operators';
  import { Injectable } from '@angular/core';

  import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private userService:UserService,
                private router : Router,) { }
  
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(request.headers.get('NoAuth'))
            return next.handle(request.clone());
        else{
            const clonereq = request.clone();
            headers:request.headers.set("Authorization","Bearer "+this.userService.getToken());
            return next.handle(clonereq).pipe(
                tap(
                    event=>{},
                    err=>{
                        if(err.error.auth == false){
                            this.router.navigateByUrl('/login',{replaceUrl:true});
                        }
                    }
                )
            );
        }
  
    //   const token = "my-token-string-from-server";
  
    //   //Authentication by setting header with token value
    //   if (token) {
    //     request = request.clone({
    //       setHeaders: {
    //         'Authorization': token
    //       }
    //     });
    //   }
  
    //   if (!request.headers.has('Content-Type')) {
    //     request = request.clone({
    //       setHeaders: {
    //         'content-type': 'application/json'
    //       }
    //     });
    //   }
  
    //   request = request.clone({
    //     headers: request.headers.set('Accept', 'application/json')
    //   });
  
    //   return next.handle(request).pipe(
    //     map((event: HttpEvent<any>) => {
    //       if (event instanceof HttpResponse) {
    //         console.log('event--->>>', event);
    //       }
    //       return event;
    //     }),
    //     catchError((error: HttpErrorResponse) => {
    //       console.error(error);
    //       return throwError(error);
    //     }));
    }
  
  
  }