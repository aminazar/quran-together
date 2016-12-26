import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import {QURAN_DATA, QuranReference} from './quran-data';
import { Subject } from "rxjs/Subject";

const FONT_PARAMS = {
  quran:                  [.8131, 130, false ],
  "quran-uthmanic":       [46/67, 150, true ],
  "quran-uthmanic-bold":  [37/50, 160, true],
  "qalam":                [34/50, 155, true],
  "me-quran":             [30/54, 185, true]
}

export class SectionAddress{
  num:number;
  text:any;
  constructor(obj:any){
    this.num = obj.num;
    this.text = obj.text?obj.text:null;
  }
}

@Injectable()
export class QuranService {
  private contentChangeStream = new Subject<number>();
  private zoomChangeStream = new Subject<number>();
  private nigthModeStream = new Subject<boolean>();
  private ayaStream = new Subject<QuranReference>();
  private pageStream = new Subject<number>();
  contentChanged$ = this.contentChangeStream.asObservable();
  zoomChanged$ = this.zoomChangeStream.asObservable();
  nightMode$ = this.nigthModeStream.asObservable();
  aya$ = this.ayaStream.asObservable();
  page$ = this.pageStream.asObservable().throttleTime(500);
  curZoom = 0;
  private nightMode = false;
  private fontChangeStream = new Subject<number>();
  fontChanged$ = this.fontChangeStream.asObservable();
  font = 0;
  def = 0;
  temp = '';
  i = 0;


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
    return this.curZoom;
  }
  zoomOut(){
    this.curZoom--;
    this.zoomChangeStream.next(this.curZoom);
    return this.curZoom;
  }
  resetZoom(){
    this.curZoom=0;
    this.zoomChangeStream.next(0);
    return this.curZoom;
  }
  fontChange(){
    this.font++;
    this.fontChangeStream.next(this.font);
  }
  fontParams(fontFamily){
    return FONT_PARAMS[fontFamily]
  }
  sajdaCheck(obj){
    var ind = QURAN_DATA.sajda.findIndex(qs=>qs.loc.aya===obj.aya&&qs.loc.sura===obj.sura);
    return ind;
  }
  nightModeSwitch() {
    this.nightMode = !this.nightMode;
    this.nigthModeStream.next(this.nightMode);
  }
  qhizbCheck(obj){
    var ind = QURAN_DATA.qhizb.findIndex(qs=>qs.aya===obj.aya&&qs.sura===obj.sura);
    return ind;
  }

  pageForSection(sectionType,sectionNumber){
    var s;
    if(sectionType==='sura')
      s = new QuranReference({sura:sectionNumber,aya:1});
    else {
      s = this.getSection(sectionType, sectionNumber);
      if (s.start)
        s = s.start;
      else
        return QURAN_DATA.page.length-1;
    }
    return this.sectionForAya('page',s).num;
  }

  sectionForAya(sectionType,aya:QuranReference):SectionAddress{
    if(sectionType==='sura')
      return new SectionAddress({num:aya.sura, text: QURAN_DATA.suras[aya.sura-1].name});
    else
      return new SectionAddress({num:QURAN_DATA[sectionType].findReference(aya)});
  }

  goForth(sectionType,sectionNumber){
    var p = this.pageForSection(sectionType,sectionNumber);
    if(p<605)
      this.pageStream.next(p);
    else
      this.pageStream.next(1);
  }
  goBack(sectionType,sectionNumber){
    var p = this.pageForSection(sectionType,sectionNumber);
    if(p>0)
      this.pageStream.next(p);
    else
      this.pageStream.next(604);
  }
  suraNumberCheck(str){
    var ind = QURAN_DATA.suras.findIndex(qs=>qs.name===str);
    if(ind!== -1)
     return ind+1;
  }

  pageJuzCheck(number){
    var endJuzPage = [21,41,61,81,101,120,141,161,181,200,221,241,261,281,301,321,341,361,381,401,421,441,461,481,501,521,541,561,581,604];
    return endJuzPage.findIndex(a=>a>= number)+1;
  }

  suraAyaNumberCheck(str,flag) {
    var suraBismillah = [81,83,84,85,87,88,89,90,92,94,96,98,100,102,105,108,111,113];
    var ind = QURAN_DATA.suras.findIndex(qs=>qs.name === str) + 1;
    if(!flag) {
      if (ind < 83) {
        this.temp = '';
        this.i = 0;
        this.def = 0;
        var suraAyaNumber = this.getSura(ind).ayas;

      }
      else {
        var ind1 = suraBismillah.findIndex(x=>x === ind);
        if (str !== this.temp) {
          this.i = 0;
          this.def = suraBismillah[ind1] - suraBismillah[ind1 - 1];
          this.temp = str;
        }
        this.i++;
        var suraAyaNumber = this.getSura(ind - this.def + this.i).ayas;
      }
    }
    else{
      if(ind < 83) {
        var suraTanziLocation = this.getSura(ind).tanzilLocation;
        var suraArabicName = this.getSura(ind).name;
      }
      else {
        var suraTanziLocation = this.getSura(ind - this.def + this.i).tanzilLocation;
        var suraArabicName  = this.getSura(ind - this.def + this.i).name;
      }
    }
    return { a:suraAyaNumber ,b:suraTanziLocation, c:suraArabicName };
  }

  changeCurAya(aya:QuranReference){
    this.ayaStream.next(aya);
  }
}
