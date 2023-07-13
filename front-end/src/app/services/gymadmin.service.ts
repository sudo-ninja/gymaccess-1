import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';

import { Gymadmin } from '../models/gymadmin.model';
import { environment } from 'src/environments/environment.prod';

const baseUrl = environment.SERVER+'/gymadmins';
const searchUrl = environment.SERVER+'/gymadmins/search/';


@Injectable({
  providedIn: 'root'
})
export class GymadminService {

  // baseUri :string = 'http://localhost:3000/api/v1';
  baseUri : string = environment.SERVER;
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  selectedGymadmin:Gymadmin;
  gymadmins:Gymadmin[];

  getAll(): Observable<Gymadmin[]> {
    console.log("i m in get all loop");
    return this.http.get<Gymadmin[]>(baseUrl);
  }

  getGymadmin(id: any): Observable<Gymadmin> {
    console.log("i m in get member by ID function");
    return this.http.get(`${baseUrl}/findone?id=${id}`);
  }

  // get gym admin based on user id
  getGymadminByUserid(user_id: any): Observable<Gymadmin> {
    console.log("i m in get admin by user id function");
    return this.http.get(`${baseUrl}/userid?user_id=${user_id}`);
  }

 
  getGymadminByEmail(email: any): Observable<Gymadmin> {
    console.log("i m in get member by email search ");
    return this.http.get(`${baseUrl}/email/${email}`);
  }

  addGymadmin(data: any): Observable<any> {
    console.log("i m in add gym admin ");
    let url = `${this.baseUri}/gymadmins`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  update(id: any, data: any): Observable<any> {
    console.log("i m in Update by ID function");
    // let url = `${this.baseUri}/members/`;
    console.log(`${id}`);
    console.log(`${baseUrl}/${id}`);

    // return this.http.put(`${baseUrl}/${id}`,data,{headers: this.headers}).pipe(tap((dat:any)=>console.log(`updated with ID =${dat.id}`)),
    // catchError(this.errorMgmt));
    return this.http.put(`${baseUrl}/${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${id}`)),
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

  wildSearch(searchstring: any): Observable<Gymadmin[]> {
    console.log("i m in wild search loop");
    return this.http.get<Gymadmin[]>(`${baseUrl}/search/${searchstring}`).pipe(catchError(this.errorMgmt));
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
