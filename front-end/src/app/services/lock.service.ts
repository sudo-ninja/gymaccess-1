import { Injectable } from '@angular/core';


import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError,map,OperatorFunction, tap, BehaviorSubject, filter } from 'rxjs';
import { Lock } from '../models/lock';
import { environment } from 'src/environments/environment.prod';

const baseUrl = environment.SERVER+'/locks';
const searchUrl = environment.SERVER+'/locks/search/';


@Injectable({
  providedIn: 'root'
})
export class LockService {


  private allLocks$ = new BehaviorSubject<Lock[]>(undefined);
  baseUri : string = environment.SERVER;
  
  headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('Content-Type', 'application/x-www-form-urlencoded');
 

  constructor(private http: HttpClient) { }

  selectedMember:Lock;
  locks:Lock[];


  getAll(): Observable<Lock[]> {
    console.log("i m in get all loop");
    return this.http.get<Lock[]>(baseUrl);
  }

  getLockById(id: any): Observable<Lock> {
    console.log("i m in get member by ID function");
    return this.http.get(`${baseUrl}/findone?id=${id}`);
  }


 
  getLockByGymId(gymid: any): Observable<Lock> {
    console.log("i m in get member by email search ");
    console.log(gymid);
    console.log(`${baseUrl}/gymids?gym_id=${gymid}`);
    return this.http.get<Lock>(`${baseUrl}/gymids?gym_id=${gymid}`);
  }

  getLockByRelayId(relayid: any): Observable<Lock> {
    console.log("i m in get member by email search ");
    // console.log(gymid);
    console.log(`${baseUrl}/relayid?lock_relayId=${relayid}`);
    return this.http.get<Lock>(`${baseUrl}/relayid?lock_relayId=${relayid}`);
  }

  addLock(data: any): Observable<any> {
    console.log("i m in add member loop");
    let url = `${this.baseUri}/locks`;
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
    return this.http.delete(`${baseUrl}/gymid?gym_id=${gymid}`).pipe(catchError(this.errorMgmt));
  }

  //get member by GYM ID
  wildSearch(searchstring: any): Observable<Lock[]> {
    console.log("i m in wild search loop");
    this.http.get<Lock[]>(`${baseUrl}/search/${searchstring}`).subscribe(locks=>this.allLocks$.next(locks));
    return this.watchAllMembers().pipe(catchError(this.errorMgmt));

    // return this.http.get(`${baseUrl}/search/${searchstring}`).pipe(map(data =>  data as Lock[]));
    // return this.watchAllMembers().pipe(catchError(this.errorMgmt));
  }

  //  //get member by GYM ID and email
  //  getMemberByEmailOfGymId(email,gym_id):Observable<Lock> {
  //   console.log("i m in getMemberByEmailOfGymId   search loop");
  //   console.log(`${baseUrl}/gym_mail?email=${email}&gym_id=${gym_id}`);
  //   return this.http.get(`${baseUrl}/gym_mail?email=${email}&gym_id=${gym_id}`).pipe(catchError(this.errorMgmt));
  // }

  //to display all locks of particular gym
  watchAllMembers(): Observable<Lock[]> {
    return this.allLocks$.pipe(filter(maybe => !!maybe)); 
  }

  //assign locks to all locks of particular gym


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
