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
  private arr = [[],[],[],[]];
  private active:boolean;
  private navTypeIndex=0;
  private navType;
  private navValue;
  private zoomPercent = 100;
  private aya = new QuranReference();
  private navValueNumber = 1;
  private nightModeVar;
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
    this.menuClick();
  }

  ngOnInit() {
    for (var i=1; i<114; i++)
      this.arr[0].push(i.toLocaleString('ar')+' - '+this.quranService.getSura(i).name);
    for (var j=1; j<31; j++)
      this.arr[1].push('( ' + j.toLocaleString('ar') + ' )');
    for (var z=1; z<605; z++)
      this.arr[2].push('( ' + z.toLocaleString('ar') + ' )');
    for (var k=1; k<61; k++)
      this.arr[3].push('( ' + k.toLocaleString('ar') + ' )');

    this.nightModeVar = this.quranService.nightMode;
    this.navType=navTypes[this.navTypeIndex];
    this.aya.aya=1;
    this.aya.sura=1;
    this.quranService.aya$
      .subscribe((aya:QuranReference)=>{
        if(aya) {
          this.aya = aya;
          this.navFromAya();
        }
      });

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightModeVar=m;
        }
      );

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
    let val = this.quranService.sectionForAya(navTypeEq[this.navTypeIndex],this.aya);
    if(!val.text) {
      this.navValue = '( ' + val.num.toLocaleString('ar') + ' )';
    }
    else{
      this.navValue = val.num.toLocaleString('ar') + ' - ' + val.text;
    }
    this.navValueNumber = +val.num;
  }

  onSelectChange(newValue){
    this.navValueNumber = this.arr[this.navTypeIndex].findIndex(x=>x === newValue)+1;
    this.quranService.goTo(navTypeEq[this.navTypeIndex],this.navValueNumber);
  }

}

