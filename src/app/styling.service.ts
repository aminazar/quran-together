import { Injectable } from '@angular/core';

import {QuranService} from "./quran.service";
import {combineAll} from "rxjs/operator/combineAll";

@Injectable()
export class StylingService {


  constructor(private quranService: QuranService) {
    this.quranService.nightMode$.subscribe(
      (data) => {
        if(data){

        }
        else{

        }
      }
    )
  }

  getStyle(): any{

  }
}
