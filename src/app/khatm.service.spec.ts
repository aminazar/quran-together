import { TestBed, inject } from '@angular/core/testing';

import { KhatmService } from './khatm.service';

describe('KhatmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KhatmService]
    });
  });

  it('should be created', inject([KhatmService], (service: KhatmService) => {
    expect(service).toBeTruthy();
  }));
});
