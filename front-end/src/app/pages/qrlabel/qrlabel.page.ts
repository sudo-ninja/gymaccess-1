import { Component, OnInit,ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// to display QR code on html page 

//for gym select
import { GymService } from 'src/app/services/gym.service';

// to navigate page to memberlist

 

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-qrlabel',
  templateUrl: './qrlabel.page.html',
  styleUrls: ['./qrlabel.page.scss'],
})
export class QrlabelPage implements OnInit {

  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  gymIdforQRcode:any;
  gymname:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gymApi : GymService,
  ) { 
    const user = localStorage.getItem('User');
    this.loggeduser=JSON.parse(user!);
    console.log(this.loggeduser._id);
    this.gymIdforQRcode = this.route.snapshot.paramMap.get('id');
    if(!this.route.snapshot.paramMap.get('id')){
      console.log("no gym id came with route")
    } else console.log("gym id is ",this.route.snapshot.paramMap.get('id') );
    console.log(this.gymIdforQRcode);
    this.gymApi.getGym(this.gymIdforQRcode).subscribe((data)=>{
      this.gymname = data.gym_name;
    });
  }

  ngOnInit() {
  }


  @ViewChild('pdfTable') pdfTable!: ElementRef;
  
  public exportPDF() {
    // const pdfTable = 
    console.log(this.pdfTable);
    // var html = htmlToPdfmake(pdfTable.innerHTML);
    // const documentDefinition = { content: html };
    // pdfMake.createPdf(documentDefinition).download(); 
}

downloadQrCode(){
  this.router.navigate(['/gymtabs/member-list'],{replaceUrl:true});
}
}
// https://www.elite-corner.com/2022/06/how-to-convert-html-to-pdf-in-angular-application.html