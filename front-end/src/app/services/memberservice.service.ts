import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';
import { Member } from '../models/member.model';
import { environment } from 'src/environments/environment.prod';

const baseUrl = 'http://localhost:3000/api/v1/members';
const searchUrl = 'http://localhost:3000/api/v1/members/search/';

@Injectable({
  providedIn: 'root'
})

export class MemberserviceService {

  // baseUri :string = 'http://localhost:3000/api/v1';

  baseUri : string = environment.SERVER;
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  selectedMember:Member;
  members:Member[];


  getAll(): Observable<Member[]> {
    console.log("i m in get all loop");
    return this.http.get<Member[]>(baseUrl);
  }

  getMember(id: any): Observable<Member> {
    console.log("i m in get member by ID function");
    return this.http.get(`${baseUrl}/findone?id=${id}`);
  }

  // get total member those are free or paid in same gym id
  getMemberType(id: any, type:any): Observable<Member> {
    console.log("i m in get member by ID function");
    return this.http.get(`${baseUrl}/accesstype?gym_id=${id}&m_accesstype=${type}`);
  }

   // get total member those subscription going to end after certain days
   getGoingtoEndMember(id: any, type:any): Observable<Member> {
    console.log("i m in get member by ID function", type);
    return this.http.get(`${baseUrl}/valid7?gym_id=${id}&m_enddate=${type}`); // date to be entered in unix formate
  }


  getMemberByEmail(email: any): Observable<Member> {
    console.log("i m in get member by email search ");
    return this.http.get(`${baseUrl}/email/${email}`);
  }

  addMember(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/members`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  update(id: any, data: any): Observable<any> {
    console.log("i m in Update by ID function");
      console.log(`${id}`);
    console.log(`${baseUrl}/${id}`);
    return this.http.put(`${baseUrl}/${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`).pipe(catchError(this.errorMgmt));
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl).pipe(catchError(this.errorMgmt));
  }

  // delete all memebrs of particular Gym 
  deleteAllofThisGymID(gymid:any): Observable<any> {
    return this.http.delete(`${baseUrl}gymid?gym_id=${gymid}`).pipe(catchError(this.errorMgmt));
  }

  wildSearch(searchstring: any): Observable<Member[]> {
    console.log("i m in wild search loop");
    return this.http.get<Member[]>(`${baseUrl}/search/${searchstring}`).pipe(catchError(this.errorMgmt));
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

