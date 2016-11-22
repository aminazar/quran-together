import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-qhizb-sign',
  templateUrl: './qhizb-sign.component.html',
  styleUrls: ['./qhizb-sign.component.css']
})
export class QhizbSignComponent implements OnInit {
  @Input() typeOfSection;

  constructor() { }

  ngOnInit() {
  }

}
