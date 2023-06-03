import { Component, OnInit,ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// to display QR code on html page 

//for gym select
import { GymService } from 'src/app/services/gym.service';

// to navigate page to memberlist

 

declare var require: any;

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-qrlabel',
  templateUrl: './qrlabel.page.html',
  styleUrls: ['./qrlabel.page.scss'],
})
export class QrlabelPage implements OnInit {

  title = 'htmltopdf';

   
  @ViewChild('pdfTable') pdfTable: ElementRef;

  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  gymIdforQRcode:any;
  gymname:any;

  
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gymApi : GymService,
  ) { 
    // const user = localStorage.getItem('User');
    // this.loggeduser=JSON.parse(user!);
    // console.log(this.loggeduser._id);
          // this.gymIdforQRcode = this.route.snapshot.paramMap.get('id');
          // if(!this.route.snapshot.paramMap.get('id')){
          //   console.log("no gym id came with route")
          // } else console.log("gym id is ",this.route.snapshot.paramMap.get('id') );
          // console.log(this.gymIdforQRcode);
          // this.gymApi.getGym(this.gymIdforQRcode).subscribe((data)=>{
          //   this.gymname = data.gym_name;
          // });
  }

  ngOnInit() {
    console.log()
    this.gymIdforQRcode = this.route.snapshot.paramMap.get('id');
    if(!this.route.snapshot.paramMap.get('id')){
      console.log("no gym id came with route");
    } else console.log("gym id is ",this.route.snapshot.paramMap.get('id') ,"QR code",this.gymIdforQRcode);
    // console.log(this.gymIdforQRcode);
    this.gymApi.getGym(this.gymIdforQRcode).subscribe((data)=>{
      this.gymname = data.gym_name;
    });
  }


  // @ViewChild('pdfTable') pdfTable!: ElementRef;
  
//   public exportPDF() {
//     // const pdfTable = 
//     console.log(this.pdfTable);
//     // var html = htmlToPdfmake(pdfTable.innerHTML);
//     // const documentDefinition = { content: html };
//     // pdfMake.createPdf(documentDefinition).download(); 
// }

downloadQrCode(){
  this.downloadAsPDF()
  this.router.navigate(['/gymtabs/member-list'],{replaceUrl:true});
}

// console.log(window.location.href);

public downloadAsPDF() {
  const pdf = new jsPDF();
  const pdfTable_ = document.getElementById('pdfTable');

//   const pdf = new jsPDF('p', 'pt', 'a4');
//     pdf.addHTML(pdfTable_, () => {
//     pdf.save('web.pdf');
// });
  // const pdfTable_ = this.pdfTable.nativeElement;
  
  var html = htmlToPdfmake(pdfTable_.innerHTML);
    
  const documentDefinition = { content: html };
  pdfMake.createPdf(documentDefinition).open();   

  //           pdf.setFontSize(15);
  //           // pdf.text('CraveCookie', 43, 20);

  //           pdf.setFontSize(10);
  //           // pdf.text('Scan For Menu', 43, 25);

  //           let base64Image = document.getElementById('qr_code_img');
  //           console.log(base64Image);

  //           // pdf.addImage(base64Image, 'png', 0, 0, 40, 40);
  //           pdf.save('generated.pdf');  
}

// downloadImage(name){
//   let url = window.location.href;
//   fetch(url)
//     .then(resp => resp.blob())
//     .then(blob => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         // the filename you want
//         a.download = name;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//     })
//     .catch(() => alert('An error sorry'));
// }

}
// https://www.elite-corner.com/2022/06/how-to-convert-html-to-pdf-in-angular-application.html