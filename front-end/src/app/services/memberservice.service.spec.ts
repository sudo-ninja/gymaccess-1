import { TestBed } from '@angular/core/testing';

import { MemberserviceService } from './memberservice.service';

describe('MemberserviceService', () => {
  let service: MemberserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
