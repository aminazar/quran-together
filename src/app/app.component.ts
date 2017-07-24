import { Component, OnInit} from '@angular/core';
import { MdSnackBar } from "@angular/material";
import { Ng2DeviceService } from 'ng2-device-detector';

import { QuranService } from './quran.service';
import {MsgService} from "./msg.service";
import {WindowRef} from "./windowRef";
import {AuthService} from "./auth.service";
import {KhatmService} from "./khatm.service";

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
  storeAddress = '';
  showLink = true;

  constructor(private quranService:QuranService, private msgService: MsgService,
              public snackBar: MdSnackBar, private winRef: WindowRef,
              private deviceService: Ng2DeviceService, private authService: AuthService,
              private khatmService: KhatmService){}

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

    if(this.deviceService.getDeviceInfo().device === 'unknown')
      this.showLink = false;
    else{
      this.showLink = true;
      if(this.deviceService.getDeviceInfo().device === 'ios' || this.deviceService.getDeviceInfo().device === 'iphone')
        this.storeAddress = 'App Store';
      else if(this.deviceService.getDeviceInfo().device === 'android')
        this.storeAddress = 'Play Store';
      else
        this.storeAddress = 'Microsoft Store';
    }

    this.authService.user.subscribe(
      (u) => {
        if(u !== null && u.token !== null && u.token !== undefined){
          this.khatmService.loadKhatm(u.email);
        }
      }
    )
  }

  private setBackgroundColor() {
    if(this.nightMode){
      this.color = "white";
      this.backgroundColor = "black";
    }
    else{
      this.color = "black";
      this.backgroundColor = "#faf6f3";
    }
  }

  openLink(){
    this.showLink = false;
  }
}
