import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private active:boolean;
  constructor() {
    this.active=false;
  }

  menuClick(){
    this.active = !this.active;
  }
  ngOnInit() {
  }

}
