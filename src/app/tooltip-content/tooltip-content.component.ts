import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip-content',
  templateUrl: './tooltip-content.component.html',
  styleUrls: ['./tooltip-content.component.css']
})

export class TooltipContentComponent implements OnInit {
  @Input('sajdaType') sajdaType;
  private tooltipContentString: string = '';

  constructor() { }

  ngOnInit() {

    switch (this.sajdaType){
      case 'obligatory' :
        this.tooltipContentString = "سجده مستحب";
        break;
      case 'recommended' :
        this.tooltipContentString = "سجده واجب";
        break;
      default:
        this.tooltipContentString = "*";
    }
  }
}
