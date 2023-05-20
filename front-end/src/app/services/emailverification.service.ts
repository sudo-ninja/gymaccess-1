import { Injectable } from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import{Users} from '../models/user.model'
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EmailverificationService {
  url:string= 'http://localhost:3000/api/v1'

  constructor(
    private http:HttpClient,
    private alertCtrl: AlertController,) { }

    signupEmail(body:any): Observable<any>{
      console.log(body);
      let url = `${this.url}/email_verification/signup`;
      return this.http.post(url,body).pipe(tap((dat:any)=>console.log(`Verified =${dat.verified }`)),
      catchError(this.errorMgmt));
    }  

  verifyEmail(body:any): Observable<any>{
    console.log(body);
    let url = `${this.url}/email_verification/verify`;
    return this.http.post(url,body).pipe(tap((dat:any)=>console.log(`Verified =${dat.verified }`)),
    catchError(this.errorMgmt));
  }

  newVerificationOTP(body:any): Observable<any>{
    console.log(body);
    let url = `${this.url}/email_verification/`;
    return this.http.post(url,body).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

   // Error handling
   errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(error.error);
    
    console.log(errorMessage);
    return throwError(() => {
      return error;
    });
  }

}
