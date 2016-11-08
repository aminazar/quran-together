import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

  constructor(private quranService:QuranService){}

  ngOnInit() {
    this.styleChage();
    this.quranService.contentChanged$
      .subscribe(()=>this.contentChange());
  }

  styleChage(){
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
    var diff;
    var bestDiff = -799;
    var bestFontSize;
    var bestLetterSpacing;
    var bestLineHeight;
    var tolerance = 0;
    var count = 0;
    var fillThePage = 0;
    style.letterSpacing='-1.1px';
    style.fontSize='20px';
    style.lineHeight='170%';
    style.visibility='hidden';

    let changeFontSize = function() {
      var change = false;
      let scrollHeight = element.scrollHeight;
      let curFontSize = style.fontSize ? parseFloat(style.fontSize) : 20;
      let curLetterSpacing = style.letterSpacing ? parseFloat(style.letterSpacing) : 1;
      let curLineHeight = parseFloat(style.lineHeight) ? parseFloat(style.lineHeight) : 170;
      diff = scrollHeight - textHeight;
      if(diff >  0 && diff < tolerance)
        diff = -1;

      if (scrollHeight>1 && (count < 50 || diff > 0 || fillThePage===1)) {
        var diffSign = diff / Math.abs(diff);

        tolerance = curFontSize / 4;
        if(diff < tolerance && diff > bestDiff){
          bestDiff = diff;
          bestFontSize = curFontSize;
          bestLetterSpacing = curLetterSpacing;
          bestLineHeight = curLineHeight;
        }
        let newFontSize:number;
        let newLetterSpacing:number;
        let newLineHeight:number;
        if(fillThePage){
          if(diff > 0)
            fillThePage++;
          else
            bestLetterSpacing = curLetterSpacing;

          newLetterSpacing = curLetterSpacing - (diffSign?diffSign:-1) * .1;
        }
        else if (Math.abs(diff) > 400) {
          newFontSize = curFontSize + Math.round(((curFontSize * textHeight / scrollHeight) - curFontSize) / 4);
        }
        else if (Math.abs(diff) > 100) {
          newFontSize = curFontSize - diffSign * .5;
        }
        else if ( diff !== 0) {
          if(curFontSize>12)
            newLineHeight = curLineHeight - diffSign;
          else {
            newLetterSpacing = curLetterSpacing - diffSign * .1;
            if(newLetterSpacing<=-1.2){
              newFontSize = curFontSize - diffSign * .1;
            }
          }
        }
        else if(curFontSize>12)
          fillThePage++;

        if (newFontSize !== undefined) {
          style.fontSize = newFontSize + 'px';
          change = true;
        }

        if (newLetterSpacing != undefined && newLetterSpacing > -1.2) {
          if(newLetterSpacing < 3.1 ) {
            style.letterSpacing = newLetterSpacing + 'px';
            change = true;
          }
          else{
            fillThePage++;
            change = true;
          }
        }

        if(newLineHeight !== undefined){
          style.lineHeight = newLineHeight + '%';
          change = true;
        }

        if(change || fillThePage)
          setTimeout(changeFontSize, 0);
        else
          style.visibility=null;

        count++;
      }
      else if(bestFontSize && bestLetterSpacing){
        style.fontSize = bestFontSize + 'px';
        style.letterSpacing = bestLetterSpacing + 'px';
        style.lineHeight = bestLineHeight + '%';
        if(curFontSize>12 && fillThePage < 2) {
          fillThePage++;
          setTimeout(changeFontSize, 0);
        }
        else
          style.visibility=null;
      }
      else
        style.visibility=null;
    }
    setTimeout(changeFontSize, 0);
  }
}
