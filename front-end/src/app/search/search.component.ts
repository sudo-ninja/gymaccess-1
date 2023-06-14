import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  enteredSearchValue : any = '';

  @Output()  searchTextChanged:EventEmitter<any> = new EventEmitter<any>();

  onSearchTextChanged(){
    this.searchTextChanged.emit(this.enteredSearchValue);
  }
}
