import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';

import { Holiday } from '../models/holiday';
import { environment } from 'src/environments/environment.prod';

const baseUrl = environment.SERVER+'/holidays';
// const searchUrl = environment.SERVER+'/holidays';


@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  baseUri : string = environment.SERVER;
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  selectedHoliday:Holiday;
  holidays:Holiday[];

  getAll(): Observable<Holiday[]> {
    console.log("i m in get all loop");
    return this.http.get<Holiday[]>(baseUrl);
  }
// Create List Name
  addlistName(data: any): Observable<any> {
    console.log("i m in add list name ");
    console.log(data);
    let url = `${this.baseUri}/holidays`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  //read list by id 
  getHolidaylist(id: any): Observable<any> {
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
public queryHolidaylist(data:any): Observable<Holiday[]>{
  // console.log(data);
  let url = `${baseUrl}/query`;
  let queryParams = data;
  return this.http.get<Holiday[]>(url,{params:queryParams})
}


  addHoliday(id:any,data:any):Observable<any> {
    console.log("i m in add holiday ");
    console.log(`${id}`);
    console.log(`${baseUrl}?id=${id}`);
    return this.http.put(`${baseUrl}?id=${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${id}`)),
    catchError(this.errorMgmt));
    }

    // to add holiday to holiday list
  updateHoliday(id:any,data:any):Observable<any> {
      console.log("i m in add holiday ");
      console.log(`${id}`);
      console.log(`${baseUrl}/holiday?id=${id}`);
      return this.http.put(`${baseUrl}/holiday?id=${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${id}`)),
      catchError(this.errorMgmt));
      }
  
// to retrive holiday
getSpecificHoliday(id:any):Observable<any> {
  console.log("i m in get spefic holiday service ");
  console.log(`${id}`);
  // console.log(`${baseUrl}/holiday?id=${id}`);
  return this.http.get(`${baseUrl}/holiday?dayid=${id}`).pipe(tap((dat:any)=>console.log(`retrieved =${id}`)),
  catchError(this.errorMgmt));
  }

  //modifyholiday data once entered
     // to add holiday to holiday list
     modifyHoliday(listid: string, holidayid: string, requestBody: any):Observable<any> {

       // Construct the URL with query parameters
    const url = `${baseUrl}/updateHoliday?id=${listid}&holidays._id=${holidayid}`;

    // Set the request headers (optional)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Send the HTTP PUT request with query parameters in the URL and JSON data in the request body
    return this.http.put(url, requestBody, { headers }).pipe(tap((dat:any)=>console.log(dat)),
    catchError(this.errorMgmt));;
 
      // http://localhost:3000/api/v1/holidays/updateHoliday?id=653be1e064eb596e266c00dc&holidays._id=653e91c51bac2403ec4e46f4
     
      }

  removeHoliday(id:any,holidayid:any):Observable<any> {
    // console.log("i m in add holiday ");
    // console.log(`${id}`);
    // console.log(`${baseUrl}/holiday?id=${id}`);
    return this.http.put(`${baseUrl}/removeHoliday?id=${id}`,holidayid).pipe(tap((dat:any)=>console.log(`updated with ID =${dat._id}`)),
    catchError(this.errorMgmt));
    }

    //delet holiday list 
  deleteHolidaylist(data: any): Observable<any> {
      let url = `${baseUrl}/deletelist`;
      let queryParams = data;
      return this.http.delete<Holiday[]>(url,{params:queryParams})
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
