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
    this.setBackgroundColor();
    this.nightMode = this.quranService.nightMode;
    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
          this.setBackgroundColor();
        }
      );
  }

  private setBackgroundColor() {
    if(this.nightMode){
      document.body.style.color="white !important";
      document.body.style.backgroundColor="black";
    }
    else{
      document.body.style.color="black";
      document.body.style.backgroundColor="#faf6f3";
    }
  }
}
