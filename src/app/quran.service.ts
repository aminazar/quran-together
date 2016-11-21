import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { QURAN_DATA } from './quran-data';
import { Subject } from "rxjs/subject";

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

  sajdaCheck(obj){
    var arr = QURAN_DATA.sajda.filter(qs=>qs.loc.aya===obj.aya&&qs.loc.sura===obj.sura);
    return arr.length!==0;
  }

  qhizbCheck(obj){
    var arr = QURAN_DATA.qhizb.filter(qs=>qs.aya===obj.aya&&qs.sura===obj.sura);
    return arr.length;
  }
}
