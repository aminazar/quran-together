import { Component, OnInit, ViewChild, } from '@angular/core';
import { QuranService } from './quran.service';
import {MsgService} from "./msg.service";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private nightMode=false;

  constructor(private quranService:QuranService, private msgService: MsgService,
              public snackBar: MdSnackBar){}

  ngOnInit(){
    this.msgService.msg$.subscribe(
        msg => {
          this.snackBar.open(msg, 'x', {duration: 3000, extraClasses: ['snackBar']});
        }
    );
    this.msgService.warn$.subscribe(
        msg => {
          this.snackBar.open(msg, 'x', {duration: 3000, extraClasses: ['warnBar']});
        }
    );

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
