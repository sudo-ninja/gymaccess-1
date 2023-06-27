import { Component, OnInit,ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
// to create local storgae file in device memory
import {Filesystem,Directory} from "@capacitor/filesystem";
// to display QR code on html page 

//for gym select
import { GymService } from 'src/app/services/gym.service';
// for html to image
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';


@Component({
  selector: 'app-qrlabel',
  templateUrl: './qrlabel.page.html',
  styleUrls: ['./qrlabel.page.scss'],
})
export class QrlabelPage implements OnInit {
  loggeduser: any; // serviceprovider means admin as he is providing service to members.
  gymIdforQRcode: any;
  gymname: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gymApi: GymService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.gymIdforQRcode = this.route.snapshot.paramMap.get('id');
    if (!this.route.snapshot.paramMap.get('id')) {
      // console.log("no gym id came with route");
    } else
      console.log(
        'gym id is ',
        this.route.snapshot.paramMap.get('id'),
        'QR code',
        this.gymIdforQRcode
      );
    // console.log(this.gymIdforQRcode);
    this.gymApi.getGym(this.gymIdforQRcode).subscribe((data) => {
      this.gymname = data.gym_name;
    });
  }

  downloadQrCode() {
    this.downloadasPNG(this.gymIdforQRcode);
    this.router.navigate(['/gymtabs/member-list'], { replaceUrl: true });
  }

  // to download element as png
  public downloadasPNG(id) {
    let ref = this;
    htmlToImage.toPng(document.getElementById('downloadme')).then((dataUrl) => {
      // to save in local file system
      if (ref.platform.is('android') || ref.platform.is('ios')) {
        Filesystem.writeFile({
          path: Date.now().toString() + '.png',
          data: dataUrl,
          directory: Directory.Documents,
        }).then(
          (res) => {
            alert('file saved at ' + res.uri);
            const link: any = document.createElement('a');
            link.download = `${id}.png`;
            link.href = dataUrl;
            link.click();
          },
          (err) => {
            alert(JSON.stringify(err));
          }
        );
      } else {
        // for browser
        const link: any = document.createElement('a');
        link.download = `${id}.png`;
        link.href = dataUrl;
        link.click();
      }
    });
  }

}