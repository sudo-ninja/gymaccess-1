import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {

  constructor() { }

  // Welcome by Logger User name 
  // if logged user is member then change the page information 
  // if logged user is admin then in gym managment show .. gym , associated with him , gym names, 
  //if logged user is member then in gym management show .. gym joined by him 
  // in message centre if loffed user is admin then here hw should get all mrequest sent by members to him
  // for extension show them as one liner .. if click that one liner then show that in alert ..
  // if click Ok in alert send back response message as delivered to member message centre with Accepted or Denied.
  // help and feedback .. keep some text area here limit 140 char, as soon as type start show
  // submit button 
  // as soon as submit is prssed store this message in DB and back end let this message go to app developer 
  // using node mailer along with member ID 

  /* in setting button .. show user profile 
  user profile containing 
  name 
  email id
  telephone 
  address

  also privacy policy
  about 
  terms and conditions
  and at bottom logout 
  logout function with all delet cache data and all local storage clear , session clear data
  

   */

  ngOnInit() {
  }

  getImage(){
    
  }

}
