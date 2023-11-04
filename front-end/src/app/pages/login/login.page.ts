import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthGuardService } from 'src/app/guards/auth/auth-guard.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { EmailverificationService } from 'src/app/services/emailverification.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
//for google login
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {isPlatform} from '@ionic/angular';

import { ToastController } from '@ionic/angular';
import { JwtService } from 'src/app/services/jwt.service';
import { StorageService } from 'src/app/services/storage.service';
 



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email!: string; 
  password!:string;
  isLoading: boolean=false;

  userVerified: boolean = false;
  isLoadingResults = false;
  otpsent: boolean = false;


  authForm!: FormGroup;
  isSubmitted  =  false;

  // url: string = "http://localhost:3000/api/v1/user/login";
  url:string=environment.SERVER+"/user/login";
  serverErrorMessage:string;

  // user for gmail login
  user = null;
  waiting: boolean;
  entered_mobile: any;

  constructor(
    private fb: FormBuilder,
    private authService : AuthGuardService,
		private loadingController: LoadingController,
		private alertCtrl: AlertController,
    private toastController: ToastController,
    private router: Router,
    private http:HttpClient,
    private userAPI: UserService,
    private emailVerifyAPI: EmailverificationService,
    private jwtService:JwtService,
    private storageService :StorageService, // for local storage
    private _ngZone: NgZone,
  ) {
    if(this.userAPI.isLoggedIn())
    {this.router.navigateByUrl('/home',{replaceUrl:true})};
    // // this only for web browser 
    // if(!isPlatform('capacitor')){
    //   GoogleAuth.initialize(
    //     {
    //     clientId: '651915982135-kjtianuhb3r7ftbpa426jujm559v5l9d.apps.googleusercontent.com',
    //     scopes: ['profile', 'email'],
    //     grantOfflineAccess: true,
    //   }
    //   );
    // }

  }

  ngOnInit() {
      this.authForm  =  this.fb.group({
        email: ['',[ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),],],
        password: ['', [Validators.required,
          Validators.minLength(8),]],
  });
  }

  get formControls() { return this.authForm.controls; }

  signIn(){
    this.isSubmitted = true;
    if(this.authForm.invalid){
      return;
    }
    this.authService.signIn(this.authForm.value);
    // console.log(this.authForm.value);    
    this.login(this.authForm.value);
    // this.router.navigateByUrl('/home');
  }

  async login(credentials:any){
    const loading = await this.loadingController.create();
		await loading.present();
    // credentials = {
    //   email: this.email,
    //   password: this.password,
    // }
    let _email = this.authForm.value.email;
    this.http.post(this.url,credentials).subscribe(
      {
        next: (res) =>{
          this.userAPI.setToken(res['token']); // to store locally token 
      this.isLoading=false;
      localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
      // this.authService.signIn(this.authForm.value);
      this.router.navigateByUrl('/home',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
      this.isLoading=true;
      },
        error: (error) => {
            this.serverErrorMessage = error.error;
            this.isLoading=false;
            this.emailExistButNotVerified(_email);
            // check if email already exist or not ? if not exist redirect to signup page by showing alert
            console.log(error.error);
            // this.verifyEmailSignup();
            this.presentAlertLogin('Login Failed',error.error,'try again');

                }
        }
        );

    console.log(credentials);
    await loading.dismiss();
  }

  //login using user service api
  
  
  // async login(credentials:any){
  //   const loading = await this.loadingController.create();
	// 	await loading.present();
  //  let _email = this.authForm.value.email;
  //  this.userAPI.login(credentials).subscribe(
  //   {
  //     next: (res) =>{
  //       console.log(res);
  //       this.userAPI.setToken(res['token']); // to store locally token 
  //       this.isLoading=false;
  //       localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
  //       this.router.navigateByUrl('/home',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
  //        this.isLoading=true;
  //   },
  //     error: (error) => {
  //         this.serverErrorMessage = error.error;
  //         this.isLoading=false;
  //         this.emailExistButNotVerified(_email);
  //         console.log(error.error);
  //       }
  //     }
  //     );
    

  //   console.log(credentials);
  //   await loading.dismiss();
  // }



//check if email exist or not
emailExistButNotVerified(email_){
  this.userAPI.getUserbyEmail(email_).subscribe({
    next:res=>{
      //email exist but not verified 
      // shot email verified input alert , first send verification code and then take input
      console.log(res);
      if(!res.verified){
        this.verifyEmail_SendOTP_inputOTP_setVerified(email_)
      }
    },
    error:error=>{
      console.log(error.error);
    }
  });
}

//check email exist for google login 
async googleMailExist(email){
  this.userAPI.getUserbyEmail(email).subscribe({
    next:res=>{
      //email exist but not verified 
      // shot email verified input alert , first send verification code and then take input
      console.log(res);
    },
    error:error=>{
      console.log(error.error);
    }
  });

}

  async presentAlertLogin(header:string,subheader:string, message:string) {
    const alert = await this.alertCtrl.create({
      header:header,
      subHeader: subheader,
      message:message,
      buttons: [
        // {
        //   text: 'Verify Now',
        //   role :'ok',
        //   handler: () => {
        //     //takes the data
        //     console.log("Verifiy Now send Verification OTP mail and verify ")
        // },
        // },
        {
          text: 'Cancel',
          
          handler: () => {
            console.log("Cancel and Navigate to Login Page ")            
          },
        },
      ],
      
    });

    await alert.present();
  
  }

  async presentAlert(header:string,subheader:string, message:string) {
    const alert = await this.alertCtrl.create({
      header:header,
      subHeader: subheader,
      message:message,
      buttons: ['OK'],
    });
    await alert.present();
  
  }
//  
// verifiy email
verifyEmail_SendOTP_inputOTP_setVerified(email_:any) {
  // this.isLoadingResults=true;
  console.log("162");
  // this will generate and send OTP to email
  this.emailVerifyAPI.newVerificationOTP({ email: email_ }).subscribe(
    (res) => {
      console.log(res);
      if (res) {
        this.otpsent = true;
      }
      if (this.otpsent) {
        this.isLoadingResults = false;
        console.log("OTP sent");
        this.verifyAlert(email_);
      }
    },
    (error) => {
      console.log(error);
      if (error.status == 400) {
        this.isLoadingResults = false;
        this.presentAlert('Alert !', 'Email ID is Wrong', 'try again');
      }
    }
  );
}



async verifyAlert(email_:any) {
  const alert = await this.alertCtrl.create({
    header: 'Please Enter Verification Code.',
    subHeader: `Code Sent to ${email_}} .`,
    buttons: [
      {
        text: 'Ok',
        handler: (alertData) => {
          //takes the data

          const var_code = alertData.code_entered;
          console.log(var_code);
          if (!var_code) {
            console.log('no data');
            this.presentAlert(
              'Empty Field Not Allowed',
              'Enter OTP ',
              'try again'
            );
          } else {
            // call verification service
            this.emailVerifyAPI
              .verifyEmail({
                email: email_,
                otp: var_code,
              })
              .subscribe(
                (res) => {
                  console.log(res);
                  // here all goods then redirect to new page or
                  this.userVerified = true;
                  // here we need to send login user all information to next page using get set 
                  this.sendUsertoLogin();
                  //route to Home page
                  // but cant not route lets send back to login page to get TOKEN as same token will be used by Auth Guard
                },
                (error) => {
                  console.log(error.error);
                  this.presentAlert('Alert!', error.error, 'try again');
                }
              );
          }
        },
      },
      {
        text: 'Resend',
        handler: (alertData) => {
          this.sendVerificationCode(email_);
        },
      },
    ],
    inputs: [
      {
        name: 'code_entered',
        placeholder: 'Verificaion Code',
        attributes: {
          maxlength: 6,
        },
      },
    ],
  });

  await alert.present();
}

sendUsertoLogin(){
  this.router.navigateByUrl('/login',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
}


sendUsertoHome(email_){
  this.userAPI.getUserbyEmail(email_).subscribe({
    next:res=>{
      localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
      let retrievdToken = localStorage.getItem("token");
      // this.authService.signIn(this.authForm.value);
      this.authService.signIn(retrievdToken);
      this.router.navigateByUrl('/home',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
     
    },
    error:error=>{
      console.log(error);
    },
  
  });
}

sendVerificationCode(email_:any) {
  // first check if already verfied if already verified then
  this.isLoadingResults = true;
  console.log(this.isLoadingResults);

  this.userAPI.getUserbyEmail(email_).subscribe(
    (res) => {
      // if user exits or not
      let verified: boolean = false;
      verified = res.verified;
      if (verified) {
        this.isLoadingResults = false;
        // console.log(this.isLoadingResults);

        this.verifiedUser(email_);
      } else {
        this.isLoadingResults = false;
        console.log(this.isLoadingResults);

        this.verifyEmail(email_);
      }
    },
    (error) => {
      this.isLoadingResults = false;
      // console.log(this.isLoadingResults);

      if (error.status == 404) {
        this.verifyEmail(email_);
      }
    }
  );
}
// verifiy email
verifyEmail(email_) {
  // this.isLoadingResults=true;
  this.emailVerifyAPI.newVerificationOTP({ email_ }).subscribe(
    (res) => {
      console.log(res);
      if (res) {
        this.otpsent = true;
      }
      if (this.otpsent) {
        this.isLoadingResults = false;
        this.verifyAlert(email_);
      }
    },
    (error) => {
      console.log(error);
      if (error.status == 400) {
        this.isLoadingResults = false;
        this.presentAlert('Alert !', 'Email ID is Wrong', 'try again');
      }
    }
  );
}

// already verified user alert with forget password and login
async verifiedUser(email_:any) {
  // this.isLoadingResults=false;
  const alert = await this.alertCtrl.create({
    header: `${email_} already verified ! .`,
    buttons: [
      {
        text: 'Login',
        role: 'login',
        handler: (alertData) => {
          //navigate to login page
          this.router.navigateByUrl('/home', { replaceUrl: true });
        },
      },
      {
        text: 'Forgot Password?',
        role: 'forgot',
        handler: (alertData) => {
          this.router.navigateByUrl('/forgetpassword', { replaceUrl: true });
        },
      },
    ],
  });

  await alert.present();

}

// for google login
async googleSignin(){
  // console.log("google sign in ");
  // let googleUser = await GoogleAuth.signIn();
  // console.log(googleUser);
  // const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
  // // return this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
  this.user = await GoogleAuth.signIn();
  // console.log(this.user);
  //retur ID token from here to back end 
  // console.log(this.user.authentication.idToken);
  this.handleCredentialResponse(this.user.authentication.idToken);
  if(!this.user){
    // present alert that user not fetch by gmail 
    this.presentToast("User Data Not Fetched from GMAIL",1500,"top");}    
  // }else{  
  //   console.log(this.user); 
  //   // check if user already exist in user db search by email 
  //   debugger;
  //   this.waiting= true;
  //     this.userAPI.getUserbyEmail(this.user.email).subscribe((res)=>{
  //       console.log(res); // here data comes without token .
  //        this.waiting= false;
  //       if(res.verified){
  //         let profileImageUrl = this.user.imageUrl;
  //         localStorage.setItem('ProfileImageUrl',profileImageUrl);
  //         // this.GoogleuserLogin(res.email); // here with token data will go to home page
  //         // return;  
  //       }
  //       // return;
  //     });
  //   // if no user found then only go below 
  //   let profileImageUrl = this.user.imageUrl;
  //   let UserName = this.user.givenName.concat(" ",this.user.familyName);
  //   console.log('user-',this.user , "Name:- ",UserName , "Email : - ",this.user.email,"image url:-",profileImageUrl);
   
  // localStorage.setItem('ProfileImageUrl',profileImageUrl);
  // this.GmailDoesNotExistAddtoDBandSendToHome(this.user.email,UserName);
  // }
  
}

async googleRefresh(){
  const authCode = await GoogleAuth.refresh();
  console.log('refresh',authCode);
}

async googleSignOut(){
  await GoogleAuth.signOut();
  this.user = null ;
}


async handleCredentialResponse(response:any) {
  console.log(response);
  this.userAPI.LoginWithGoogle(response).subscribe(
    (x:any) => {  
        // console.log(x.token);   
        this.userAPI.setToken(x.token); // to save JWT token in local storage   
        // console.log(this.service.getToken());         
        let decodedToken = this.jwtService.DecodeToken(this.userAPI.getToken());
        // console.log(decodedToken); 
        // let user_id = decodedToken.valueOf()
        localStorage.setItem('decodedJwt',JSON.stringify(decodedToken));
        console.log(JSON.stringify(decodedToken));
        this.storageService.store('decodedJwt',decodedToken);  
        var jsonObject = JSON.parse(JSON.stringify(decodedToken));          
         // store decoded token string  
         this._ngZone.run(()=>{
          // console.log("XXXXX-----SUCCESSFULL--LOGIN---XXXX");
          // this.sendUsertoHome(jsonObject.email);
          this.mobileisthere(jsonObject.userId,jsonObject.email);
          // this.router.navigate(['/home']); // here nevigate to home page 
          });
               
    },
    (error:any) => {
        console.log(error);
      }
    );  
}

async GmailDoesNotExistAddtoDBandSendToHome (email,name){
  this.waiting= true;
  //check if email exist ,if email exit check if its verified ? if verified then only google login
  this.userAPI.getUserbyEmail(email).subscribe(
    {
      next: (res) =>{ 
        console.log("verified user :-",res.verified);         
        let credentials = {
          email: res.email,
          password: 'googleuserlogin',
                }        
        this.http.post(this.url,credentials).subscribe(
          {
            next: async (res) =>{
          this.userAPI.setToken(res['token']); // to store locally token 
          localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
          this.waiting = false;
          this.router.navigateByUrl('/home',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
          
          },
            error: async (error) => {
                this.serverErrorMessage = error.error;
                this.waiting = false;
                this.emailExistButNotVerified(email);
                // check if email already exist or not ? if not exist redirect to signup page by showing alert
                console.log(error.error);
                this.presentAlertLogin('Google Mail Registration Failed..Err-502',error.error,'try again');    
                    }
            }
            );
    
        console.log(credentials);
      },
      error: async (error) => { // in this loop means user first time logging
        // this.serverErrorMessage = error.error;
        // check if email already exist or not ? if not exist redirect to signup page by showing alert
        console.log(error.error.message.includes('no data found with this ID'));
        if (error.error.message.includes('no data found with this ID')) {
          //means no user at DB then add to DB
          this.waiting = true;
          /**here can show present input alert and get mobile number as input , show backdrop dismiss flase
           * and then pass that input mobile number to user mobile.           
           */
          // this.mobileNumberInputAlert(name,email,'googleuserlogin');
          
      }
    }
    
  });
  

  
}

async GoogleuserLogin(email){
  let credentials = {
    "email": email,
    "password": "googleuserlogin",
  }
  
  this.http.post(this.url,credentials).subscribe(
    {
      next: (res) =>{
        this.userAPI.setToken(res['token']); // to store locally token 
    // this.isLoading=false;
    localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
    this.waiting = false;
    this.router.navigateByUrl('/home',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
   
    },
      error: (error) => {
          // this.serverErrorMessage = error.error;
          this.waiting = false;
              // this.emailExistButNotVerified(email);
          // check if email already exist or not ? if not exist redirect to signup page by showing alert
          console.log(error.error);
          // this.verifyEmailSignup();
          this.presentAlertLogin('Google User Login Failed ..Err-543',error.error,'try again');

              }
      }
      );

}

//toast 
async presentToast(message_, duration_,position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message_,
      duration: duration_,
      position: position,
    });
    await toast.present();
  }


  // mobile number input alert only i fmobile is not tthere 
  async mobileisthere(id,email){
    this.userAPI.getUserbyEmail(email).subscribe({
      next:res=>{
        if(res.mobile){
          this.sendUsertoHome(email); //
        }
        else{
          this.mobileNumberInputAlert(id,email);
        }
      },
      error:err=>{}
    });
  }
  // for member join gym alert to get verification code 
  async mobileNumberInputAlert(id,email) {
    

    this.waiting = false;;
    const alert = await this.alertCtrl.create({
      mode:'ios',
      backdropDismiss : false,
      header: 'Please enter Mobile Number',
      buttons: [
                {
                  text: 'Ok',
                  handler: (alertData) => { //takes the data 
                      const ent_mobile= alertData.code_entered;
                      console.log(ent_mobile);                     
                      this.entered_mobile = ent_mobile;
                      this.userAPI.update(id,{"mobile":ent_mobile}).subscribe({
                        next:res=>{
                          this.sendUsertoHome(email);
                        },
                        error:err=>{

                        }
                      });
                      // this.GoogleRegistrationFirstTime(name,email,this.entered_mobile,password);
                     },
                    }
            ],
      inputs: [
        {
          name:'code_entered',
          placeholder: 'Mobile Number',
          attributes: {
                        maxlength: 13,
                        minlength: 10,
                      },
        },
      ],
    });

    await alert.present();
  }

  //google registration 
  async GoogleRegistrationFirstTime(name,email,mobile,password){
    this.waiting = true;
          this.userAPI
            .googleUser_Register({
              "username": name,
              "email": email,
              "password": password,
              "mobile": mobile,
              "isMember": false,
              "isAdmin": false,
            })
            .subscribe({
              next: (res) => {
                console.log(res);
                //** here user verified and registration is done now set user as verified */
                this.userAPI.update(res._id, { "verified": true }).subscribe((data) => { 
                  console.log(data);// data here come without token so cant use that data 
                  this.GoogleuserLogin(res.email);// this will get verified token data
                    });
// here pass user credentials email and password and get user data with token and then route to home
/*********//////////////////////////////********* *//            
              },
              error: (e) => {
                this.waiting = false;
                this.isLoadingResults = false;
                this.presentAlert('Google Registration Failed..Err-549', e.error, 'try again');
              },

            });
        }
        
        // this.presentAlertLogin('Google Login Failed..Err-561', errorString, 'Try Login by Email');
}




// change design of login page 
// login by email 
// password
// login by gmail roung circle as fab icon in centre 