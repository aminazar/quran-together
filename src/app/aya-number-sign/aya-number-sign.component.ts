import { Component, Input, OnInit } from '@angular/core';
//TODO: Adding on-copy event to remove aya sign and keep aya number

@Component({
  selector: 'app-aya-number-sign',
  templateUrl: './aya-number-sign.component.html',
  styleUrls: ['./aya-number-sign.component.css']
})
export class AyaNumberSignComponent implements OnInit {
  @Input() ayanumber;

  private ayaArabic: string;

  constructor() {
  }

  ngOnInit() {
    this.ayanumber = this.ayanumber.toString();
    var englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var persianDigits = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
    var resultArray = [];
    for (var i = 0; i < this.ayanumber.length; i++)
      for (var j = 0; j < englishDigits.length; j++)
        if (this.ayanumber[i] === englishDigits[j])
          resultArray.push(persianDigits[j]);
    var s = "";
    for (var k = 0; k < resultArray.length; k++)
      s = s + (resultArray[k]);

    this.ayaArabic = s;
  }
}
