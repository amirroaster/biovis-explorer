import { TestBed } from '@angular/core/testing';

import { PubchemService } from './pubchem.service';

describe('PubchemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PubchemService = TestBed.get(PubchemService);
    expect(service).toBeTruthy();
  });
});
