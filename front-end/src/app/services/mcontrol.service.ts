import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';

import {Mcontrol} from '../models/mcontrol';
import { environment } from 'src/environments/environment.prod';

// const baseUrl = 'http://localhost:3000/api/v1/membercontrols';
const baseUrl =  environment.SERVER+'/membercontrols';
const searchUrl = environment.SERVER+'/mcontrol/search/';


@Injectable({
  providedIn: 'root'
})
export class McontrolService {
  // baseUri :string = 'http://localhost:3000/api/v1';

  baseUri : string = environment.SERVER;
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient) { }
  selectedMember:Mcontrol;
  members:Mcontrol[];

  getAll(): Observable<Mcontrol[]> {
    console.log("i m in get all loop");
    return this.http.get<Mcontrol[]>(baseUrl);
  }

  getMcontrol(id: any): Observable<Mcontrol> {
    console.log("i m in get  by ID loop");
    return this.http.get(`${baseUrl}/${id}`);
  }

  getMcontrolEmail(email: any): Observable<Mcontrol> {
    console.log("i m in get  by emailloop");
    return this.http.get(`${baseUrl}/email/${email}`);
  }


  addMcontrol(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/membercontrols`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  update(id: any, data: any): Observable<any> {
    console.log("i m in Update by ID oop");
    return this.http.put(`${baseUrl}/${id}`, data).pipe(catchError(this.errorMgmt));
  }

  delete(id: any): Observable<any> {
    console.log(id);
    console.log(`${baseUrl}/${id}`);
    return this.http.delete(`${baseUrl}/${id}`).pipe(catchError(this.errorMgmt));
  }

  // deleteAll(): Observable<any> {
  //   return this.http.delete(baseUrl).pipe(catchError(this.errorMgmt));
  // }

  wildSearch(mobile: any): Observable<Mcontrol[]> {
    console.log("i m in wild search loop");
    return this.http.get<Mcontrol[]>(`${searchUrl}=${mobile}`).pipe(catchError(this.errorMgmt));
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
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }


}
