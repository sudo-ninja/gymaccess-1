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

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email!: string; 
  password!:string;
  mobile!:string;
  username!:string;

  isMember:boolean=false;
  userexist:boolean = false;
  isLoading:boolean=false;
  userVerified:boolean = false;

  otpsent:boolean=false;

  errMsg:any;

  url: string = "http://localhost:3000/api/v1/user/register";

  constructor(
		private loadingController: LoadingController,
		private alertCtrl: AlertController,
		private router: Router,
    private http:HttpClient,
    private userAPI:UserService,
    private emailVerifyAPI : EmailverificationService,
  ) { }

  ngOnInit() {
  }

  async register(){
    const loading = await this.loadingController.create();
		await loading.present();

    let user = {
      email: this.email,
      password: this.password,
      mobile:this.mobile,
      username:this.username
    }
    this.userAPI.register(user).subscribe(res=>{
      console.log(res);
    },error =>{
        this.userexist=true;
        this.isLoading=false;
        this.usertest();
        console.log(error)
        this.presentAlert('Registration Failed',error.error,'try again')
    }
    
    
    );
    // this.presentAlert('Registration Failed',this.errMsg,'try again')


    // this.userAPI.register(user).subscribe((res)=>{
    //   try {
    //     this.isLoading=true;
    //     console.log(res);
    //     // this.verifyAlert();
    //   } catch (error) {
    //     this.isLoading=false;
    //   this.userexist=true;
    //   this.usertest();
    //   console.log(res);
    //   console.log(error);
    //   this.presentAlert('Registration Failed',error.error.message,'try again')
              
    //   }
      
    // } );

    // this.http.post(this.url,user).subscribe(res =>{
    //   localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
    //   this.router.navigateByUrl('',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
    //   this.isLoading=true;
    // },error =>{
    //   this.userexist=true;
    //   this.isLoading=false;
    //   this.usertest();
    //   console.log(error)
    //   this.presentAlert('Registration Failed',error.error.message,'try again')
    // });

    console.log(user);
    await loading.dismiss();

  }

async usertest(){
  if(this.userexist){
    console.log("User Email Exist try Forget Password")
  }
}

async presentAlert(header:string,subheader:string, message:string) {
  const alert = await this.alertCtrl.create({
    header:header,
    subHeader: subheader,
    message:message,
    buttons: ['OK'],
  });
  await alert.present();
  const {role}=await alert.onDidDismiss();
    // console.log('onDidDismiss resolved with role',role);
}
 
// create alert controller to get verification code input and paas that 
// to verifiy API to check if its correct 
// if time exired then create new alert that OTP expire , sent new OTP 
// as soon as OK is triggered call again input alert controller to verify otp
// once otp verified route to Login page .
async verifyAlert() {
  const alert = await this.alertCtrl.create({
    header: 'Please Enter Verification Code.',
    subHeader:`Code Sent to ${this.email} .`,
    buttons: [
              {
                text: 'Ok',
                handler: (alertData) => { //takes the data 
                    
                    const var_code= alertData.code_entered;
                    console.log(var_code);
                    if(!var_code){
                      console.log("no data");
                      this.presentAlert('Empty Field Not Allowed','Enter OTP ','try again')
                    }else{
                    // call verification service 
                    this.emailVerifyAPI.verifyEmail({
                      "email":this.email,
                      "otp":var_code
                    }).subscribe((res)=>{
                      console.log(res);
                      // here all goods then redirect to new page or 
                      this.userVerified = true;
                    },error=>{
                      console.log(error.error);
                      this.presentAlert('Alert!',error.error,'try again')
                    }
                    );
                  };                   
                 }
              },
              {
                text: 'Resend',
                handler: (alertData) => { 
                  this.sendVerificationCode();
                 }
              },
        
          ],
    inputs: [
      {
        name:'code_entered',
        placeholder: 'Verificaion Code',
        attributes: {
                      maxlength: 6,
                    },
      },
    ],
  });

  await alert.present();
}


sendVerificationCode(){
  // first check if already verfied if already verified then 
  this.userAPI.getUserbyEmail(this.email).subscribe(res=>{
    // if user exits or not 
    let verified:boolean = false;
    verified = res.verified;
    if(verified){
      this.verifiedUser();
    }else{
      this.verifyEmail();
    }
  },error=>{
    if(error.status == 404){
      this.verifyEmail();
    }
  });
  
}
// verifiy email 
verifyEmail(){
  this.emailVerifyAPI.newVerificationOTP({"email":this.email}).subscribe(res=>{
    console.log(res);
    if(res){
    this.otpsent=true;
    }if(this.otpsent){
      
      this.verifyAlert();
    }
  },error=>{
    console.log(error);
    if(error.status == 400){
      this.presentAlert('Alert !','Email ID is Wrong','try again');
    }
    
  }
  );
}

// already verified user alert with forget password and login
async verifiedUser() {
  const alert = await this.alertCtrl.create({
    header: `${this.email} already verified ! .`,
    buttons: [
              {
                text: 'Login',
                role: 'login',
                handler: (alertData) => { //navigate to login page

                 }
              },
              {
                text: 'Forgot Password?',
                role: 'forgot',
                handler: (alertData) => { 
                 // navigate to forget password page
                 }
              },
        
          ],
    
  });

  await alert.present();
}

}
