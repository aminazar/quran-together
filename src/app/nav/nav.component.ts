import { Component, OnInit } from '@angular/core';
import { QuranService } from "../quran.service";
import {QuranReference} from "../quran-data";
const navTypes = ['سورة','جزء','صفحة','حزب'];
const navTypeEq =['sura','juz','page','hizb'];
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private active:boolean;
  private navTypeIndex=0;
  private navType;
  private navValue;
  private zoomPercent = 100;
  private aya = new QuranReference();
  private navValueNumber = 1;
  constructor(private quranService:QuranService) {
    this.active=false;
  }
  zoomOut(){
    var curZoom = this.quranService.zoomOut();
    this.changeZoomNumber(curZoom);
    this.menuClick();
  }
  zoomIn(){
    var curZoom = this.quranService.zoomIn();
    this.changeZoomNumber(curZoom);
    this.menuClick();
  }
  menuClick(){
    this.active = !this.active;
  }
  resetZoom(){
    var curZoom = this.quranService.resetZoom();
    this.changeZoomNumber(curZoom);
    this.menuClick();
  }
  changeFont(){
    this.quranService.fontChange();
    this.menuClick();
  }
  nightMode(){
    this.quranService.nightModeSwitch();
    // this.quranService.nightModeFlag = !this.quranService.nightModeFlag;
    this.menuClick();
  }
  ngOnInit() {
    this.navType=navTypes[this.navTypeIndex];
    this.aya.aya=1;this.aya.sura=1;
    this.quranService.aya$
      .subscribe((aya:QuranReference)=>{
        if(aya) {
          this.aya = aya;
          this.navFromAya()
        }
      })
  }

  next(){
    this.quranService.goForth(navTypeEq[this.navTypeIndex],this.navValueNumber + 1);
  }

  nextQuick(){
    this.quranService.goForth(navTypeEq[this.navTypeIndex],this.navValueNumber + 10);
  }

  previous(){
    this.quranService.goBack(navTypeEq[this.navTypeIndex],this.navValueNumber - 1);
  }

  previousQuick(){
    this.quranService.goBack(navTypeEq[this.navTypeIndex],this.navValueNumber - 10);
  }

  changeNavType(){
    this.navTypeIndex++;
    if(this.navTypeIndex===navTypes.length)
      this.navTypeIndex=0;
    this.navType=navTypes[this.navTypeIndex];
    this.navFromAya();
  }

  changeZoomNumber(curZoom:number) {
    this.zoomPercent = Math.round(Math.pow(1.25,curZoom) * 100);
  }

  navFromAya() {
    let val = this.quranService.sectionForAya(navTypeEq[this.navTypeIndex], this.aya);
    if(!val.text)
      this.navValue = '( '+val.num.toLocaleString('ar')+' )';
    else
      this.navValue = val.num.toLocaleString('ar') + ' - ' + val.text;

    this.navValueNumber = +val.num;
  }
}
