import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import{Users} from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // tobe used for intercpetor 
  noAuthHeader = {headers: new HttpHeaders({'NoAuth':'True'})};

  url:string= 'http://localhost:3000/api/v1'

constructor(private http:HttpClient,
            // private _user:Users,
            ) { }



  register(body:any): Observable<any> {
    console.log(body);
    let url = `${this.url}/user/register`;
    console.log(url);
    return this.http.post(url,body,this.noAuthHeader).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  update(Id:any, data: any): Observable<any> {
    console.log(Id);
    console.log(data);
    let url = `${this.url}/user/register/${Id}`
    return this.http.put(url,data,this.noAuthHeader).pipe(tap((dat:any)=>console.log(`updated with ID =${Id}`)),
    catchError(this.errorMgmt));
  }
  
  login(authCredentials): Observable<any> {
    return this.http.post('this.url/user/login',authCredentials,this.noAuthHeader)
    // {
    //   // observe:'body',
    //   // withCredentials:true,
    //   // headers:new HttpHeaders().append('Content-Type','application/json')
    // });
  }

  setToken(token:string){
    localStorage.setItem('token',token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  deleteToken(){
    // localStorage.clear()
    localStorage.removeItem('token');
  }

  getUserPayload(){
    var token = this.getToken();
    if(token){
      var userPayload = atob(token.split('.')[1]); // token split in array lets use 2nd part
      return JSON.parse(userPayload);
    }
    else
    return null;
  }

  isLoggedIn(){
    var userPayload = this.getUserPayload();
    if(userPayload)
    return userPayload.exp > Date.now()/1000;
    else
    return false;
  }
  
  //before auth guard and interceptor
  // login(body:any): Observable<any> {
  //   return this.http.post('this.url/user/login',body,{
  //     observe:'body',
  //     withCredentials:true,
  //     headers:new HttpHeaders().append('Content-Type','application/json')
  //   });
  // }


  

  // user(){
  //   return this.http.get('http://localhost:3000/api/v1/user/user',{
  //     observe:'body',
  //     withCredentials:true,
  //     headers:new HttpHeaders().append('Content-Type','application/json')
  //   })
  // }

  getUserbyEmail(_Email:any): Observable<Users> {
    console.log("i m in get  by emailloop");
    return this.http.get(`http://localhost:3000/api/v1/user/user/email/${_Email}`,this.noAuthHeader);
  }

  // logout(){

  //   this.deleteToken();
  //   return this.http.get('/users/logout',{
  //     observe:'body',
  //     withCredentials:true,
  //     headers:new HttpHeaders().append('Content-Type','application/json')
  //   })
  // }

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
    console.log(error.error);
    return throwError(() => {
      return error;
    });
  }

  getUserProfile(){
    return this.http.get(this.url+'/user/private_data');
    // here we can use to get user detail also as encrpted data
  }


forgetPassword(body:any): Observable<any> {
  console.log(body);
    let url = `${this.url}/forgot_password`;
    console.log(url);
    return this.http.post(url,body,this.noAuthHeader).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
}

forgetPasswordReset(body:any): Observable<any> {
  console.log(body);
    let url = `${this.url}/forgot_password/reset`;
    console.log(url);
    return this.http.post(url,body,this.noAuthHeader).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
}


}
