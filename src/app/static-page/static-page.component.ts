import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { QuranService } from "../quran.service";

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.css']
})
export class StaticPageComponent implements OnInit{
  @ViewChild('page') page;
  @ViewChild('border') border;
  @Input() pageHeight;
  @Input() pageWidth;
  @Input() textHeight;
  @Input() pageNum;
  @Input() endPage;
  @Input() layer;
  @Input() fontFamily;
  @Input() halfPage;

  @Output() back  = new EventEmitter<boolean>();
  @Output() forth = new EventEmitter<boolean>();

  private loading = false;
  private explained = false;
  private startTime;


  constructor(private quranService:QuranService){}

  goBack(){
    this.back.emit(true);
  }

  goForth(){
    this.forth.emit(true);
  }

  ngOnInit() {
    this.styleChage();
    this.quranService.contentChanged$
      .subscribe((layer)=>{
        if(layer===this.layer)
          this.contentChange()
      });
  }

  styleChage(){
    this.startTime = Date.now();
    var style = this.border.nativeElement.style;

    style.width = this.pageWidth + 'px';
    style.height = this.pageHeight + 'px';
    style.right = this.pageNum * this.pageWidth + 'px';
    style.top = '50px';
  }
  contentChange() {
    this.styleChage();
    var element = this.page.nativeElement;
    var style = element.style;

    let fontSize    = Math.round( 40 * (this.pageWidth * this.textHeight)/531e3);
    let lineHeight  = '130%';

    if(this.fontFamily === 'quran-uthmanic'){
      fontSize *= .87;
      lineHeight = '150%';
      this.textHeight -= this.textHeight / 40;
    }
    if(this.halfPage)
      fontSize *= 1.4;

    style.fontSize    = fontSize + 'px';
    style.lineHeight  = lineHeight;
    var fontSizes=[];
    var bestDiff=100;
    var bestFontSize;
    let changeFontSize = ()=>{
      var diff = Math.abs(element.scrollHeight - this.textHeight);
      if(diff>this.textHeight * .0666){
        if(fontSizes.filter(el=>el===style.fontSize).length<2) {
          if(diff < bestDiff){
            bestDiff = diff;
            bestFontSize = style.fontSize;
          }
          style.fontSize = (element.scrollHeight > this.textHeight ? -1 : 1) + parseInt(style.fontSize) + 'px';
          fontSizes.push(style.fontSize);
          setTimeout(changeFontSize, 0);
        }
        else{
          if(bestFontSize)
            style.fontSize= bestFontSize;
          setTimeout(changeLineSpacing,0);
        }
      }
      else{
        setTimeout(changeLineSpacing,0);
      }
    };
    var lineHeights = [];
    var bestLineHeight;
    let changeLineSpacing = ()=>{
      var diff = element.scrollHeight - this.textHeight;
      if(element.scrollHeight > this.textHeight || this.textHeight*.96>element.scrollHeight ){
        if(diff<0&&-diff<bestDiff){
          bestDiff = - diff;
          bestLineHeight = parseInt(style.lineHeight);
        }
        let newLineHeight = (element.scrollHeight > this.textHeight?-1:1) + parseInt(style.lineHeight);
        if(lineHeights.filter(el=>el===newLineHeight).length < 2) {
          style.lineHeight = newLineHeight + '%';
          lineHeights.push(newLineHeight);
          setTimeout(changeLineSpacing, 0);
        }
        else {
          if(bestLineHeight)
            style.lineHeight = bestLineHeight + '%';
          this.show(style);
        }
      }
      else
        this.show(style);
    };
    this.hide(style);
    setTimeout(changeFontSize,0);
  }

  hide(style){
    style.visibility='hidden';
    this.loading = true;
  }
  show(style) {
    setTimeout(()=> {
      style.visibility = null;
      this.explained = true;
      this.loading = false;
    }, this.explained?0:2000-(Date.now()-this.startTime));
  }

}
