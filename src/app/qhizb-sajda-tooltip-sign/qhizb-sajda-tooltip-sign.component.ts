import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-qhizb-sajda-tooltip-sign',
  templateUrl: './qhizb-sajda-tooltip-sign.component.html',
  styleUrls: ['./qhizb-sajda-tooltip-sign.component.css']
})
export class QhizbSajdaTooltipSignComponent implements OnInit {
  @Input () qhizbSajdaSign;
  @Input () tooltipMessage;
  @Input () hizbNumber;
  @Input () juzNumber;
  private x ;
  private  qhizbSajdaSignOut: string = '';
  private  qhizbSajdaMessage: string = '';
  private juzFarsi = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفتم', 'هشتم', 'نهم','دهم','یازدهم', 'دوازدهم', 'سیزدهم', 'چهاردهم', 'پانزدهم', 'شانزدهم', 'هفدهم', 'هجدهم', 'نوزدهم','بیستم','بیست و یکم', 'بیست و دوم', 'بیست و سوم', 'بیست و چهارم', 'بیست و پنجم', 'بیست و ششم', 'بیست و هفتم', 'بیست و هشتم', 'بیست و نهم','سی ام'];
  constructor() { }

  ngOnInit() {
    if( this.hizbNumber%4===0 )
      this.x = this.hizbNumber/4;
    else
      this.x = Math.floor(this.hizbNumber/4)+1 ;


    switch (this.tooltipMessage)
    {
      case 'obligatory':
        this.qhizbSajdaMessage = "سجده واجب";
        break;
      case 'recommended':
        this.qhizbSajdaMessage = "سجده مستحب";
        break;
      case 'juz':
        this.qhizbSajdaMessage = "جزء " + this.juzNumber;
        break;
      case 'hizb':
        this.qhizbSajdaMessage =  "حزب " + this.x;
        break;
      case '3qhizb':
        this.qhizbSajdaMessage = "سه ربع حزب "+ this.x;
        break;
      case 'hhizb':
        this.qhizbSajdaMessage ="نصف حزب " + this.x;
        break;
      case 'qhizb':
        this.qhizbSajdaMessage = "ربع حزب "+ this.x;
        break;
    }
    this.qhizbSajdaSignOut = this.qhizbSajdaSign;
  }

}
