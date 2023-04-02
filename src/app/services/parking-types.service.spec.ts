import { TestBed } from '@angular/core/testing';

import { ParkingTypesService } from './parking-types.service';

describe('ParkingTypesService', () => {
  let service: ParkingTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
