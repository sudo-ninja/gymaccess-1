import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';

// import model
import { Recharge } from '../models/recharge';
import { environment } from 'src/environments/environment.prod';

const baseUrl = 'http://localhost:3000/api/v1/recharges';
const searchUrl = 'http://localhost:3000/api/v1/Recharges/search/';



@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  // baseUri :string = 'http://localhost:3000/api/v1';

  baseUri : string = environment.SERVER;
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient) { }
  selectedRecharge:Recharge;
  recharges:Recharge[];

  getAll(): Observable<Recharge[]> {
    console.log("i m in get all loop");
    return this.http.get<Recharge[]>(baseUrl);
  }

  getRecharge(id: any): Observable<Recharge> {
    console.log("i m in get  by ID loop");
    return this.http.get(`${baseUrl}/${id}`);
  }

  addRecharge(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/recharges`;
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

  wildSearch(mobile: any): Observable<Recharge[]> {
    console.log("i m in wild search loop");
    return this.http.get<Recharge[]>(`${searchUrl}=${mobile}`).pipe(catchError(this.errorMgmt));
  }

  //get all recharges request by member id 
  getRechargeRequestMadeByMemberId(memberID:any): Observable<Recharge[]>{
    console.log("i m in get recharge request made by member id loop");
    return this.http.get<Recharge[]>(`${baseUrl}/memberid?member_id=${memberID}`).pipe(catchError(this.errorMgmt));
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
