import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';

import{ Attendance } from '../models/attendance';

const baseUrl = 'http://localhost:3000/attendance';
const searchUrl = 'http://localhost:3000/attendance/search/';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  baseUri :string = 'http://localhost:3000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient) { }
  selectedMember:Attendance;
  members:Attendance[];

  getAll(): Observable<Attendance[]> {
    console.log("i m in get all loop");
    return this.http.get<Attendance[]>(baseUrl);
  }

  getAttendance(id: any): Observable<Attendance> {
    console.log("i m in get  by ID loop");
    return this.http.get(`${baseUrl}/${id}`);
  }

  addAttendance(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/members`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat.id}`)),
    catchError(this.errorMgmt));
  }

  update(id: any, data: any): Observable<any> {
    console.log("i m in Update by ID oop");
    return this.http.put(`${baseUrl}/${id}`, data).pipe(catchError(this.errorMgmt));
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`).pipe(catchError(this.errorMgmt));
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl).pipe(catchError(this.errorMgmt));
  }

  wildSearch(mobile: any): Observable<Attendance[]> {
    console.log("i m in wild search loop");
    return this.http.get<Attendance[]>(`${searchUrl}=${mobile}`).pipe(catchError(this.errorMgmt));
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
