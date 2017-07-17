import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {WindowRef} from "../windowRef";

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  khatmLink: string = '';

  constructor(private route: ActivatedRoute, private winRef: WindowRef) { }

  ngOnInit() {
    this.route.params.subscribe(
      (param) => {
        this.khatmLink = param['khlink'];
        this.navigationHandler();
      },
      (err) => console.log(err)
    );
  }

  navigationHandler(){
    setTimeout(() => {
      this.winRef.getWindow().location.href = 'https://play.google.com';
    }, 6000);
    this.winRef.getWindow().location.href = 'quranapp://khatm/' + this.khatmLink;
  }

}
