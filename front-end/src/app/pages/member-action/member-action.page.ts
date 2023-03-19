import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-action',
  templateUrl: './member-action.page.html',
  styleUrls: ['./member-action.page.scss'],
})
export class MemberActionPage implements OnInit {
  scannedResult:any;
  content_visibility = '';
  dateTime;

  username:String='';

  serviceProviders: any; // serviceprovider means admin as he is providing service to members.
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  usersUrl:string='http://localhost:3000/users';// URL at postman from where all user are fetched
  originalserviceProvider:any;
  selectedService:any;

  // install https://github.com/capacitor-community/barcode-scanner plugin 

  constructor(
    private router:Router,
    private http:HttpClient,
    private _user:UserService,

  ) {
    this._user.user().subscribe(
      res=>{
        this.addName(res),
        console.log(res)
      },
      error=>{
        // this.router.navigate(['/login'])
        console.log(error)
      }
     )
  }

  addName(data:any){
    this.username = data.username;
    console.log(this.username);
  }

  ngOnInit() {
    setTimeout(() => {
      this.dateTime = new Date().toISOString();
    });

    //  to make sure only user can see this page by login so this is done 
    const user = localStorage.getItem('User')
    // this.addName(user);
    console.log(user); // here user info is being display after login successfull
    this.loggeduser=user;
    console.log(this.loggeduser);
    if(user==null){
      this.router.navigateByUrl('/login',{replaceUrl:true}) // here URL by replace so that user can not back and go to come again here without login
    }else{
      console.log(JSON.parse(user!)); // convert back user info into object so that we can use this info
      this.http.get(this.usersUrl).subscribe(res=>{
        console.log(res)
        // this.serviceProviders=res;
        // this.originalserviceProvider=res;
      },error=>{
        console.log(error)});
    }
  }

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({force: true });
      if (status.granted) {
      //   // the user granted permission
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      console.log(result);
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if(result?.hasContent) {
        this.scannedResult = result.content;
        console.log(this.scannedResult);
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
  }

  ngOnDestroy(): void {
      this.stopScan();
  }


}
