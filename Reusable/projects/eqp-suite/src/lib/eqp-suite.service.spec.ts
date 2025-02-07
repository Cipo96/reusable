import { TestBed } from '@angular/core/testing';

import { EqpSuiteService } from './eqp-suite.service';

describe('EqpSuiteService', () => {
  let service: EqpSuiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EqpSuiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
