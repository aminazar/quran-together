import { Component, OnInit, ViewChild} from '@angular/core';
import { QuranService } from "../quran.service";
import {QuranReference, QURAN_DATA} from "../quran-data";
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
  @ViewChild('telavat') telavat;
  private suraJuzPageHizbArray = [[], [], [], []];
  private active: boolean;
  private navTypeIndex = 0;
  private navType;
  private navValue;
  private zoomPercent = 100;
  private aya = new QuranReference();
  private navValueNumber = 1;
  private nightModeVar;
  private suraTemp = '';
  private ayaTemp = '';
  private addressStr = '';
  private tartilTemp = 'Abdul_Basit_Murattal_64kbps';
  tartilInfo = QURAN_DATA.tartilInfo;
  private tartilAddress = Object.keys(this.tartilInfo);
  private ayaCnt = 1;
  private  suraCnt = 1;



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
    this.setAutoPlayRead();
  }
  //************************************************ok
  changeNavType() {
    this.navTypeIndex++;
    if (this.navTypeIndex === navTypes.length)
      this.navTypeIndex = 0;
    this.navType = navTypes[this.navTypeIndex];
    this.navFromAya();
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
    if(this.navTypeIndex === 0) {
      this.suraCnt = this.navValueNumber;
      this.ayaCnt = 1;
    }
    this.setAudioAddress(this.navValueNumber);
    this.quranService.goTo(navTypeEq[this.navTypeIndex], this.navValueNumber);
    this.setAutoPlayRead();
  }
  //*****************************************************ok
  changeTelavat()
  {
    this.tartilTemp=this.telavat.nativeElement.value;
    this.addressStr = this.addressStr = "http://www.everyayah.com/data/"+this.tartilTemp+"/"+this.suraTemp + this.ayaTemp + ".mp3";
    this.setAutoPlayRead();
  }
  //*****************************************************ok
  setSuraAyaNumber(num : number){
    var numTemp = '';
    if(num<10) numTemp = "00"+num.toString();
    else if(num<100) numTemp = "0"+num.toString();
    else numTemp = num.toString();
    return numTemp;
  }
  //**********************************************ok
  setAudioAddress(myNumber){
    var x = 0;
    var y = 0;
      switch (this.navTypeIndex) {
        case 0: {
          x = myNumber;
          y = 1;
          break;
        }
        case 1: {
          x = this.quranService.findJuzSuraFirstAyaNumber(myNumber).a;
          y = this.quranService.findJuzSuraFirstAyaNumber(myNumber).b;
          break;
        }
        case 2: {
          x = this.quranService.findPageSuraFirstAyaNumber(myNumber).a;
          y = this.quranService.findPageSuraFirstAyaNumber(myNumber).b;
          break;
        }
        case 3: {
          x = this.quranService.findHizbSuraFirstAyaNumber((myNumber - 1) * 4).a;
          y = this.quranService.findHizbSuraFirstAyaNumber((myNumber - 1) * 4).b;
          break;
        }
      }

    this.suraTemp = this.setSuraAyaNumber(x);
    this.ayaTemp = this.setSuraAyaNumber(y);
    this.addressStr = "http://www.everyayah.com/data/"+this.tartilTemp+"/"+this.suraTemp + this.ayaTemp + ".mp3";

  }
  //**********************************************ok

  setAutoPlayRead(){
    this.aud.nativeElement.autoplay = this.autoPlaySelect.nativeElement.checked;
    this.aud.nativeElement.src = this.addressStr;
  }
  //*******************************************************
  readAyaOneByOne(){
    if(this.navTypeIndex===0) {
      this.suraTemp = this.setSuraAyaNumber(this.suraCnt);
      this.ayaCnt++;
      if(this.ayaCnt <= this.quranService.getSura(this.suraCnt).ayas) {
        this.ayaTemp = this.setSuraAyaNumber(this.ayaCnt);
        this.addressStr = "http://www.everyayah.com/data/" + this.tartilTemp + "/" + this.suraTemp + this.ayaTemp + ".mp3";
        this.setAutoPlayRead();
      }
      else
        this.ayaCnt=1;
    }
  }

  //******************************************************ok
  onLoadFirstPage(){
    this.autoPlaySelect.nativeElement.defaultChecked = true;
    this.addressStr ="http://www.everyayah.com/data/Abdul_Basit_Murattal_64kbps/001001.mp3";
  }
  //********************************************************ok
}


