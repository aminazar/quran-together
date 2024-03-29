import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-number-translator',
  templateUrl: './number-translator.component.html',
  styleUrls: ['./number-translator.component.css']
})
export class NumberTranslatorComponent implements OnInit {
  private _input;
  private _farsiNums = false;
  public ayaTranslated: string = '';
  @Input() reverse = false;
  @Input('farsiNums')
  set farsiNums(isFarsi){
    if(isFarsi!==this._farsiNums){
      this._farsiNums=isFarsi;
      this.inputNumber=this._input;
    }
  }
  get farsiNums(){
    return this._farsiNums;
  }

  @Input('inputNumber')
  set inputNumber(input) {
    this._input = input;
    if (input) {
      var persianDigits = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
      if(this.farsiNums)
        persianDigits = '۰۱۲۳۴۵۶۷۸۹'.split('');

      input = input.toString().split('').map(e=>persianDigits[+e]);

      if(this.reverse)
        input = input.reverse();

      this.ayaTranslated = input.join('');
    }
  }

  get inputNumber(){
    return this._input;
  }

  constructor() { }

  ngOnInit( ) {

  }
}
