import { Injectable } from '@angular/core';


import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap, BehaviorSubject, filter } from 'rxjs';
import { Member } from '../models/member.model';
import { environment } from 'src/environments/environment.prod';

const baseUrl = environment.SERVER+'/members';
const searchUrl = environment.SERVER+'/members/search/';

@Injectable({
  providedIn: 'root'
})

export class MemberserviceService {

  private allMembers$ = new BehaviorSubject<Member[]>(undefined);

  // baseUri :string = 'http://localhost:3000/api/v1';

  baseUri : string = environment.SERVER;
  
  headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('Content-Type', 'application/x-www-form-urlencoded');
            


  constructor(private http: HttpClient) { }

  selectedMember:Member;
  members:Member[];


  getAll(): Observable<Member[]> {
    console.log("i m in get all loop");
    return this.http.get<Member[]>(baseUrl);
  }

  getMember(id: any): Observable<Member> {
    console.log("i m in get member by ID function");
    return this.http.get(`${baseUrl}/findone?id=${id}`).pipe(map(response => response));;
  }

  // get total member those are free or paid in same gym id
  getMemberType(id: any, type:any): Observable<Member> {
    console.log("i m in get member by ID function");
    return this.http.get(`${baseUrl}/accesstype?gym_id=${id}&m_accesstype=${type}`);
  }

   // get total member those subscription going to end after certain days
   getGoingtoEndMember(id: any, type:any): Observable<Member> {
    console.log("i m in get member by ID function", type);
    return this.http.get(`${baseUrl}/valid7?gym_id=${id}&m_enddate=${type}`); // date to be entered in unix formate
  }


  getMemberByEmail(email: any): Observable<Member[]> {
    console.log("i m in get member by email search ");
    console.log(email);
    console.log(`${baseUrl}/email/${email}`);
    return this.http.get<Member[]>(`${baseUrl}/email/${email}`);
  }

  addMember(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/members`;
    return this.http.post(url, data).pipe(tap((dat:any)=>console.log(`Added with ID =${dat._id}`)),
    catchError(this.errorMgmt));
  }

  update(id: any, data: any): Observable<any> {
    console.log("i m in Update by ID function");
      console.log(`${id}`);
    console.log(`${baseUrl}/${id}`);
    return this.http.put(`${baseUrl}/${id}`,data).pipe(tap((dat:any)=>console.log(`updated with ID =${dat._id}`)),
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

  //get member by GYM ID
  wildSearch(searchstring: any): Observable<Member[]> {
    console.log("i m in wild search loop");
    this.http.get<Member[]>(`${baseUrl}/search/${searchstring}`).subscribe(members=>this.allMembers$.next(members));
    return this.watchAllMembers().pipe(catchError(this.errorMgmt));

    // return this.http.get(`${baseUrl}/search/${searchstring}`).pipe(map(data =>  data as Member[]));
    // return this.watchAllMembers().pipe(catchError(this.errorMgmt));
  }

   //get member by GYM ID and email
   getMemberByEmailOfGymId(email,gym_id):Observable<Member> {
    console.log("i m in getMemberByEmailOfGymId   search loop");
    // let queryParams = {
    //   "email": email,
    // //   "gym_id": gym_id,
    // // }
    // let queryParams = new HttpParams();
    // // .set('email',email)
    // // .set('gym_id',gym_id);
    // queryParams = queryParams.append('email',email);
    // queryParams = queryParams.append('gym_id',gym_id);
    // console.log(`${baseUrl}/gym_mail/`,{params:queryParams});
    // return this.http.post(`${baseUrl}/gym_mail_post/`,queryParams).pipe(catchError(this.errorMgmt));
    // catchError(this.errorMgmt); 
    // this.http.get<Member>(`${baseUrl}/gym_mail/`,{params:queryParams});
    // return this.watchAllMembers().pipe(catchError(this.errorMgmt));
    console.log(`${baseUrl}/gym_mail?email=${email}&gym_id=${gym_id}`);
    return this.http.get(`${baseUrl}/gym_mail?email=${email}&gym_id=${gym_id}`).pipe(catchError(this.errorMgmt));
  }

  //to display all members of particular gym
  watchAllMembers(): Observable<Member[]> {
    return this.allMembers$.pipe(filter(maybe => !!maybe)); 
  }

  //assign members to all members of particular gym


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

