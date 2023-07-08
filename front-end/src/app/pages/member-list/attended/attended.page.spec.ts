import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendedPage } from './attended.page';

describe('AttendedPage', () => {
  let component: AttendedPage;
  let fixture: ComponentFixture<AttendedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AttendedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
