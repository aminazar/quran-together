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
      this.qhizb_Hizb_juz_Number = this.hizbNumber/8 + 1;
    else
      if( this.hizbNumber%4===0 )
        this.qhizb_Hizb_juz_Number = this.hizbNumber/4;
    else
      this.qhizb_Hizb_juz_Number = Math.floor(this.hizbNumber/4)+1 ;

    switch (this.tooltipMessage)
    {
      case 'obligatory':
        this.qhizbJuzSajdaMessage = "سجدة واجب";
        break;
      case 'recommended':
        this.qhizbJuzSajdaMessage = "سجدة مستحب";
        break;
      case 'juz':
        this.qhizbJuzSajdaMessage = "الجزء ";
        break;
      case 'hizb':
        this.qhizbJuzSajdaMessage =  "الحزب ";
        break;
      case '3qhizb':
        this.qhizbJuzSajdaMessage = "ثلاثة أرباع الحزب ";
        break;
      case 'hhizb':
        this.qhizbJuzSajdaMessage ="نصف الحزب ";
        break;
      case 'qhizb':
        this.qhizbJuzSajdaMessage = "ربع الحزب ";
        break;
    }
    this.qhizbJuzSajdaSignOut = this.qhizbSajdaSign;

  }

}
