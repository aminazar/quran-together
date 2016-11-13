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

  constructor(private quranService:QuranService){}

  getPageAyas(p){
    return this.quranService.applySectionFilter('page', this.ayas, p);

  }

  loadPage(layer, direction){
    this.pageAyas[layer]=[];
    this.pagesArray.forEach(p=>{
      this.pageAyas[layer].push(this.getPageAyas(+this.quranPage + (direction * this.pageNum)+ p));
    });

    this.quranService.contentChange(layer);
  }

  loadAllPages(){
    this.loadPage(0,0);
    this.loadPage(1,1);
    this.loadPage(2,-1);
    this.activeLayer=0;
  }

  goBack(){
    if(this.quranPage>this.pageNum) {
      this.quranPage-=this.pageNum;
      this.activeLayer = (this.activeLayer + 2) % 3;
      var nextLayer = (this.activeLayer + 2) % 3;
      this.loadPage(nextLayer,-1)
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
      this.loadPage(nextLayer,1)
    }
    else{
      this.quranPage = 604 - this.pageNum;
      this.loadPage(2,0);
      this.loadPage(1,-1);
      this.activeLayer=2;
    }
    window.scrollTo(0,0);
  }
  resize(){
    var orientationChange = (this.height < this.width && window.innerHeight > window.innerWidth) || (this.height > this.width && window.innerHeight < window.innerWidth);
    if(!this.width || this.pageNum>1 || (window.innerWidth * (window.innerHeight-50) > this.width * this.height) || orientationChange) {
      this.height = window.innerHeight - 50;
      this.width = window.innerWidth;
      this.pageNum = Math.max(Math.floor(this.width / this.defaultTextWidth), Math.floor(this.height / this.defaultTextHeight));
      this.horizontal = Math.floor(this.width / this.defaultTextWidth) >= Math.floor(this.height / this.defaultTextHeight);
      if (!this.pageNum)
        this.pageNum = 1;

      if (this.horizontal) {
        this.pageWidth = this.width / this.pageNum;
        this.pageHeight = this.pageNum > 1 ? Math.min(Math.round(this.pageWidth / .75), this.height) : this.height;
      }
      else {
        this.pageHeight = this.height / this.pageNum;
        this.pageWidth = this.pageNum > 1 ? Math.min(Math.round(this.pageHeight * .75), this.width) : this.width;
      }

      var wDiff = this.defaultWidth - this.defaultTextWidth;
      var hDiff = this.defaultHeight - this.defaultTextHeight;

      this.textWidth = this.pageWidth - wDiff;
      this.textHeight = this.pageHeight - hDiff;
      this.pagesArray = [];
      for (let i = 0; i < this.pageNum; i++)
        this.pagesArray.push(i);

      this.layers.forEach(l=>setTimeout(()=>this.quranService.contentChange(l), 0));
    }
  }

  ngOnInit():void {
    this.resize();
    this.quranService.getQuran()
      .subscribe(
        data=>{
          this.ayas=data;
          this.loadPage(0,0);
          this.loadPage(1,1);
        },
        (err:Response)=>console.log("Error loding quran: ", err)
      )
  }

}
