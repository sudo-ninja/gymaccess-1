import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';

import { Attenshift } from '../models/attenshift';
import { environment } from 'src/environments/environment.prod';

const baseUrl = environment.SERVER+'/shifts';
// const searchUrl = environment.SERVER+'/shifts/';


@Injectable({
  providedIn: 'root'
})
export class AttenshiftService {
  baseUri : string = environment.SERVER;
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  selectedHoliday:Attenshift;
  holidays:Attenshift[];

  // Create List Name
  addShift(data: any): Observable<any> {
    console.log("i m in add list name ");
    let url = `${baseUrl}`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  //read list by id 
  getShift(id: any): Observable<any> {
    console.log("i m in get holiday list by ID ");
    return this.http.get(`${baseUrl}/?id=${id}`);
  }

  //forget to update holidatlist name -- make it


  //query holidayList 
//   public getUsersMultipleParams(): Observable<UserInformation> {
//     const url = 'https://reqres.in/api/users';
//     let queryParams = {"page":1,"per_page":1};
//     return this.http.get<UserInformation>(url,{params:queryParams});
// }
public queryShift(data:any): Observable<Attenshift[]>{
  let url = `${baseUrl}/query`;
  let queryParams = data;
  return this.http.get<Attenshift[]>(url,{params:queryParams})
}


  addHoliday(id:any,data:any):Observable<any> {
    console.log("i m in add holiday ");
    console.log(`${id}`);
    console.log(`${baseUrl}?id=${id}`);
    return this.http.put(`${baseUrl}?id=${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${id}`)),
    catchError(this.errorMgmt));
    }

  updateHoliday(id:any,data:any):Observable<any> {
      console.log("i m in add holiday ");
      console.log(`${id}`);
      console.log(`${baseUrl}/holiday?id=${id}`);
      return this.http.put(`${baseUrl}/holiday?id=${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${id}`)),
      catchError(this.errorMgmt));
      }

  removeHoliday(id:any,data:any):Observable<any> {
    console.log("i m in add holiday ");
    console.log(`${id}`);
    console.log(`${baseUrl}/holiday?id=${id}`);
    return this.http.put(`${baseUrl}/holiday?id=${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${id}`)),
    catchError(this.errorMgmt));
    }

    //delet holiday list 
  deleteHolidaylist(data: any): Observable<any> {
      let url = `${baseUrl}/deletelist`;
      let queryParams = data;
      console.log(data);
      console.log({params:queryParams});
      return this.http.delete<Attenshift[]>(url,data);
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
