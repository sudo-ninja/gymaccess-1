import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {
  holiday: any;

  constructor() { }

  private data: any;
  private holidaydata: any;

  setData(data: any) {
    this.data = data;
  }

  setHolidayData(data: any) {
    this.holidaydata = data;
  }

  setHoliday(data: any) {
    this.holiday = data;
  }

  getData() {
    return this.data;
  }

  getHolidayData() {
    return this.holidaydata;
  }

  getHoliday() {
    return this.holiday;
  }
  
}
