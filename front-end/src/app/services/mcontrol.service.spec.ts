import { TestBed } from '@angular/core/testing';

import { McontrolService } from './mcontrol.service';

describe('McontrolService', () => {
  let service: McontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
