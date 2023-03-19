import { Component, ViewChild,ElementRef, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';

// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';


@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.page.html',
  styleUrls: ['./gmap.page.scss'],
})
export class GmapPage implements OnInit {



  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  center: any = {
    lat: 28.6468935,
    lng: 76.9531791,
  };
  markerId: string;

   i:Number =1;

  mylat:any;
  mylng: any;

  mylat_:any;
  mylng_: any;

  gymlat:any
  gymlng:any

  constructor(
    //  nativeGeocoder: NativeGeocoder
    private router: Router,
     ) {}
 

//   options: NativeGeocoderOptions = {
//     useLocale: true,
//     maxResults: 5
// };

// this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
//   .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
//   .catch((error: any) => console.log(error));

// this.nativeGeocoder.forwardGeocode('Berlin', options)
//   .then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
//   .catch((error: any) => console.log(error));

  // if promise then block with res to be used to be used

  fetchLocation(){
    const _geoLocation = Geolocation.getCurrentPosition();
    console.log('current location =', _geoLocation);

    // this.nativegeocoder.reverseGeocode(_geoLocation.coords.latitude,_geoLocation.coords.longitude,)
      
  // const _geoLocation = Geolocation.getCurrentPosition().then(res=>{
  //   console.log(res);
  // });
}

locationfixed(){
  console.log(this.i);
  if(this.i===1){
    this.gymlat=this.mylat,
    this.gymlng=this.mylng
  };
  if(this.i===2){
    this.gymlat=this.mylat_,
    this.gymlng=this.mylng_
  };

  localStorage.setItem('gymLat',this.gymlat);
  localStorage.setItem('gymLng',this.gymlng);
  this.router.navigate(['/gym-add']);
}

  ngOnInit() {
    // this.createMap();
  }

  ionViewDidEnter() {
    this.createMap();
  }

  ngAfterViewInit() {
    // this.createMap();
  }

  ngAfterContentInit() {
    // this.createMap();
  }

  ngAfterContentChecked() {
    // this.createMap();
  }

  async locate() {
    if(this.newMap) await this.newMap.enableCurrentLocation(true);
// geolocation plugin will give accurate current location
    const printCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();    
      console.log('Current position:--', coordinates.coords.latitude,coordinates.coords.longitude);
     };
    // const _geoLocation = Geolocation.getCurrentPosition();
    console.log('current location =', this.mylat,this.mylng);
  }

  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'capacitor-google-map',
        element: this.mapRef.nativeElement,
        apiKey: environment.googleMapsApiKey,
        config: {
          center: this.center,
          zoom: 13,
        },
        // forceCreate: true
      });
      console.log('newmap', this.newMap);
      // alert('newmap'+ this.newMap);
      // if(this.newMap) await this.setCamera();

        // Enable marker clustering
      // await this.newMap.enableClustering();


      // await this.newMap.enableCurrentLocation(true);

      // await this.newMap.setMapType(MapType.Satellite);
  
      await this.addMarker(this.center.lat, this.center.lng);
      await this.addListeners();
    } catch(e) {
      console.log(e);
      // alert(e);
    }
  }

  async setCamera() {
    // Move the map programmatically
    await this.newMap.setCamera({
      coordinate: {
        // lat: this.center.lat,
        // lng: this.center.lng,
        lat: 28.782991, 
        lng: 76.945626,
      },
      zoom: 13,
      // animate: true
    });

    // Enable traffic Layer
    await this.newMap.enableTrafficLayer(true);

    if(Capacitor.getPlatform() !== 'web') {
      await this.newMap.enableIndoorMaps(true);
      // await this.newMap.setMapType(MapType.Satellite);
    }


    await this.newMap.setPadding({
        top: 50,
        left: 50,
        right: 0,
        bottom: 0,
      });
  }

  async addMarkers(lat, lng) {
    // Add a marker to the map
    // if(this.markerId) this.removeMarker();
    await this.newMap.addMarkers([
      {
        coordinate: {
          lat: lat,
          lng: lng,
        },
        // title: ,
        draggable: true
      },
      {
        coordinate: {
          lat: 28.782991, 
          lng: 76.945626,
        },
        // title: ,
        draggable: true
      },
    ]);
  }
  
  async addMarker(lat, lng) {
    // Add a marker to the map
    if(this.markerId) this.removeMarker();
    this.markerId = await this.newMap.addMarker({
      coordinate: {
        lat: lat,
        lng: lng,
      },
      // title: ,
      draggable: false
    });
  }

  async removeMarker(id?) {
    await this.newMap.removeMarker(id ? id : this.markerId);
  }

  async addListeners() {
    // Handle marker click
    await this.newMap.setOnMarkerClickListener((event) => {
      console.log('setOnMarkerClickListener', event);
      this.removeMarker(event.markerId);
    });

    await this.newMap.setOnCameraMoveStartedListener((event) => {
      console.log(event);
    });

    await this.newMap.setOnCameraIdleListener((event) => {
      console.log('idle: ', event);
      // alert(event);
      this.center = {
        lat: event.latitude,
        lng: event.longitude
      }
      this.addMarker(this.center.lat, this.center.lng);
      this.mylat=event.latitude;
      this.mylng=event.longitude;
      this.i=1;
    });

    await this.newMap.setOnMapClickListener((event) => {
      console.log('setOnMapClickListener', event);
      console.log('setonMapClick Lat and Long= ', event.latitude,event.longitude);
      this.addMarker(event.latitude, event.longitude);
      this.mylat_=event.latitude;
      this.mylng_=event.longitude;
      this.i=2;
    });

  //   await this.newMap.setOnMyLocationButtonClickListener((event) => {
  //     console.log('setOnMyLocationButtonClickListener', event);
  //     // this.addMarker(event.latitude, event.longitude);
  //   });

  //   await this.newMap.setOnMyLocationClickListener((event) => {
  //     console.log('setOnMyLocationClickListener', event);
  //     this.addMarker(event.latitude, event.longitude);
  //   });
  // }

  }
}
