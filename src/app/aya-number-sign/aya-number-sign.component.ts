import { Component, Input, OnInit } from '@angular/core';
//TODO: Adding on-copy event to remove aya sign and keep aya number

@Component({
  selector: 'app-aya-number-sign',
  templateUrl: './aya-number-sign.component.html',
  styleUrls: ['./aya-number-sign.component.css']
})
export class AyaNumberSignComponent implements OnInit {
  @Input() ayanumber;
  @Input() reverse;
  @Input() uthmanic;
  constructor() {
  }

  ngOnInit( ) {

  }
}
