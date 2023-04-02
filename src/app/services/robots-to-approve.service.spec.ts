import { TestBed } from '@angular/core/testing';

import { RobotsToApproveService } from './robots-to-approve.service';

describe('RobotsToApproveService', () => {
  let service: RobotsToApproveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RobotsToApproveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
