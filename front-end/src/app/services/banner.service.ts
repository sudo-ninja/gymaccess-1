import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap } from 'rxjs';

import {Banner} from '../models/banner';
import { environment } from 'src/environments/environment.prod';

const baseUrl = 'http://localhost:3000/api/v1/images';
// const searchUrl = 'http://localhost:3000/api/v1/images/search';
const searchUrl = environment.SERVER+'/images/search';


@Injectable({
  providedIn: 'root'
})
export class BannerService {
  baseUri : string = environment.SERVER;
  images: Banner[];

  constructor(private http: HttpClient) { }

  getAll(): Observable<Banner[]> {
    console.log("i m in get all image loop");
    return this.http.get<Banner[]>(baseUrl);
  }

  getImageById(id: any): Observable<Banner> {
    console.log("i m in get  by ID loop");
    return this.http.get(`${baseUrl}/${id}`);
  }

  addImage(data: any): Observable<any> {
    console.log("i m in add member loop");
    console.log(data);
    let url = `${this.baseUri}/images`;
    console.log(url);
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  getImageByGymId(user_id: any): Observable<Banner[]> {
    console.log("i m in wild search loop");
    console.log(user_id);
    console.log(`${searchUrl}/${user_id}`);
    return this.http.get<Banner[]>(`${searchUrl}/${user_id}`);
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

  // delet by post id
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`).pipe(catchError(this.errorMgmt));
  }


}
