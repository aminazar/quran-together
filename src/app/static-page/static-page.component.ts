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
    var textHeight = this.textHeight;
    var scrollHeight = element.scrollHeight;;
    var diff = scrollHeight - textHeight;
    var bestDiff = -799;
    var bestFontSize;
    var bestLineHeight;
    var tolerance = 0;
    var count = 0;

    let changeFontSize = ()=> {
      var change = false;
      scrollHeight = element.scrollHeight;
      let curFontSize = style.fontSize ? parseFloat(style.fontSize) : 35;
      let curLineHeight = parseFloat(style.lineHeight) ? parseFloat(style.lineHeight) : 170;
      diff = scrollHeight - textHeight;
      if(diff >  0 && diff < tolerance)
        diff = -1;

      if (scrollHeight>1 && (count < 50 || diff > 0)) {
        var diffSign = diff / Math.abs(diff);

        tolerance = curFontSize / 4;
        if(diff < tolerance && diff > bestDiff){
          bestDiff = diff;
          bestFontSize = curFontSize;
          bestLineHeight = curLineHeight;
        }
        let newFontSize:number;
        let newLineHeight:number;

        if (Math.abs(diff) > 400) {
          newFontSize = curFontSize + Math.round(((curFontSize * textHeight / scrollHeight) - curFontSize) / 3);
        }
        else if (Math.abs(diff) > 100) {
          newFontSize = curFontSize - diffSign * .5;
        }
        else if((count<40 && diff < -25)||diff>25){
          newFontSize = curFontSize - diffSign * .1;
        }
        else if ((count<20 && diff <0)||diff>0) {
            newLineHeight = curLineHeight - diffSign;
        }

        if (newFontSize !== undefined) {
          style.fontSize = newFontSize + 'px';
          change = true;
        }

        if(newLineHeight !== undefined){
          style.lineHeight = newLineHeight + '%';
          change = true;
        }

        if(change)
          setTimeout(changeFontSize, 0);
        else
          this.show(style);

        count++;
      }
      else if(bestFontSize){
        style.fontSize = bestFontSize + 'px';
        style.lineHeight = bestLineHeight + '%';
        this.show(style);
      }
      else
        this.show(style);
    }
    if(diff>0 || -diff > this.textHeight/15) {
      this.hide(style);
      setTimeout(changeFontSize, 0);
    }
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
