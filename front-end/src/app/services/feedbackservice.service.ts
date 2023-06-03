import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';
import { Feedback } from '../models/feedback';

const baseUrl = 'http://localhost:3000/api/v1/feedbacks';
const searchUrl = 'http://localhost:3000/api/v1/feedbacks/search/';


@Injectable({
  providedIn: 'root'
})
export class FeedbackserviceService {

  baseUri :string = 'http://localhost:3000/api/v1';
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient) { }
  selectedMember:Feedback;
  feedbacks:Feedback[];

  getAll(): Observable<Feedback[]> {
    console.log("i m in get all loop");
    return this.http.get<Feedback[]>(baseUrl);
  }

  getFeedbackById(id: any): Observable<Feedback> {
    console.log("i m in get  by ID Method");
    return this.http.get(`${baseUrl}/findone?id=${id}`);
  }

  getFeedbackBySenderId(member_id: any): Observable<Feedback> {
    console.log("i m in get  by ID Method");
    return this.http.get(`${baseUrl}/findallid?member_id=${member_id}`);
  }

  getFeedbackByChatroom(room: any): Observable<Feedback> {
    console.log("i m in get  by room ");
    return this.http.get(`${baseUrl}/chatroom?chatroom=${room}`);
  }

  addFeedback(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/feedbacks`;
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

  wildSearch(keyword: any): Observable<Feedback[]> {
    console.log("i m in wild search loop");
    return this.http.get<Feedback[]>(`${searchUrl}=${keyword}`).pipe(catchError(this.errorMgmt));
  }

  searchBymemberId(member_id:any): Observable<Feedback[]> {
    console.log("i m in search by member ID");
    return this.http.get<Feedback[]>(`${searchUrl}=${member_id}`).pipe(catchError(this.errorMgmt));
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

