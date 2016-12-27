import { Component, OnInit, ViewChild, } from '@angular/core';
import { QuranService } from './quran.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private nightMode=false;

  constructor(private quranService:QuranService){}

  ngOnInit():void {
    this.nightMode = this.quranService.nightMode;
    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }
}
