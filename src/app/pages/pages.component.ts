import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { QuranService } from "../quran.service";
import { Response } from "@angular/http";
import { StaticPageComponent } from "../static-page/static-page.component";

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
  private pageAyas;
  private height;
  private width;
  private pageWidth;
  private horizontal;
  private pageHeight;
  private pagesArray;
  private textWidth;
  private textHeight;
  constructor(private quranService:QuranService){}

  getPageAyas(p){
    var page = this.quranService.getPage(p);
    if(page.start && page.end) {
      var startIndex = this.ayas.findIndex(a=>a.sura === page.start.sura && a.aya === page.start.aya);
      var endIndex = this.ayas.findIndex(a=>a.sura === page.end.sura && a.aya === page.end.aya);
      if (page.start.aya === 1 && page.start.sura !== 1) {
        startIndex--;
      }
      if (page.end.aya === 1) {
        endIndex--;
      }
      return this.ayas.slice(startIndex, endIndex);
    }
    else
      return([]);
  }

  loadPage(){
    this.pageAyas=[];
    this.pagesArray.forEach(p=>{
      this.pageAyas.push(this.getPageAyas(+this.quranPage + p));
    });

    this.quranService.contentChange();
  }
  goBack(){
    if(this.quranPage>this.pageNum) {
      this.quranPage-=this.pageNum;
      this.loadPage();
    }
  }
  goForth(){
    if(this.quranPage+this.pageNum<=604) {
      this.quranPage+=this.pageNum;
      //this.quranPage=(this.quranPage+this.pageNum);
      this.loadPage();
    }
  }
  resize(){
    this.height= window.innerHeight-50;
    this.width = window.innerWidth;
    this.pageNum = Math.max(Math.floor(this.width / this.defaultTextWidth),Math.floor(this.height / this.defaultTextHeight));
    this.horizontal=Math.floor(this.width / this.defaultTextWidth)>=Math.floor(this.height / this.defaultTextHeight);
    if(!this.pageNum)
      this.pageNum=1;

    if(this.horizontal) {
      this.pageWidth = this.width / this.pageNum;
      this.pageHeight = this.pageNum>1?Math.min(Math.round(this.pageWidth / .75),this.height):this.height;
    }
    else {
      this.pageHeight = this.height / this.pageNum ;
      this.pageWidth = this.pageNum>1?Math.min(Math.round(this.pageHeight * .75),this.width):this.width;
    }

    var wDiff = this.defaultWidth   -   this.defaultTextWidth;
    var hDiff = this.defaultHeight  -   this.defaultTextHeight;

    this.textWidth = this.pageWidth - wDiff;
    this.textHeight= this.pageHeight - hDiff;
    this.pagesArray = [];
    for(let i = 0; i < this.pageNum; i++)
      this.pagesArray.push(i);

    setTimeout(()=>this.quranService.contentChange(),1500);
  }

  ngOnInit():void {
    this.resize();
    this.quranService.getQuran()
      .subscribe(
        data=>{
          this.ayas=data;
          this.loadPage();
        },
        (err:Response)=>console.log("Error loding quran: ", err)
      )
  }

}
