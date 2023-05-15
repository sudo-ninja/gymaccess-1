import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';
import{ Attendance_ } from '../models/attendance.model';



const baseUrl = 'http://localhost:3000/api/v1/attendances';
const searchUrl = 'http://localhost:3000/api/v1/attendances/search/';


@Injectable({
  providedIn: 'root'
})

export class AttendanceService {
  baseUri :string = 'http://localhost:3000//api/v1';
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient) { }
  selectedMember:Attendance_;
  attendances:Attendance_[];

  getAll(): Observable<Attendance_[]> {
    console.log("i m in get all loop");
    return this.http.get<Attendance_[]>(baseUrl);
  }

  getAttendance(id: any): Observable<Attendance_> {
    console.log("i m in get  by ID Method");
    return this.http.get(`${baseUrl}/findone?id=${id}`);
  }

  getMemberAttendance(member_id: any): Observable<Attendance_> {
    console.log("i m in get  by ID Method");
    return this.http.get(`${baseUrl}/findallid?member_id=${member_id}`);
  }


  addAttendance(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/attendances`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
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

  wildSearch(mobile: any): Observable<Attendance_[]> {
    console.log("i m in wild search loop");
    return this.http.get<Attendance_[]>(`${searchUrl}=${mobile}`).pipe(catchError(this.errorMgmt));
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


