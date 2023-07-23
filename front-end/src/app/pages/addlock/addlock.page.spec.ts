import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddlockPage } from './addlock.page';

describe('AddlockPage', () => {
  let component: AddlockPage;
  let fixture: ComponentFixture<AddlockPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
