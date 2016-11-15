import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-number-translator',
  templateUrl: './number-translator.component.html',
  styleUrls: ['./number-translator.component.css']
})
export class NumberTranslatorComponent implements OnInit {
  private _input;
  public ayaTranslated: string = '';

  @Input('inputNumber')
  set inputNumber(input) {
    this._input = input;
    if (input) {
      var persianDigits = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
      this.ayaTranslated = input.toString().split('').map(e=>persianDigits[+e]).join('');
    }
  }

  get inputNumber(){
    return this._input;
  }

  constructor() { }

  ngOnInit( ) {

  }
}
