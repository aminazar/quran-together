import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-qhizb-sajda-tooltip-sign',
  templateUrl: './qhizb-sajda-tooltip-sign.component.html',
  styleUrls: ['./qhizb-sajda-tooltip-sign.component.css']
})
export class QhizbSajdaTooltipSignComponent implements OnInit {
  @Input () qhizbSajdaSign;
  @Input () tooltipMessage;
  private  qhizbSajdaSignOut: string = '';
  private  qhizbSajdaMessage: string = '';
  constructor() { }

  ngOnInit() {
    switch (this.tooltipMessage)
    {
      case 'obligatory':
        this.qhizbSajdaMessage = "سجده واجب";
        break;
      case 'recommended':
        this.qhizbSajdaMessage = "سجده مستحب";
        break;
      case 'juz':
        this.qhizbSajdaMessage = "پایان جزء";
        break;
      case 'hizb':
        this.qhizbSajdaMessage = "پایان حزب";
        break;
      case '3qhizb':
        this.qhizbSajdaMessage = "سه ربع حزب";
        break;
      case 'hhizb':
        this.qhizbSajdaMessage = "نیم حزب";
        break;
      case 'qhizb':
        this.qhizbSajdaMessage = "ربع حزب";
        break;
      default:
        this.qhizbSajdaMessage = "*";
    }
    this.qhizbSajdaSignOut = this.qhizbSajdaSign;
  }

}
