import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memberinfor',
  templateUrl: './memberinfor.page.html',
  styleUrls: ['./memberinfor.page.scss'],
})
export class MemberinforPage implements OnInit {

  constructor() {
    // to calculate attended days . call attendance API pass query as this.login member ID 
    // totle data length means that much attended in numbers. 
    // to get login member ID , call member api and pass email and get member ID.
    //to get end date pass member ID and fetch end date .

    // to update adress give link of google map and fetch lat long and pass them to update based on id.

    // for recharge request .. call rechargeAPI 
    // make alert controller
    // pass in handle API to add days to DB and status NOT
    // as soon as success saved in DB , pass message to admin in message center
    // if try to again request for recharge , check if status NOT then send alert 
    // if status Yes , then delet old request and add new 
    // status to be made Yes , if admin open message as alert controller and click on ok
    // and incresed validy end date by sent days and update member by id recharge status Yes.
    //

  }

  ngOnInit() {
  }

  logs: string[] = [];

  pushLog(msg) {
    this.logs.unshift(msg);
  }

  handleChange(e) {
    this.pushLog('ionChange fired with value: ' + e.detail.value);
  }

  // download data in CSV form , make function and get data from DB in CSV form
}
