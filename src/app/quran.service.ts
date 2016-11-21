import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { QURAN_DATA } from './quran-data';
import { Subject } from "rxjs/subject";

const FONT_PARAMS = {
  quran:                  [ 56/67, 130, false ],
  "quran-uthmanic":       [46/67, 150, true ],
  "quran-uthmanic-bold":  [37/50, 160, true],
  "qalam":                [34/50, 155, true],
  "me-quran":             [30/54, 185, true]
}

@Injectable()
export class QuranService {
  private contentChangeStream = new Subject<number>();
  private zoomChangeStream = new Subject<number>();
  contentChanged$ = this.contentChangeStream.asObservable();
  zoomChanged$ = this.zoomChangeStream.asObservable();
  curZoom = 0;
  private fontChangeStream = new Subject<number>();
  fontChanged$ = this.fontChangeStream.asObservable();
  font = 0;

  constructor(private http:Http) { }

  getQuran(){
    return this.http.request('assets/quran-simple-enhanced.json')
      .map(res => res.json().data);
  }

  getPage(pageNum){
    var page = QURAN_DATA.page.getSection(pageNum);
    return page;
  }

  getSection(sectionName, sectionNum){
    var section = QURAN_DATA[sectionName].getSection(sectionNum);
    return section;
  }

  applySectionFilter(sectionType, ayas, index){
    return QURAN_DATA[sectionType].filterFunc(ayas,index);
  }

  getRukus(rukuNum){
    var ruku = QURAN_DATA.ruku.getSection(rukuNum);
    return ruku;
  }
  getSura(suraNum){
    return QURAN_DATA.suras[suraNum-1];
  }
  contentChange(layer){
    this.contentChangeStream.next(layer);
  }
  zoomIn(){
    this.curZoom++;
    this.zoomChangeStream.next(this.curZoom);
  }
  zoomOut(){
    this.curZoom--;
    this.zoomChangeStream.next(this.curZoom);
  }
  resetZoom(){
    this.curZoom=0;
    this.zoomChangeStream.next(0);
  }
  fontChange(){
    this.font++;
    this.fontChangeStream.next(this.font);
  }
  fontParams(fontFamily){
    return FONT_PARAMS[fontFamily]
  }
}
