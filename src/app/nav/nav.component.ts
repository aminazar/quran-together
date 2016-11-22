import { Component, OnInit } from '@angular/core';
import { QuranService } from "../quran.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private active:boolean;
  constructor(private quranService:QuranService) {
    this.active=false;
  }
  zoomOut(){
    this.quranService.zoomOut();
    this.menuClick();
  }
  zoomIn(){
    this.quranService.zoomIn();
    this.menuClick();
  }
  menuClick(){
    this.active = !this.active;
  }
  resetZoom(){
    this.quranService.resetZoom();
    this.menuClick();
  }
  changeFont(){
    this.quranService.fontChange();
    this.menuClick();
  }
  ngOnInit() {
  }

}
