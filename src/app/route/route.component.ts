import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {WindowRef} from "../windowRef";
import {MdDialog, MdDialogRef} from "@angular/material";
import {KhatmComponent} from "../khatm/khatm.component";
import {Ng2DeviceService} from "ng2-device-detector";
import {MsgService} from "../msg.service";

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  khatmLink: string = '';

  constructor(private route: ActivatedRoute, private winRef: WindowRef,
              public dialog: MdDialog, private router: Router,
              private deviceService: Ng2DeviceService, private msgService: MsgService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (param) => {
        this.khatmLink = param['khlink'];
        this.navigationHandler();
      },
      (err) => this.msgService.warn('Cannot get khatm share link')
    );
  }

  navigationHandler(){
    if(this.deviceService.getDeviceInfo().device === 'unknown')
      this.routeToKhatm();
    else{
      setTimeout(() => {
        this.routeToKhatm();
      }, 6000);
      this.winRef.getWindow().location.href = 'quranapp://khatm/' + this.khatmLink;
    }
  }

  routeToKhatm(){
    this.router.navigate(['']);
    let dialogRef: MdDialogRef<KhatmComponent> = this.dialog.open(KhatmComponent, {
      height: '600px',
      width: '400px',
      data: {
        isNew: false,
        khatm: null,
        shareLink: this.khatmLink
      },
      disableClose: true
    });
  }
}
