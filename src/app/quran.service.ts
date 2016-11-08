import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { QURAN_DATA } from './quran-data';
import { Subject } from "rxjs/subject";

@Injectable()
export class QuranService {
  private contentChangeStream = new Subject<boolean>();
  contentChanged$ = this.contentChangeStream.asObservable();

  constructor(private http:Http) { }

  getQuran(){
    return this.http.request('assets/quran-simple-enhanced.json')
      .map(res => res.json().data);
  }

  contentChange(){
      this.contentChangeStream.next(true);
  }
}
