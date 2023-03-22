import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
// import{Users} from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string= 'http://localhost:3000'

constructor(private _http:HttpClient,
            // private _user:Users,
            ) { }

  register(body:any){
    return this._http.post('this.url/register',body,{
      observe:'body',
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  update(Id:any, data: any): Observable<any> {
    return this._http.put(`this.url/register/'${Id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${Id}`)),
    catchError(this.errorMgmt));
  }
  
  login(body:any){
    return this._http.post('url/users/login',body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  user(){
    return this._http.get('http://localhost:3000/users/user',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
  }

  logout(){
    return this._http.get('url/users/logout',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
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
