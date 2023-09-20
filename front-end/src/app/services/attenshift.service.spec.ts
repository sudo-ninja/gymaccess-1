import { TestBed } from '@angular/core/testing';

import { AttenshiftService } from './attenshift.service';

describe('AttenshiftService', () => {
  let service: AttenshiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttenshiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
