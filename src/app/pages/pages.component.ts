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
  private sura:number;
  private suraAyas;
  private height;
  private width;
  private pageWidth;
  private pageNum;
  private horizontal;
  private pageHeight;
  private pagesArray;
  private textWidth;
  private textHeight;
  constructor(private quranService:QuranService){}

  getSura(s){
    return this.ayas.filter(a=>a.sura===+s);
  }

  loadSura(){
    this.suraAyas = [];

    this.pagesArray.forEach(pageNum => {
      this.suraAyas.push(this.getSura(+this.sura + pageNum));
    });

    this.quranService.contentChange();
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

    this.quranService.contentChange();
  }

  ngOnInit():void {
    this.resize();
    this.quranService.getQuran()
      .subscribe(
        data=>this.ayas=data,
        (err:Response)=>console.log("Error loding quran: ", err)
      )
  }

}
