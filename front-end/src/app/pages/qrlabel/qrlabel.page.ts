import { Component, OnInit,ElementRef, ViewChild  } from '@angular/core';

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

  constructor() { }

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
}
// https://www.elite-corner.com/2022/06/how-to-convert-html-to-pdf-in-angular-application.html