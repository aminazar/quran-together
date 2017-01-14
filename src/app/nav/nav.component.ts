import { Component, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('aud') aud;
  @ViewChild('autoPlaySelect') autoPlaySelect;
  @ViewChild('surah') surah;
  @ViewChild('ayah') ayah;
  private suraJuzPageHizbArray = [[], [], [], []];
  private active: boolean;
  private navTypeIndex = 0;
  private navType;
  private navValue;
  private zoomPercent = 100;
  private aya = new QuranReference();
  private navValueNumber = 1;
  private nightModeVar;
  private ghariNames = ['', 'پرهیزگار', 'عبدالباسط'];
  private addressStr = '';
  private shortAddressStr = '';

  constructor(private quranService: QuranService) {
    this.active = false;
  }

  zoomOut() {
    var curZoom = this.quranService.zoomOut();
    this.changeZoomNumber(curZoom);
    this.menuClick();
  }

  zoomIn() {
    var curZoom = this.quranService.zoomIn();
    this.changeZoomNumber(curZoom);
    this.menuClick();
  }

  menuClick() {
    this.active = !this.active;
  }

  resetZoom() {
    var curZoom = this.quranService.resetZoom();
    this.changeZoomNumber(curZoom);
    this.menuClick();
  }

  changeZoomNumber(curZoom: number) {
    this.zoomPercent = Math.round(Math.pow(1.25, curZoom) * 100);
  }

  changeFont() {
    this.quranService.fontChange();
    this.menuClick();
  }

  nightMode() {
    this.quranService.nightModeSwitch();
    this.menuClick();
  }
  //*************************************************ok
  ngOnInit() {
    for (var i = 1; i < 115; i++)
      this.suraJuzPageHizbArray[0].push(i.toLocaleString('ar') + ' - ' + this.quranService.getSura(i).name);
    for (var j = 1; j < 31; j++)
      this.suraJuzPageHizbArray[1].push('( ' + j.toLocaleString('ar') + ' )');
    for (var z = 1; z < 605; z++)
      this.suraJuzPageHizbArray[2].push('( ' + z.toLocaleString('ar') + ' )');
    for (var k = 1; k < 61; k++)
      this.suraJuzPageHizbArray[3].push('( ' + k.toLocaleString('ar') + ' )');

    this.nightModeVar = this.quranService.nightMode;
    this.navType = navTypes[this.navTypeIndex];
    this.aya.aya = 1;
    this.aya.sura = 1;
    this.quranService.aya$
      .subscribe((aya: QuranReference)=> {
        if (aya) {
          this.aya = aya;
          this.navFromAya();
        }
      });

    this.quranService.nightMode$
      .subscribe(
        (m)=> {
          this.nightModeVar = m;
        }
      );
    this.onLoadFirstPage();
  }
  //************************************************ok
  changeNavType() {
    this.navTypeIndex++;
    if (this.navTypeIndex === navTypes.length)
      this.navTypeIndex = 0;
    this.navType = navTypes[this.navTypeIndex];
    this.navFromAya();
    var tempAddress = this.quranService.sectionForAya(navTypeEq[2],this.aya).num;
    tempAddress = +tempAddress;
    this.setAudioAddress(tempAddress,false);
  }
  //**********************************************ok
  navFromAya() {
    let val = this.quranService.sectionForAya(navTypeEq[this.navTypeIndex], this.aya);
    if (!val.text) {
      this.navValue = '( ' + val.num.toLocaleString('ar') + ' )';
    }
    else {
      this.navValue = val.num.toLocaleString('ar') + ' - ' + val.text;
    }
    this.navValueNumber = +val.num;
  }
  //***********************************************ok
  onSelectChange(newValue) {
    this.navValueNumber = this.suraJuzPageHizbArray[this.navTypeIndex].findIndex(x=>x === newValue)+1;
    this.quranService.goTo(navTypeEq[this.navTypeIndex], this.navValueNumber);
    this.navValueNumber = this.suraJuzPageHizbArray[this.navTypeIndex].findIndex(x=>x === newValue)+1;
    this.setAudioAddress(this.navValueNumber,true);
  }
  //**********************************************ok
  setSuraAyaNumber(num : number){
    var numTemp = '';
    if(num<10) numTemp = "00"+num.toString();
    else if(num<100) numTemp = "0"+num.toString();
    else numTemp = num.toString();
    return numTemp;
  }
  //**********************************************ok
  setAudioAddress(myNumber,flag){
    var suraTemp = '';
    var ayaTemp = '';
    var tartilTemp = 'Abdul_Basit_Murattal_64kbps';
    if(!flag){
      suraTemp = this.setSuraAyaNumber(this.quranService.findPageSuraFirstAyaNumber(myNumber).a);
      ayaTemp = this.setSuraAyaNumber(this.quranService.findPageSuraFirstAyaNumber(myNumber).b);
    }
    else {
      switch(this.navTypeIndex){
        case 0:{
          suraTemp = this.setSuraAyaNumber(myNumber);
          ayaTemp = '001';
          break;
        }
        case 1:{
          suraTemp = this.setSuraAyaNumber(this.quranService.findJuzSuraFirstAyaNumber(myNumber).a);
          ayaTemp = this.setSuraAyaNumber(this.quranService.findJuzSuraFirstAyaNumber(myNumber).b);
          break;
        }
        case 2:{
          suraTemp = this.setSuraAyaNumber(this.quranService.findPageSuraFirstAyaNumber(myNumber).a);
          ayaTemp = this.setSuraAyaNumber(this.quranService.findPageSuraFirstAyaNumber(myNumber).b);
          break;
        }
        case 3:{
          suraTemp = this.setSuraAyaNumber(this.quranService.findHizbSuraFirstAyaNumber((myNumber - 1) * 4).a);
          ayaTemp = this.setSuraAyaNumber(this.quranService.findHizbSuraFirstAyaNumber((myNumber - 1) * 4).b);
          break;
        }
      }
    }
    this.addressStr = this.addressStr = "http://www.everyayah.com/data/"+tartilTemp+"/"+suraTemp + ayaTemp + ".mp3";
    this.shortAddressStr = suraTemp + ayaTemp + ".mp3";
    // this.aud.nativeElement.src = this.addressStr;
    this.setAutoPlayRead();
  }
  //*****************************************************ok
  setAutoPlayRead(){
    this.aud.nativeElement.autoplay = this.autoPlaySelect.nativeElement.checked;
    this.aud.nativeElement.src = this.addressStr;

  }
  //******************************************************ok
  onLoadFirstPage(){
    this.autoPlaySelect.nativeElement.defaultChecked = true;
    this.shortAddressStr = "001001.mp3";
    this.addressStr ="http://www.everyayah.com/data/Abdul_Basit_Murattal_64kbps/001001.mp3";
    // this.aud.nativeElement.src = this.addressStr;
    this.setAutoPlayRead();
  }
  //********************************************************ok
}


