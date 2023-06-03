import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackAlertPage } from './feedback-alert.page';

describe('FeedbackAlertPage', () => {
  let component: FeedbackAlertPage;
  let fixture: ComponentFixture<FeedbackAlertPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FeedbackAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
