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
  private qhizb_Hizb_juz_Number: number = 0;
  private qhizbJuzSajdaSignOut: string = '';
  private qhizbJuzSajdaMessage: string = '';
  constructor() { }

  ngOnInit() {
    if(this.hizbNumber%8===0)
      this.qhizb_Hizb_juz_Number = this.hizbNumber/8;
    else
      if( this.hizbNumber%4===0 )
        this.qhizb_Hizb_juz_Number = this.hizbNumber/4;
    else
      this.qhizb_Hizb_juz_Number = Math.floor(this.hizbNumber/4)+1 ;

    switch (this.tooltipMessage)
    {
      case 'obligatory':
        this.qhizbJuzSajdaMessage = "سجده واجب";
        break;
      case 'recommended':
        this.qhizbJuzSajdaMessage = "سجده مستحب";
        break;
      case 'juz':
        this.qhizbJuzSajdaMessage = "جزء ";
        break;
      case 'hizb':
        this.qhizbJuzSajdaMessage =  "حزب ";
        break;
      case '3qhizb':
        this.qhizbJuzSajdaMessage = "سه ربع حزب ";
        break;
      case 'hhizb':
        this.qhizbJuzSajdaMessage ="نصف حزب ";
        break;
      case 'qhizb':
        this.qhizbJuzSajdaMessage = "ربع حزب ";
        break;
    }
    this.qhizbJuzSajdaSignOut = this.qhizbSajdaSign;

  }

}
