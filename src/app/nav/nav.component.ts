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
  }
  zoomIn(){
    this.quranService.zoomIn();
  }
  menuClick(){
    this.active = !this.active;
  }
  resetZoom(){
    this.quranService.resetZoom();
  }
  changeFont(){
    this.quranService.fontChange();
  }
  ngOnInit() {
  }

}
