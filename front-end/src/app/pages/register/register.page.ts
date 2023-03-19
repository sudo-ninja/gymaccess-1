import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

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

  url: string = "http://localhost:3000/users/register";

  constructor(
		private loadingController: LoadingController,
		private alertController: AlertController,
		private router: Router,
    private http:HttpClient,
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
    this.http.post(this.url,user).subscribe(res =>{
      localStorage.setItem('User',JSON.stringify(res)) // trick use to transfer login user data to home page by get and set method
      this.router.navigateByUrl('',{replaceUrl:true}) // url is replaces so that use cant go back to login page without logout
      this.isLoading=true;
    },error =>{
      this.userexist=true;
      this.isLoading=false;
      this.usertest();
      console.log(error)
      this.presentAlert('Registration Failed',error.error.message,'try again')
    });

    console.log(user);
    await loading.dismiss();

  }

async usertest(){
  if(this.userexist){
    console.log("User Email Exist try Forget Password")
  }
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
// onServiceselect(e){
//   let response = e.detail.value
//  console.log(e.detail.value)
// if(response=='no'){
// this.isServiceprovider=false
// }else{this.isServiceprovider=true}


// }

}
