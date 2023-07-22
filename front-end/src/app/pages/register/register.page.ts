import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { error } from 'console';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
// call service for email verificaation
import { EmailverificationService } from 'src/app/services/emailverification.service';
import { UserService } from 'src/app/services/user.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email!: string;
  password!: string;
  mobile!: string;
  username!: string;
 

  registerForm!: FormGroup;
  isSubmitted = false;
  isSubmittedGVC = false;
  btnstate: boolean=false;

  isMember: boolean = false;
  userexist: boolean = false;
  isLoading: boolean = false;
  userVerified: boolean = false;
  showSpinner:boolean = false; // when user press get verification code 

  otpsent: boolean = false;

  errMsg: any;
  serverErrorMessage:string;

  isLoadingResults = false;

  constructor(
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private userAPI: UserService,
    private emailVerifyAPI: EmailverificationService
  ) {}

  ngOnInit() {}

  registration(email_: any) {
    this.registerForm = this.fb.group({
      email: [email_,[ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),],],
      username: ['', [Validators.required,Validators.minLength(3),]],
      mobile: ['', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13),
        Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required,
        Validators.minLength(8),]],
    });
  }

  

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.isSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    // console.log(this.registerForm.value);    
    this.isLoadingResults = true;
    this.userAPI.register(this.registerForm.value).subscribe(
      {
        next: (res) =>{
          console.log(res);
        this.isLoadingResults = false;
        //** here user verified and registration is done now set user as verified */
        this.userAPI.update(res._id,{"verified":true}).subscribe(res=>{
          console.log(res);
        });
        /** and then either send to login or home page */
        this.router.navigateByUrl('/login', { replaceUrl: true });
        },        
        error: (e) => {
          // console.error(e)
          this.isLoading = false;
          // console.log(error)
          this.isLoadingResults = false;
          this.presentAlert('Registration Failed', e.error, 'try again');
        }
  
      }
          );
    // console.log(user);
    await loading.dismiss();
  }

  

  async presentAlert(header: string, subheader: string, message: string) {
    this.isLoadingResults = false;
    this.showSpinner = false;
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    // console.log('onDidDismiss resolved with role',role);
  }

 
//  to keep get verification button disable after first click
onKey(event: KeyboardEvent) { 
  // Checking to see if value is empty or not
  // remember we are using ternary operator here 
  this.btnstate = (event.target as HTMLInputElement).value === '' ? true:false;
}

  // verify email ID at time of signup without saving that to DB
  async sendVerificationCodeSignup() {
    // use this tutorial to for button disabled https://tutorialscamp.com/angular-disable-button/
    this.btnstate = !this.btnstate;
    this.showSpinner = true;
    // const loading = await this.loadingController.create();
    // await loading.present();
    // // first check if user already there in DB and already verfied if already verified then
    // this.isLoadingResults = true;
    this.userAPI.getUserbyEmail(this.email).subscribe(
      (res) => {
        // if user exits or not
        let verified: boolean = false;
        verified = res.verified;
        if (verified) {
          this.isLoadingResults = false;
          // console.log(this.isLoadingResults);
          this.verifiedUser();
        } else {
          this.isLoadingResults = false;
          this.verifyEmailSignup();
        }
      },//  if user does not exist 
      (error) => {
        this.isLoadingResults = false;
        // console.log(this.isLoadingResults);
        console.log(error.error);
        if (error.status === 404) {
          this.verifyEmailSignup();
          // this.isLoadingResults = true;
        }
      }
    );

    // await loading.dismiss();
  }

// user first time signup 
// verifiy email
verifyEmailSignup() {
  // this.isLoadingResults=true;
  this.emailVerifyAPI.signupEmail({ email: this.email }).subscribe(
    (res) => {
      console.log(res);
      if (res) {
        this.otpsent = true;
        this.isLoadingResults = false;
        this.verifyAlert();
      }
      if (this.otpsent) {
        // this.isLoadingResults = false;
        // this.verifyAlert();
      }
    },
    (error) => {
      console.log(error);
      if (error.status == 400) {
        this.isLoadingResults = false;
        this.presentAlert('Alert !', error.error, 'try again');
      }
    }
  );
}



  async verifyAlert() {
    this.showSpinner = false;
    const alert = await this.alertCtrl.create({
      header: 'Please Enter Verification Code.',
      subHeader: `Code Sent to ${this.email} .`,
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
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
                  email: this.email,
                  otp: var_code,
                })
                .subscribe(
                  (res) => {
                    console.log(res);
                    // here all goods then redirect to new page or
                    this.userVerified = true; // to change div at html page
                    /** here call API and set user as verified  */


                    this.registration(res.email);
                    //as password not formed so can not route this
                    // let it be on registration page to form password
                    // this.router.navigateByUrl('/login',{replaceUrl:true});
                  },
                  (error) => {
                    console.log(error.error);
                    this.presentAlert('Alert!', error.error, 'try again');
                  }
                );
            }
          },
        },
        // {
        //   text: 'Resend',
        //   handler: (alertData) => {
        //     this.sendVerificationCode();
        //   },
        // },
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

  sendVerificationCode() {
    // first disabled button  and enabled that button once alert is present
  //  this.isSubmittedGVC = true
    // first check if already verfied if already verified then
    this.isLoadingResults = true;
    console.log(this.isLoadingResults);

    this.userAPI.getUserbyEmail(this.email).subscribe(
      (res) => {
        // if user exits or not
        let verified: boolean = false;
        verified = res.verified;
        if (verified) {
          this.isLoadingResults = false;
          // console.log(this.isLoadingResults);

          this.verifiedUser();
        } else {
          this.isLoadingResults = false;
          console.log(this.isLoadingResults);

          this.verifyEmail();
        }
      },
      (error) => {
        this.isLoadingResults = false;
        // console.log(this.isLoadingResults);

        if (error.status == 404) {
          this.verifyEmail();
        }
      }
    );
  }
  // verifiy email
  verifyEmail() {
    // this.isLoadingResults=true;
    this.emailVerifyAPI.newVerificationOTP({ email: this.email }).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.otpsent = true;
        }
        if (this.otpsent) {
          this.isLoadingResults = false;
          this.verifyAlert();
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
  async verifiedUser() {
    // this.isLoadingResults=false;
    const alert = await this.alertCtrl.create({
      header: `${this.email} already verified ! .`,
      buttons: [
        {
          text: 'Login',
          role: 'login',
          handler: (alertData) => {
            //navigate to login page
            this.router.navigateByUrl('/login', { replaceUrl: true });
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

  // once user email verified lets
}
