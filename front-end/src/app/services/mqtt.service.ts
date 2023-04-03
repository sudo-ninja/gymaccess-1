import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  baseUrl: string = 'http://localhost:3000/mqtt';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  openLock(data:any): Observable<any>{
    console.log("in open lock srvice method");
    let url = `${this.baseUrl}`;
    return this.http.post(url,data).pipe(tap((dat:any)=>console.log("lock Open")),
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
      console.log(errorMessage);
      return throwError(() => {
        return errorMessage;
      });
    }
}
