import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email!: string; 
  password!:string;
  isLoading: boolean=false;

  url: string = "http://localhost:3000/users/login";


  constructor(
    private fb: FormBuilder,
		private loadingController: LoadingController,
		private alertController: AlertController,
		private router: Router,
    private http:HttpClient,
  ) { }

  ngOnInit() {
  }

  async login(){
    const loading = await this.loadingController.create();
		await loading.present();
    let credentials = {
      email: this.email,
      password: this.password,
    }

    this.http.post(this.url,credentials).subscribe(res =>{
      this.isLoading=false;
      localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
      this.router.navigateByUrl('',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
      this.isLoading=true;
    },error =>{
      this.isLoading=false;
      console.log(error);
      this.presentAlert('Login Failed',error.error.message,'try again');
    });

    console.log(credentials);
    await loading.dismiss();
  }

  async presentAlert(header:string,subheader:string, message:string) {
    const alert = await this.alertController.create({
      header:header,
      subHeader: subheader,
      message:message,
      buttons: ['OK'],
    });
    await alert.present();
    const {role}=await alert.onDidDismiss();
    // console.log('onDidDismiss resolved with role',role);
  }
//  
 

}
