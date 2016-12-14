import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { QURAN_DATA } from './quran-data';
import { Subject } from "rxjs/Subject";

const FONT_PARAMS = {
  quran:                  [ 1, 130, false ],
  "quran-uthmanic":       [46/67, 150, true ],
  "quran-uthmanic-bold":  [37/50, 160, true],
  "qalam":                [34/50, 155, true],
  "me-quran":             [30/54, 185, true]
}

@Injectable()
export class QuranService {
  private contentChangeStream = new Subject<number>();
  private zoomChangeStream = new Subject<number>();
  private nigthModeStream = new Subject<boolean>();
  contentChanged$ = this.contentChangeStream.asObservable();
  zoomChanged$ = this.zoomChangeStream.asObservable();
  nightMode$ = this.nigthModeStream.asObservable();
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

  suraNumberCheck(str){
    var ind = QURAN_DATA.suras.findIndex(qs=>qs.name===str);
    if(ind!== -1)
     return ind+1;
  }

  pageJuzCheck(number){
    var endJuzPage = [21,41,61,81,101,120,141,161,181,200,221,241,261,281,301,321,341,361,381,401,421,441,461,481,501,521,541,561,581,604];
    return endJuzPage.findIndex(a=>a>= number)+1;
  }

  suraAyaNumberCheck(str) {
    var suraBismillah = [81,83,84,85,87,88,89,90,92,94,96,98,100,102,105,108,111,113];
    var ind = QURAN_DATA.suras.findIndex(qs=>qs.name === str) + 1;
    if(ind < 83)
    {
      var suraAyaNumber = this.getSura( ind ).ayas;
    }
    else
    {
      var ind1 = suraBismillah.findIndex(x=>x===ind);
      if(str!==this.temp) {
        this.i = 0;
        this.def = suraBismillah[ind1] - suraBismillah[ind1 - 1];
        this.temp = str;
      }
      this.i++;
      var suraAyaNumber = this.getSura( ind - this.def + this.i ).ayas;
    }
    return suraAyaNumber;

  }

}

// suraAyaNumberCheck(str){
//   var ind =  QURAN_DATA.suras.findIndex(qs=>qs.name === str)+1;
//   if(ind < 83){
//     if (this.temp !== str) {
//       this.i = 0;
//     }
//     this.i++;
//     var suraAyaNumber = this.getSura(ind + this.i - 1).ayas;
//     this.temp = str;
//   }
//   else {
//     if ( str !== this.temp ) {
//       this.i = 0;
//       this.def = ind - (QURAN_DATA.suras.findIndex(qs=>qs.name === this.temp)+1);
//     }
//     this.i++;
//     var suraAyaNumber = this.getSura( ind - this.def + this.i ).ayas;
//     var suraTanzilLocation = this.getSura( ind - this.def + this.i ).ayas;
//     this.temp = str;
//   }
//
//   return {a : suraAyaNumber, b : suraTanzilLocation };
// }
