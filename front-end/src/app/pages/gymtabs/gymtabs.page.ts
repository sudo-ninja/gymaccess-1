import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
// import { IonTab } from '@ionic/core/components';
import {AlertButton} from "@ionic/core";

@Component({
  selector: 'app-gymtabs',
  templateUrl: './gymtabs.page.html',
  styleUrls: ['./gymtabs.page.scss'],
})
export class GymtabsPage implements OnInit {

  selectedTab:any;
  @ViewChild('gymtabs',{static:false}) tabs: IonTabs;

  constructor() { }

  ngOnInit() {
  }

  setCurrentTab(){
    this.selectedTab = this.tabs.getSelected();
    console.log(this.selectedTab);
  }
}
