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
  private navValue = (1).toLocaleString('ar') + ' - ' + this.quranService.getSura(1).name;
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
  private ayaCntFirst = 1;
  private ayaCntLast = 1;
  private suraCntFirst = 1
  private suraCntLast = 2;
  private lastSectionAya = 7;
  private playFlag = false;

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
    if( this.navTypeIndex===0 ) {
      this.suraCntFirst = this.navValueNumber;
      this.suraCntLast = this.navValueNumber + 1;
      this.ayaCntFirst = 1;
      this.ayaCntLast = 1;
    }
    else if( this.navTypeIndex===1 ) {
      this.suraCntFirst = QURAN_DATA.juz[this.navValueNumber-1].sura;
      this.suraCntLast = QURAN_DATA.juz[this.navValueNumber].sura;
      this.ayaCntFirst = QURAN_DATA.juz[this.navValueNumber-1].aya;
      this.ayaCntLast = QURAN_DATA.juz[this.navValueNumber].aya;
    }
    else if( this.navTypeIndex===2 ) {
      this.suraCntFirst = QURAN_DATA.page[this.navValueNumber-1].sura;
      this.suraCntLast = QURAN_DATA.page[this.navValueNumber].sura;
      this.ayaCntFirst = QURAN_DATA.page[this.navValueNumber-1].aya;
      this.ayaCntLast = QURAN_DATA.page[this.navValueNumber].aya;
    }
    else{
      this.suraCntFirst = QURAN_DATA.qhizb[(this.navValueNumber-1)*4].sura;
      this.suraCntLast = QURAN_DATA.qhizb[(this.navValueNumber)*4].sura;
      this.ayaCntFirst = QURAN_DATA.qhizb[(this.navValueNumber-1)*4].aya;
      this.ayaCntLast = QURAN_DATA.qhizb[(this.navValueNumber)*4].aya;
    }
    this.suraTemp = this.setSuraAyaNumber(this.suraCntFirst);
    this.ayaTemp = this.setSuraAyaNumber(this.ayaCntFirst);
    if(this.suraCntFirst !== this.suraCntLast )
     this.lastSectionAya = this.quranService.getSura(this.suraCntFirst).ayas;
    else
      this.lastSectionAya = this.ayaCntLast-1;
    this.addressStr = "http://www.everyayah.com/data/"+this.tartilTemp+"/"+ this.suraTemp+ this.ayaTemp + ".mp3";
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

  setAutoPlayRead(){
    this.aud.nativeElement.autoplay = this.playFlag;
    this.aud.nativeElement.src = this.addressStr;
  }
  //*******************************************************
  readAyaOneByOne(){
    this.suraTemp = this.setSuraAyaNumber(this.suraCntFirst);
    this.ayaCntFirst ++;
    if( this.ayaCntFirst <= this.lastSectionAya ) {
      this.ayaTemp = this.setSuraAyaNumber(this.ayaCntFirst);
    }
    else{
      this.suraCntFirst++;
      if(this.suraCntFirst < this.suraCntLast){
        this.suraTemp = this.setSuraAyaNumber(this.suraCntFirst);
        this.ayaCntFirst = 1;
        this.ayaTemp = this.setSuraAyaNumber(this.ayaCntFirst);
        this.lastSectionAya = this.quranService.getSura(this.suraCntFirst).ayas;
      }
      else if(this.suraCntFirst === this.suraCntLast){
        this.suraTemp = this.setSuraAyaNumber(this.suraCntFirst);
        this.ayaCntFirst = 1;
        if(this.ayaCntFirst < this.ayaCntLast){
          this.ayaTemp = this.setSuraAyaNumber(this.ayaCntFirst);
          this.lastSectionAya = this.ayaCntLast-1;
        }
        else{
          this.ayaTemp = '';
        }
      }
      else
        this.ayaTemp = '';
    }
      this.addressStr = "http://www.everyayah.com/data/" + this.tartilTemp + "/" + this.suraTemp + this.ayaTemp + ".mp3";
      this.playFlag = true;
      this.setAutoPlayRead();
  }

  //******************************************************ok
  onLoadFirstPage(){
    this.addressStr ="http://www.everyayah.com/data/Abdul_Basit_Murattal_64kbps/001001.mp3";
  }
  //********************************************************ok
  startAyaVoice(){
    this.playFlag = true;
  }

  stopAyaVoice(){
    this.playFlag = false;
  }
}

