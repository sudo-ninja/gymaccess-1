import { Injectable } from '@angular/core';


import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) { 
    // this.init();
  }

  async store(storageKey:string,value:any){
    const ecryptedValue = btoa(escape(JSON.stringify(value)));
    return await this.storage.set(storageKey,ecryptedValue);
  }

  async get(storageKey:string){
    return new Promise(resolve=>{
      this.storage.get(storageKey).then((value)=>{
        if(value==null){
          resolve(false);
        }else{
          resolve(JSON.parse(unescape(atob(value))));
        }
      })
    });
  }

  async removeItem(storageKey:string){
    await this.storage.remove(storageKey)
  }

  async clear(){
    await this.storage.clear();
  }
  // async init() {
  //   // If using, define drivers here: await this.storage.defineDriver(/*...*/);
  //   const storage = await this.storage.create();
  //   this._storage = storage;
  // }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }


}
