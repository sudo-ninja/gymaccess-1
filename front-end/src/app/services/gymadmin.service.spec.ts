import { TestBed } from '@angular/core/testing';

import { GymadminService } from './gymadmin.service';

describe('GymadminService', () => {
  let service: GymadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GymadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
