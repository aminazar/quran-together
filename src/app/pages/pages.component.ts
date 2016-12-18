import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { QuranService } from "../quran.service";
import { Response } from "@angular/http";

const fonts = ['quran','quran-uthmanic', 'quran-uthmanic-bold','qalam','me-quran'];

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  private defaultWidth=650;
  private defaultHeight=866;
  private defaultTextWidth=567;
  private defaultTextHeight=800;
  private ayas;
  private pageNum:number;
  private quranPage:number=1;
  private pageAyas=[[],[],[]];
  private height;
  private width;
  private pageWidth;
  private horizontal;
  private pageHeight;
  private pagesArray;
  private textWidth;
  private textHeight;
  private activeLayer=0;
  private layers=[0,1,2];
  private halfPage=[[],[],[]];
  private suraName=[[],[],[]];
  private suraOrder=[[],[],[]];
  private tanzilLocation=[[],[],[]];
  private quranPages = [[],[],[]];
  private mobile=false;
  private timer;
  private pageNumberChanged;
  private zoom=1;
  private fontFamily = 'quran';
  private reverse;
  private naskhIncompatible=false;
  private nigthMode=false;


  constructor(private quranService:QuranService){}

  getPageAyas(p){
    return this.quranService.applySectionFilter('page', this.ayas, p);
  }

  loadPage(layer, direction){
    this.pageAyas[layer]=[];
    this.halfPage[layer]=[];
    this.suraName[layer]=[];
    this.suraOrder[layer]=[];
    this.tanzilLocation[layer]=[];
    this.quranPages[layer]=[];
    this.pagesArray.forEach(p=>{
      let quranPageNum = +this.quranPage + (direction * this.pageNum) + p;
      let ayas = this.getPageAyas(quranPageNum);
      let suras = ayas.map(e=>e.sura).filter((e,i,v)=>v.indexOf(e)===i).map(e=>this.quranService.getSura(e));
      let suraNames = suras.map(e=>e.name);
      let suraOrders = suras.map(e=>e.suraOrder);
      let meccan = 'مکي';
      let medinan = 'مدني';
      let suraTanzil = suras.map(e=>e.tanzilLocation==='Medinan'? medinan:meccan);
      let suraName = suraNames.pop();
      let suraOrder = suraOrders.pop();

      this.pageAyas[layer].push(ayas);
      this.halfPage[layer].push(quranPageNum < 3);
      this.suraName[layer].push(suraName);
      this.suraOrder[layer].push(suraOrder);
      this.tanzilLocation[layer].push(suraTanzil.pop());
      this.quranPages[layer].push(quranPageNum);
    });

    setTimeout(()=>this.quranService.contentChange(layer),0);
  }

  loadAllPages(){
    this.loadPage(0,0);
    this.loadPage(1,1);
    this.loadPage(2,-1);
    this.activeLayer=0;
  }

  goBack(){
    this.quranService.temp = '';
    this.quranService.i = 0;
    this.quranService.def = 0;
    if(this.quranPage>this.pageNum) {
      this.quranPage-=this.pageNum;
      this.activeLayer = (this.activeLayer + 2) % 3;
      var nextLayer = (this.activeLayer + 2) % 3;
      this.loadPage(nextLayer,-1);
    }
    else {
      this.quranPage = 1;
      this.loadPage(0,0);
      this.loadPage(1,1);
      this.activeLayer=0;
    }
    if(this.quranPage>2)
      window.scrollTo(this.width,this.height);
    else
      window.scrollTo(0,0);
  }
  goForth(){
    if(+this.quranPage + this.pageNum<=604) {
      this.quranPage=+this.quranPage + this.pageNum;
      this.activeLayer = (this.activeLayer + 1) % 3;
      var nextLayer = (this.activeLayer + 1) % 3;
      this.loadPage(nextLayer,1);
    }
    else{
      this.quranPage = 605 - this.pageNum;
      this.loadPage(2,0);
      this.loadPage(1,-1);
      this.activeLayer=2;
    }
    window.scrollTo(0,0);
  }
  isUthmanic(f=this.fontFamily){
    return f.indexOf('uthmanic') !== -1 || f==='me-quran';
  }

  resize(zoom=false){
    var wDiff = this.defaultWidth - this.defaultTextWidth;
    var hDiff = this.defaultHeight - this.defaultTextHeight;
    var orientationChange = Math.abs(1-this.width/window.innerHeight)<.2 && ((this.height < this.width && window.innerHeight > window.innerWidth) || (this.height > this.width && window.innerHeight < window.innerWidth));
    if(!this.width || this.pageNum>1 || (window.innerWidth * (window.innerHeight-50) > this.width * this.height) || orientationChange || zoom) {
      this.height = window.innerHeight - 65;
      this.width = window.innerWidth - 15;

      var tempPageNum = this.pageNum;
      this.pageNum = Math.max(Math.floor(this.width / this.defaultTextWidth), Math.floor(this.height / this.defaultTextHeight));
      this.horizontal = Math.floor(this.width / this.defaultTextWidth) >= Math.floor(this.height / this.defaultTextHeight);
      if (!this.pageNum)
        this.pageNum = 1;

      if(this.pageNum !== tempPageNum)
        this.pageNumberChanged = true;

      if (this.horizontal) {
        this.pageWidth = this.width / this.pageNum;
        this.pageHeight = this.zoom * (this.mobile?this.height*2:this.height);
      }
      else {
        this.pageHeight = this.zoom * ((this.mobile?2:1)*this.height / this.pageNum);
        this.pageWidth = this.pageNum > 1 ? Math.min(Math.round(this.pageHeight * .75), this.width) : this.width;
      }


      this.textWidth = this.pageWidth - wDiff;
      this.textHeight = this.pageHeight - hDiff + Math.round(this.pageHeight/40);
      this.pagesArray = [];
      for (let i = 0; i < this.pageNum; i++)
        this.pagesArray.push(i);

      if(this.timer)
        clearTimeout(this.timer);
      this.timer = setTimeout(()=> {
        if(this.pageNumberChanged) {
          setTimeout(()=>this.loadAllPages(), 500);
          this.pageNumberChanged = false;
        }
        this.layers.forEach(l=>setTimeout(()=>this.quranService.contentChange(l), 0));
      },100);
    }
  }

  ngOnInit():void {
    this.mobile = Math.min(window.innerHeight,window.innerWidth)<500;
    this.resize();
    this.quranService.getQuran()
      .subscribe(
        data=>{
          this.ayas=data;
          this.loadPage(0,0);
          this.loadPage(1,1);
        },
        (err:Response)=>console.log("Error loding quran: ", err)
      );

    this.quranService.zoomChanged$
      .subscribe(
        (zoom)=>{
          this.zoom = Math.pow(1.25,zoom);
          this.resize(true);
        }
      );

    this.quranService.fontChanged$
      .subscribe(
        (f)=>{
          do {
            var tempFont = fonts[f % fonts.length];
            f++;
          }while(tempFont===this.fontFamily);

          if(this.naskhIncompatible && this.isUthmanic(tempFont))
            tempFont = fonts[(f+1)%fonts.length];

          if(tempFont!==this.fontFamily){
            this.fontFamily=tempFont;
            this.resize(true);
          }
        }
      );

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nigthMode=m;
          if(m){
            document.body.style.backgroundColor='#000';
            document.body.style.color='#fff';
          }
          else{
            document.body.style.backgroundColor='#fff';
            document.body.style.color='#000';
          }
        }
      );

    var b = require('./browserDetect');
    this.reverse = b.isFirefox || b.isChrome;
    this.naskhIncompatible = b.isSafari || b.isiOS;
    if(!this.naskhIncompatible)
      this.fontFamily='quran-uthmanic';
  }

  sajdaCheck(obj){
    var ind = this.quranService.sajdaCheck(obj);
    var type;
    if(ind === -1)
      type = false;
    else if(ind < 11)
      type = 'recommended';
    else
      type = 'obligatory';

    return type;
  }

  qhizbJuzCheck(obj):any{
    var ind = this.quranService.qhizbCheck(obj);
    var type;
    if(ind===-1)
      type = false;
    switch(ind % 8){
      case 0:
        type = 'juz';
        break;
      case 1:
      case 5:
        type = 'qhizb';
        break;
      case 2:
      case 6:
        type = 'hhizb';
        break;
      case 3:
      case 7:
        type = '3qhizb';
        break;
      case 4:
        type = 'hizb';
        break;
    }
    return type;
  }

  hizbJuzNumberCheck(obj):any{
    var qhizbInd = this.quranService.qhizbCheck(obj);
    return {qhizbNum : qhizbInd}
  }

}
