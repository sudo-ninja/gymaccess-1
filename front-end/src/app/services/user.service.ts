import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import{Users} from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string= 'http://localhost:3000/api/v1'

constructor(private http:HttpClient,
            // private _user:Users,
            ) { }

  register(body:any){
    // console.log(body);
    let url = `${this.url}/user/register`;
    return this.http.post(url,body).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  update(Id:any, data: any){
    console.log(Id);
    console.log(data);
    return this.http.put(`http://localhost:3000/api/v1/user/register/${Id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${Id}`)),
    catchError(this.errorMgmt));
  }
  
  login(body:any){
    return this.http.post('this.url/user/login',body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  user(){
    return this.http.get('http://localhost:3000/api/v1/user/user',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
  }

  getUserbyEmail(_Email:any): Observable<Users> {
    console.log("i m in get  by emailloop");
    return this.http.get(`http://localhost:3000/api/v1/user/user/email/${_Email}`);
  }

  logout(){
    return this.http.get('/users/logout',{
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
      errorMessage = error.error.error;
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
