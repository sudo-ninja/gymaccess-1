import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportMemberGymPage } from './report-member-gym.page';

describe('ReportMemberGymPage', () => {
  let component: ReportMemberGymPage;
  let fixture: ComponentFixture<ReportMemberGymPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportMemberGymPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
