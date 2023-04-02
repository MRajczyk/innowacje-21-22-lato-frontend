import { TestBed } from '@angular/core/testing';

import { StandsService } from './stands.service';

describe('StandsService', () => {
  let service: StandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
