import { TestBed } from '@angular/core/testing';

import { EmailverificationService } from './emailverification.service';

describe('EmailverificationService', () => {
  let service: EmailverificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailverificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
