import { Component, OnInit } from '@angular/core';
import {Ng2DeviceService} from "ng2-device-detector";
import {Router} from "@angular/router";

import {WindowRef} from "../windowRef";

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {
  storeAddress: string = '';
  imageSource: string = '';

  constructor(private deviceService: Ng2DeviceService, private router: Router,
              private winRef: WindowRef) { }

  ngOnInit() {
    if(this.deviceService.getDeviceInfo().device === 'ios' || this.deviceService.getDeviceInfo().device === 'iphone') {
      this.storeAddress = 'https://appsto.re/gb/nvsbib.i';
      this.imageSource = '../../assets/app_store.png';
    }
    else if(this.deviceService.getDeviceInfo().device === 'android') {
      this.storeAddress = 'https://play.google.com/store/apps/details?id=com.bentoak.systems.quran_together';
      this.imageSource = '../../assets/play_store.png';
    }
  }

  cancel(){
    this.router.navigate(['']);
    this.winRef.showStoreRedirect.next(false);
  }

  download(){
    this.winRef.getWindow().location.href = this.storeAddress;
    this.winRef.showStoreRedirect.next(false);
  }
}
