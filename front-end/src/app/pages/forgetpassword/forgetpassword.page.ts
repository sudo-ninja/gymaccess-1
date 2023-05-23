import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {

  isLoadingResults = false;

  authForm!: FormGroup;
  resetForm!: FormGroup;
  isSubmitted  =  false;
  isOTPmailed = false;

  serverErrorMessage:string;


  constructor(
    private alertCtrl: AlertController,
    private userApi : UserService,
    private fb: FormBuilder,
    private router:Router,
  ) { }

  ngOnInit() {
    this.authForm  =  this.fb.group({
      email: ['',[ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),],],
      mobile: ['', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13),
        Validators.pattern('^[0-9]*$')]]
  });

  this.resetForm  =  this.fb.group({
    email: ['',[ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),],],

    otp: ['', Validators.required],
    newPassword:['',[Validators.required,
                    Validators.minLength(8),]],
});
  

  }


  
  // join gym alert to get verification code 
  async verificationAlert() {
    // call loading true
    this.isLoadingResults = true;
    this.userApi.forgetPassword(this.authForm.value).subscribe({
      next:(res)=> { console.log(res);
        this.isLoadingResults = false;
      },
      error:(error)=>{ console.log(error)
        this.isLoadingResults = false;},
    })
    // shoot email for verification (code by htting API.
    // if success full hit then set loading .false and then only this alert
    // if user email not found in user DB then
                      // check if mobile is there in DB 
                      // if mobile also not found 
                      // take to register page by showing Alert// seems new to our system // get register
                      //if mobile found then preset alert "you are entering wrong email id " try with  email fg***gh@gm**.com""

    const alert = await this.alertCtrl.create({
      header: 'Please Enter Verification Code',
      subHeader:'Get verification code from your email inbox.',
      buttons: [
                {
                  text: 'Ok',
                  handler: (alertData) => { //takes the data 
                      const var_code= alertData.code_entered;
                      console.log(var_code);
                      // if verification code matched check by calling api  
                      this.successVerificationAlert();
                      // if not macthed 
                      // prompt again 
                      /*Back to Forget Password Page*/
                      

                        }
                       
                      
                    },
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                        // this.handlerMessage = 'Alert canceled';
                      },
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

  // if verification code correct then this alert
  async successVerificationAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Set New Password',
      
      buttons: [
                {
                  text: 'Ok',
                  handler: (alertData) => { //takes the data 
                      const var_password= alertData.password;
                      const var_confirmpassword = alertData.confirm_password;
                      if(var_password === var_confirmpassword){
                       //check both password same or not 
                       console.log(var_password);
                       // if same then update password by calling api 
                       // sucessfull saved in DB then only take to login page 
                       // if password not same thenshow alert both password not same
                      }
                        }
                                      },
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                        // this.handlerMessage = 'Alert canceled';
                      },
                    },
                          
                ],
                inputs: [
                  {
                    name:'password',
                    placeholder: 'New Password',
                    type:'password',
                    attributes: {
                                  minlength: 6,
                                },
                  },

                  {
                    name:'confirm_password',
                    placeholder: 'Confirm Password',
                    type:'password',
                    attributes: {
                                  minlength: 6,
                                },
                  },
                ],
    });
  

    await alert.present();
  }
 
  getOTP(){
    this.isSubmitted = true;
    this.userApi.forgetPassword(this.authForm.value).subscribe({
      next:(res)=>{if(res.otp){this.isOTPmailed=true}},
      error:(err)=>{this.serverErrorMessage = err.error},
    });
  }

  resetPassword(){
    this.isSubmitted = true;
    this.userApi.forgetPasswordReset(this.resetForm.value).subscribe({
      next:(res)=>{if(res.passwordreset){this.router.navigateByUrl('/login',{replaceUrl:true})}},
      error:(err)=>{this.serverErrorMessage = err.error},
    });
  }
}
