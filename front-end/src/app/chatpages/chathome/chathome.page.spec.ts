import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChathomePage } from './chathome.page';

describe('ChathomePage', () => {
  let component: ChathomePage;
  let fixture: ComponentFixture<ChathomePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChathomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
