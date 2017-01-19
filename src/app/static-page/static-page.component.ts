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
  @ViewChild('tapperRight') tapperRight;
  @ViewChild('tapperLeft') tapperLeft;
  @Input() pageHeight;
  @Input() pageWidth;
  @Input() textHeight;
  @Input() pageNum;
  @Input() endPage;
  @Input() layer;
  @Input() fontFamily;
  @Input() halfPage;
  @Input() fontScale;
  @Input() fontLineHeight;
  @Input() fontHeightAdjust;
  @Input() mobile=false;
  @Input() portrait=false;

  @Output() back  = new EventEmitter<boolean>();
  @Output() forth = new EventEmitter<boolean>();
  @Output() pageHeightUpdate = new EventEmitter<number>();

  private loading = false;
  private explained = false;
  private startTime;
  private nightMode=false;




  constructor(private quranService:QuranService){}


  goBack(){
    this.back.emit(true);
  }

  goForth(){
    this.forth.emit(true);
  }

  ngOnInit() {
    this.nightMode = this.quranService.nightMode;
    [this.fontScale,this.fontLineHeight,this.fontHeightAdjust]=this.quranService.fontParams(this.fontFamily);
    this.styleChage();
    this.quranService.contentChanged$
      .subscribe((layer)=>{
        if(+layer === +this.layer){
          [this.fontScale,this.fontLineHeight,this.fontHeightAdjust]=this.quranService.fontParams(this.fontFamily);
          this.contentChange();
        }
      });
    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }

  styleChage(){
    this.startTime = Date.now();
    var style = this.border.nativeElement.style;

    style.width = this.pageWidth + 'px';
    if(!this.mobile)
      style.height = this.pageHeight + 'px';

    style.right = this.pageNum * this.pageWidth + 'px';
    style.top = '50px';
  }
  contentChange() {
    this.styleChage();
    var element = this.page.nativeElement;
    var style = element.style;
    let textHeight  = this.textHeight * .9934 - 80;
    if(this.fontHeightAdjust)
      textHeight -= 10;

    let fontSize = Math.round( 38 * this.pageHeight* this.pageWidth * this.fontScale * (this.mobile?1.5:1) / 531e3) ;
    let lineHeight  = this.fontLineHeight+'%';

    style.fontSize    = fontSize + 'px';
    style.lineHeight  = lineHeight;
    var fontSizes=[];
    var bestDiff;
    var bestFontSize;
    let changeFontSize = ()=>{
      if(this.mobile){
        style.margin = this.portrait?'-20px':'-40px';
        setTimeout(()=> {
          let wantedHeight = element.scrollHeight + (this.portrait ? 100 : 80);
          let borderStyle = this.border.nativeElement.style
          borderStyle.height = wantedHeight + 'px';
          this.pageHeight = wantedHeight + 'px';
          this.tapperLeft.nativeElement.style.height = wantedHeight + 'px';
          this.tapperRight.nativeElement.style.height = wantedHeight + 'px';
          this.show(style);
        },0);
      }
      else {
        var diff = Math.abs(element.scrollHeight - textHeight);
        if (diff > textHeight * .0666) {
          if (fontSizes.length < 50 && fontSizes.filter(el=>el === style.fontSize).length < 2) {
            if (!bestDiff || diff < bestDiff) {
              bestDiff = diff;
              bestFontSize = style.fontSize;
            }
            let increment = Math.ceil(parseInt(style.fontSize) / 40);
            if (element.scrollHeight > textHeight)
              increment *= -1;
            style.fontSize = increment + parseInt(style.fontSize) + 'px';
            fontSizes.push(style.fontSize);

            setTimeout(changeFontSize, 0);
          }
          else {
            if (bestFontSize)
              style.fontSize = bestFontSize;
            setTimeout(changeLineSpacing, 0);
          }
        }
        else {
          setTimeout(changeLineSpacing, 0);
        }
      }
    };
    var lineHeights = [];
    var bestLineHeight;
    let changeLineSpacing = ()=>{
      var diff = element.scrollHeight - textHeight;
      if(diff>0 || (diff<0 && -diff>20)){
        if(diff<0&&-diff<bestDiff){
          bestDiff = -diff;
          bestLineHeight = parseInt(style.lineHeight);
        }
        let newLineHeight = (element.scrollHeight > textHeight?-1:1) + parseInt(style.lineHeight);
        if(lineHeights.length<50&&lineHeights.filter(el=>el===newLineHeight).length < 2) {
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
