import { TestBed } from '@angular/core/testing';

import { TemporService } from './tempor.service';

describe('TemporService', () => {
  let service: TemporService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
