import { TestBed } from '@angular/core/testing';

import { StandTypesService } from './stand-types.service';

describe('StandTypesService', () => {
  let service: StandTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
