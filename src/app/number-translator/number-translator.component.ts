import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-number-translator',
  templateUrl: './number-translator.component.html',
  styleUrls: ['./number-translator.component.css']
})
export class NumberTranslatorComponent implements OnInit {
  @Input() inputNumber;
  private ayaTranslated: string;

  constructor() { }

  ngOnInit( ) {
    this.inputNumber = this.inputNumber.toString();
    var englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var persianDigits = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
    var resultArray = [];
    for (var i = 0; i < this.inputNumber.length; i++)
      for (var j = 0; j < englishDigits.length; j++)
        if (this.inputNumber[i] === englishDigits[j])
          resultArray.push(persianDigits[j]);
    var s = "";
    for (var k = 0; k < resultArray.length; k++)
      s = s + (resultArray[k]);
    this.ayaTranslated = s;
  }
}
