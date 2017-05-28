import { Component, OnInit, ViewChild, } from '@angular/core';
import { QuranService } from './quran.service';
import {MsgService} from "./msg.service";
import {MdSnackBar} from "@angular/material";
import {WindowRef} from "./windowRef";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private nightMode=false;
  height: string;
  backgroundColor: string;
  color: string;
  nightModeVar;

  constructor(private quranService:QuranService, private msgService: MsgService,
              public snackBar: MdSnackBar, private winRef: WindowRef){}

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

    this.height = this.winRef.getWindow().innerHeight + "px";
    this.winRef.getWindow().onresize = (e) => {
      this.height = this.winRef.getWindow().innerHeight + "px";
    };

    this.setBackgroundColor();
    this.nightMode = this.quranService.nightMode;
    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
          this.nightModeVar = this.nightMode;
          this.setBackgroundColor();
        }
      );

    this.nightModeVar = this.quranService.nightMode;
  }

  private setBackgroundColor() {
    if(this.nightMode){
      // document.body.style.color="white !important";
      // document.body.style.backgroundColor="black";

      this.color = "white";
      this.backgroundColor = "black";
    }
    else{
      // document.body.style.color="black";
      // document.body.style.backgroundColor="#faf6f3";

      this.color = "black";
      this.backgroundColor = "#faf6f3";
    }
  }
}
