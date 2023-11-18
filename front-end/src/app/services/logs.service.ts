import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Log } from '../models/log';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  baseUri : string = environment.SERVER;
  
  headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('Content-Type', 'application/x-www-form-urlencoded');

  constructor(
    private http: HttpClient
  ) { }

  logs:Log[];

logEvent(event: any): Observable<any> {
    // Send the event to a server or store it locally
    // const logData = {
    //   timestamp: new Date().toISOString(),
    //   event: event
    // };
  return this.http.post(`${this.baseUri}/logs/`, event)
  //     .subscribe({
  //       next:response => console.log('Event logged successfully:', response),
  //       error:error => console.error('Error logging event:', error)
  // });
  .pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  getLog(id: any): Observable<Log> {
    // console.log("i m in get member by ID function");
    return this.http.get(`${this.baseUri}/logs?id=${id}`).pipe(map(response => response));;
  }

  getLogsByEmail(email:any): Observable<Log> {
    // console.log("i m in get member by ID function");
    return this.http.get(`${this.baseUri}/logs/query?email=${email}`).pipe(map(response => response));;
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
