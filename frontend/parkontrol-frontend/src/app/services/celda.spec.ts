import { TestBed } from '@angular/core/testing';

import { Celda } from './celda';

describe('Celda', () => {
  let service: Celda;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Celda);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
