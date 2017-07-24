//Todo : Change testFunction name..
import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';

import { QuranService } from "../quran.service";
import {QuranReference, QURAN_DATA} from "../quran-data";
import {RegistrationComponent} from "../registration/registration.component";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {AuthService} from "../auth.service";
import {StylingService} from "../styling.service";
import {WindowRef} from "../windowRef";
import {KhatmComponent} from "../khatm/khatm.component";
import {KhatmService} from "../khatm.service";
import {MsgService} from "../msg.service";

const navTypes = ['سورة','جزء','حزب'];
const navTypeEq =['sura','juz','hizb'];

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild('aud0') aud0;
  @ViewChild('aud1') aud1;
  @ViewChild('aud2') aud2;
  @ViewChild('autoPlaySelect') autoPlaySelect;
  @ViewChild('tlvt') tlvt;
  @ViewChild('quality') quality;
  @ViewChild('inputbutton') inputbutton;

  @Output('closeNav') closeNav = new EventEmitter();

  suraJuzPageHizbArray = [[], [], []];
  private active: boolean;
  navTypeIndex = 0;
  navType;
  navValue;
  qualityValue;
  tlvtValue;

  zoomPercent = 100;
  private aya = new QuranReference();
  private navValueNumber = 1;
  nightModeVar;
  tartilInfo = QURAN_DATA.tartilInfo;
  tartilQuality = [];
  tartil = [];
  private tartilTemp;

  private ayaCnt = 1;
  private suraCnt = 1;
  private ayaCntLast = 1;
  private suraCntLast = 2;
  private lastSectionAya = 7;
  private suraTemp = ['','',''];
  private ayaTemp = ['','',''];
  private addressStr = ['','',''];
  private shortAddressStr = ['','',''];
  private j = 3;
  playFlag = false;
  private sarehFlag = false;
  volumeFlag = true;
  isLoggedIn: boolean;
  height;
  khatms = [];

  constructor(private quranService: QuranService, public dialog: MdDialog,
              private authService: AuthService, private winRef: WindowRef,
              private khatmService: KhatmService, private msgService: MsgService) {
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
    // this.menuClick();
  }

  changeNavType() {
    this.navTypeIndex++;
    if (this.navTypeIndex === navTypes.length)
      this.navTypeIndex = 0;
    this.navType = navTypes[this.navTypeIndex];
    this.navFromAya();
  }

  navFromAya() {
    let val = this.quranService.sectionForAya(navTypeEq[this.navTypeIndex], this.aya);
    this.inputbutton.nativeElement.value = this.quranService.sectionForAya('page', this.aya).num;
    if (!val.text) {
      this.navValue = '( ' + val.num.toLocaleString('ar') + ' )';
    }
    else {
      this.navValue = val.num.toLocaleString('ar') + ' - ' + val.text;
    }
    this.navValueNumber = +val.num;
  }

  ngOnInit() {
    this.height = this.winRef.getWindow().innerHeight + "px";
    this.winRef.getWindow().onresize = (e) => {
      this.height = this.winRef.getWindow().innerHeight + "px";
    };

    this.authService.isLoggedIn.subscribe(
        (data) => {
          console.log('isLoggedIn: ' + data);
          this.isLoggedIn = data;
        }
    );

    this.khatmService.khatms.subscribe(
        (data) => {
          this.khatms = [];
          for(let item of data)
            this.khatms.push(item);
        },
        (err) => {
          console.log(err);
          this.khatms = [];
        }
    );

    this.authService.user.subscribe(
      (data) => {
        if(data !== null && data.email !== null && data.email !== undefined)
          this.khatmService.loadKhatm(data.email);
      },
      (err) => {
        console.log(err.message);
      }
    );

    this.suraTemp[0]='001';
    this.ayaTemp[0]='001';
    for (var i = 1; i < 115; i++)
      this.suraJuzPageHizbArray[0].push(i.toLocaleString('ar') + ' - ' + this.quranService.getSura(i).name);
    for (var j = 1; j < 31; j++)
      this.suraJuzPageHizbArray[1].push('( ' + j.toLocaleString('ar') + ' )');
    for (var k = 1; k < 61; k++)
      this.suraJuzPageHizbArray[2].push('( ' + k.toLocaleString('ar') + ' )');

    this.tartilInfo.sort((x,y)=>parseInt(x.bitrate)<parseInt(y.bitrate)||(parseInt(x.bitrate)===parseInt(y.bitrate) && x.name<y.name));
    this.tartilQuality = this.tartilInfo.map(el=>el.quality).filter((e, i, arr) => arr.lastIndexOf(e) === i);
    var q = this.tartilQuality[0];

    this.qualityValue = q;
    this.changeQuality(q);

    this.nightModeVar = this.quranService.nightMode;
    this.navType = navTypes[this.navTypeIndex];
    this.aya.aya = 1;
    this.aya.sura = 1;
    this.quranService.aya$
      .subscribe((aya: QuranReference)=> {
        if (aya) {
          this.aya = aya;
          this.navFromAya();
          if(this.sarehFlag) {
            var andis;
            if( this.j===3 )  andis = 0;
            else if(this.j ===2 ) andis=1;
            else if(this.j===1) andis=2;

            var p = this.quranService.sectionForAya('page', this.aya).num;
            this.suraCnt = QURAN_DATA.page[p - 1].sura;
            this.ayaCnt = QURAN_DATA.page[p - 1].aya;
            this.suraCntLast = 114;
            this.ayaCntLast = 7;
            if (this.suraCnt !== this.suraCntLast)
              this.lastSectionAya = this.quranService.getSura(this.suraCnt).ayas;
            else
              this.lastSectionAya = this.ayaCntLast - 1;
            this.suraTemp[andis] = this.setSuraAyaNumber(this.suraCnt);
            this.ayaTemp[andis] = this.setSuraAyaNumber(this.ayaCnt);
            this.addressStr[andis] = "http://www.everyayah.com/data/" + this.tartilTemp + "/" + this.suraTemp[andis] + this.ayaTemp[andis] + ".mp3";

            this.testFunction();
            this.setAutoPlayRead();
          }
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

  onSelectChange(newValue) {
    this.sarehFlag = false;

    var andis;
    if( this.j===3 )  andis = 0;
    else if(this.j ===2 ) andis=1;
    else if(this.j===1) andis=2;

    this.navValueNumber = this.suraJuzPageHizbArray[this.navTypeIndex].findIndex(x=>x === newValue) + 1;
      if (this.navTypeIndex === 0) {
        this.suraCnt = this.navValueNumber;
        this.suraCntLast = this.navValueNumber + 1;
        this.ayaCnt = 1;
        this.ayaCntLast = 1;
      }
      else if (this.navTypeIndex === 1) {
        this.suraCnt = QURAN_DATA.juz[this.navValueNumber - 1].sura;
        this.ayaCnt = QURAN_DATA.juz[this.navValueNumber - 1].aya;
        if (this.navValueNumber === 30) {
          this.suraCntLast = 114;
          this.ayaCntLast = 7;
        }
        else {
          this.suraCntLast = QURAN_DATA.juz[this.navValueNumber].sura;
          this.ayaCntLast = QURAN_DATA.juz[this.navValueNumber].aya;
        }
      }
      else {
        this.suraCnt = QURAN_DATA.qhizb[(this.navValueNumber - 1) * 4].sura;
        this.ayaCnt = QURAN_DATA.qhizb[(this.navValueNumber - 1) * 4].aya;
        if (this.navValueNumber === 60) {
          this.suraCntLast = 114;
          this.ayaCntLast = 7;
        }
        else {
          this.suraCntLast = QURAN_DATA.qhizb[(this.navValueNumber) * 4].sura;
          this.ayaCntLast = QURAN_DATA.qhizb[(this.navValueNumber) * 4].aya;
        }
      }

    this.suraTemp[andis] = this.setSuraAyaNumber(this.suraCnt);
    this.ayaTemp[andis] = this.setSuraAyaNumber(this.ayaCnt);
    if (this.suraCnt !== this.suraCntLast)
      this.lastSectionAya = this.quranService.getSura(this.suraCnt).ayas;
    else
      this.lastSectionAya = this.ayaCntLast - 1;

    this.addressStr[andis] = "http://www.everyayah.com/data/" + this.tartilTemp + "/" + this.suraTemp[andis] + this.ayaTemp[andis] + ".mp3";

    this.testFunction();

    this.quranService.goTo(navTypeEq[this.navTypeIndex], this.navValueNumber);
    this.setAutoPlayRead();
  }

  setAutoPlayRead(){
    if( this.j === 3 ) {
      this.aud0.nativeElement.autoplay = this.playFlag;
      this.aud0.nativeElement.src = this.addressStr[0];
    }
    else if( this.j === 2 ){
      this.aud1.nativeElement.autoplay = this.playFlag;
      this.aud1.nativeElement.src = this.addressStr[1];
    }
    else if( this.j === 1 ){
      this.aud2.nativeElement.autoplay = this.playFlag;
      this.aud2.nativeElement.src = this.addressStr[2];
    }
    if(this.sarehFlag === false) this.sarehFlag = true;
  }

  startAyaVoice(){
    this.playFlag = !this.playFlag;
      if( this.j === 3 ) {
        if(!this.playFlag) {
          this.aud0.nativeElement.pause();
          this.aud1.nativeElement.pause();
          this.aud2.nativeElement.pause();
        }
        else
          this.aud0.nativeElement.play();
      }
      else if( this.j === 2 ){
        if(!this.playFlag){
          this.aud0.nativeElement.pause();
          this.aud1.nativeElement.pause();
          this.aud2.nativeElement.pause();
        }
        else
          this.aud1.nativeElement.play();
      }
      else if( this.j === 1 ){
        if(!this.playFlag){
          this.aud0.nativeElement.pause();
          this.aud1.nativeElement.pause();
          this.aud2.nativeElement.pause();
        }
        else
          this.aud2.nativeElement.play();
      }
  }

  readAyaOneByOne(){
    var andis;
    if( this.j===3 )  andis = 0;
    else if( this.j ===2 ) andis=1;
    else if( this.j===1 ) andis=2;
      this.suraTemp[andis] = this.setSuraAyaNumber(this.suraCnt);
      this.ayaCnt++;
      if (this.ayaCnt <= this.lastSectionAya) {
        this.ayaTemp[andis] = this.setSuraAyaNumber(this.ayaCnt);
      }
      else {
        this.suraCnt++;
        if (this.suraCnt < this.suraCntLast) {
          this.suraTemp[andis] = this.setSuraAyaNumber(this.suraCnt);
          this.ayaCnt = 1;
          this.ayaTemp[andis] = this.setSuraAyaNumber(this.ayaCnt);
          this.lastSectionAya = this.quranService.getSura(this.suraCnt).ayas;
        }
        else if (this.suraCnt === this.suraCntLast) {
          this.suraTemp[andis] = this.setSuraAyaNumber(this.suraCnt);
          this.ayaCnt = 1;
          if (this.ayaCnt < this.ayaCntLast) {
            this.ayaTemp[andis] = this.setSuraAyaNumber(this.ayaCnt);
            this.lastSectionAya = this.ayaCntLast - 1;
          }
          else {
            this.ayaTemp[andis] = '';
          }
        }
        else
          this.ayaTemp[andis] = '';
      }
      this.addressStr[andis] = "http://www.everyayah.com/data/" + this.tartilTemp + "/" + this.suraTemp[andis] + this.ayaTemp[andis] + ".mp3";

      if(andis===0){
        this.aud0.nativeElement.play();
        this.aud0.nativeElement.pause();
        // setTimeout(()=>this.aud0.nativeElement.pause(),200);
      }
      else if(andis===1){
        this.aud1.nativeElement.play();
        this.aud1.nativeElement.pause();
        // setTimeout(()=>this.aud1.nativeElement.pause(),200);
      }
      else if(andis===2){
        this.aud2.nativeElement.play();
        this.aud2.nativeElement.pause();
        // setTimeout(()=>this.aud2.nativeElement.pause(),200);
      }

      if (this.playFlag) {
        this.j--;
        if (this.j === 0) {
          this.j = 3;
        }
      }
      this.setAutoPlayRead();
  }

  goToEnteredPage(){
    this.sarehFlag = false;
    var andis;
    if( this.j===3 )  andis = 0;
    else if(this.j ===2 ) andis=1;
    else if(this.j===1) andis=2;
    var p = this.inputbutton.nativeElement.value;
    if(p>604 || p<0 || isNaN(p)) {
      this.inputbutton.nativeElement.select();
      alert("Enter a valid number!");
      this.sarehFlag = true;
    }
    else {
      this.suraCnt = QURAN_DATA.page[p - 1].sura;
      this.ayaCnt = QURAN_DATA.page[p - 1].aya;
      this.suraCntLast = QURAN_DATA.page[p].sura;
      this.ayaCntLast = QURAN_DATA.page[p].aya;

      this.suraTemp[andis] = this.setSuraAyaNumber(this.suraCnt);
      this.ayaTemp[andis] = this.setSuraAyaNumber(this.ayaCnt);
      if (this.suraCnt !== this.suraCntLast)
        this.lastSectionAya = this.quranService.getSura(this.suraCnt).ayas;
      else
        this.lastSectionAya = this.ayaCntLast - 1;
      this.addressStr[andis] = "http://www.everyayah.com/data/" + this.tartilTemp + "/" + this.suraTemp[andis] + this.ayaTemp[andis] + ".mp3";

      this.testFunction();

      this.quranService.goTo('page', p);
      this.setAutoPlayRead();
    }
  }

  onLoadFirstPage(){
    this.addressStr[0] ="http://www.everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/001001.mp3";
    this.addressStr[1] ="http://www.everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/001002.mp3";
    this.addressStr[2] ="http://www.everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/001003.mp3";
  }

  setSuraAyaNumber(num : number){
    var numTemp = '';
    if(num<10) numTemp = "00"+num.toString();
    else if(num<100) numTemp = "0"+num.toString();
    else numTemp = num.toString();
    return numTemp;
  }

  changeTelavat(t=this.tlvtValue) {
    var andis;
    var a;
    if( this.j===3 )  andis = 0;
    else if(this.j ===2 ) andis=1;
    else if(this.j===1) andis=2;
    this.tartilTemp=t;
    this.addressStr[andis] = "http://www.everyayah.com/data/"+this.tartilTemp+"/"+this.suraTemp[andis] + this.ayaTemp[andis] + ".mp3";

    for(a=0; a<3; a++){
      if(a===andis)
        continue;
      else{
        this.addressStr[a] = "http://www.everyayah.com/data/"+this.tartilTemp+"/"+this.suraTemp[a] + this.ayaTemp[a] + ".mp3";
      }
    }

    this.setAutoPlayRead();
  }

  changeQuality(q=this.qualityValue){
    this.tartil = this.tartilInfo.filter(el=>el.quality===q);
    this.tlvtValue = this.tartil[0].subfolder;
    this.changeTelavat(this.tartil[0].subfolder);
  }

  changeVolume(){
    this.volumeFlag = !this.volumeFlag;
    if(this.volumeFlag){
      this.aud0.nativeElement.muted = false;
      this.aud1.nativeElement.muted = false;
      this.aud2.nativeElement.muted = false;
    }
    else{
      this.aud0.nativeElement.muted = true;
      this.aud1.nativeElement.muted = true;
      this.aud2.nativeElement.muted = true;
    }
  }

  testFunction(){
    var a = [];
    if(this.j === 3 )
      a = [1,2];
    else if(this.j === 2 )
      a = [2,0];
    else
      a= [0,1];
    for(var i=0; i<2; i++){
      this.suraTemp[a[i]] = this.setSuraAyaNumber(this.suraCnt);
      this.ayaCnt++;
      if( this.ayaCnt <= this.lastSectionAya ) {
        this.ayaTemp[a[i]] = this.setSuraAyaNumber(this.ayaCnt);
      }
      else{
        this.suraCnt++;
        if(this.suraCnt < this.suraCntLast){
          this.suraTemp[a[i]] = this.setSuraAyaNumber(this.suraCnt);
          this.ayaCnt = 1;
          this.ayaTemp[a[i]] = this.setSuraAyaNumber(this.ayaCnt);
          this.lastSectionAya = this.quranService.getSura(this.suraCnt).ayas;
        }
        else if(this.suraCnt === this.suraCntLast){
          this.suraTemp[a[i]] = this.setSuraAyaNumber(this.suraCnt);
          this.ayaCnt = 1;
          if(this.ayaCnt < this.ayaCntLast){
            this.ayaTemp[a[i]] = this.setSuraAyaNumber(this.ayaCnt);
            this.lastSectionAya = this.ayaCntLast-1;
          }
          else{
            this.ayaTemp[a[i]] = '';
          }
        }
        else{
          this.ayaTemp[a[i]] = '';
        }
      }
      this.addressStr[a[i]] = "http://www.everyayah.com/data/" + this.tartilTemp + "/" + this.suraTemp[a[i]] + this.ayaTemp[a[i]] + ".mp3";
    }
  }

  register(isRegister){
    let dialogRef = this.dialog.open(RegistrationComponent, {
      height: '400px',
      width: '300px',
      data: {
        isRegister: isRegister
      }
    });
    this.closeNav.emit(true);
  }

  createKhatm(){
    let dialogRef: MdDialogRef<KhatmComponent> = this.dialog.open(KhatmComponent, {
      height: '600px',
      width: '400px',
      data: {
        isNew: true,
        khatm: null
      }
    });
    this.closeNav.emit(true);
  }

  openKhatm(khatm){
    let dialogRef: MdDialogRef<KhatmComponent> = this.dialog.open(KhatmComponent, {
      height: '600px',
      width: '400px',
      data: {
        isNew: false,
        khatm: khatm
      }
    });
  }

  logout(){
    this.authService.logout();
  }
}
