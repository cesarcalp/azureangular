import { TestBed } from '@angular/core/testing';

import { DataApiClientService } from './data-api-client.service';

describe('DataApiClientService', () => {
  let service: DataApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
