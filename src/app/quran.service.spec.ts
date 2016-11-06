/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuranService } from './quran.service';
import {HttpModule} from "@angular/http";

describe('Service: Quran', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuranService],
      imports:[HttpModule]
    });
  });

  it('should ...', inject([QuranService], (service: QuranService) => {
    expect(service).toBeTruthy();
  }));
  describe('ayas and suras', function() {
    var q;
    beforeAll(()=>{
      inject([QuranService], (service:QuranService) => {
        service.getQuran()
          .subscribe()
      });
    });

    it('it should have getQuran()', inject([QuranService], (service:QuranService) => {
      expect(service.getQuran()).toBeTruthy();
    }));
  })

});
