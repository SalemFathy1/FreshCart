import { TestBed } from '@angular/core/testing';

import { CategoiresService } from './categoires.service';

describe('CategoiresService', () => {
  let service: CategoiresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoiresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
