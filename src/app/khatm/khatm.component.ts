import {Component, OnInit, Inject} from '@angular/core';
// import * as moment from 'moment';
import * as moment from 'moment-timezone';
import {MdDialogRef, MD_DIALOG_DATA } from "@angular/material";

import {MsgService} from "../msg.service";
import {KhatmService} from "../khatm.service";
import {QuranService} from "../quran.service";

@Component({
  selector: 'app-khatm',
  templateUrl: './khatm.component.html',
  styleUrls: ['./khatm.component.css']
})
export class KhatmComponent implements OnInit {
  isSubmitted: boolean = false;
  name: string = '';
  description: string = '';
  ownerShown: boolean = true;
  range: string = 'whole';
  rangeDisplay: string = 'Whole Quran';
  suraNumber: number = 1;
  suras = [];
  repeats: number = 1;
  currentDate = new Date();
  startDate = null;
  endDate = null;
  isNew: boolean = false;
  khatm: any;

  constructor(private msgService: MsgService, private khatmService: KhatmService,
              public dialogRef: MdDialogRef<KhatmComponent>, private quranService: QuranService,
              @Inject(MD_DIALOG_DATA) private data: { isNew: boolean, khatm: any }) {
    this.suras = this.quranService.getAllSura();
    this.isNew = this.data.isNew;
    this.khatm = this.data.khatm;
  }

  ngOnInit() {
    this.startDate = this.currentDate.getFullYear() + '-' +
                     this.getFormattedDate(this.currentDate.getMonth(), true) + '-' +
                     this.getFormattedDate(this.currentDate.getDate(), false);
  }

  submit(){
    this.rangeDisplay = (this.range === 'whole') ? 'Whole Quran' : 'Specific Sura';

    //Check validation
    if(this.name === null || this.name === '')
      this.msgService.warn('The khatm should have a name');
    else if(this.endDate === null)
      this.msgService.warn('The end date field cannot be empty');
    else if(this.endDate < this.startDate)
      this.msgService.warn('The start date cannot be later then end date');
    else
      this.isSubmitted = true;
  }

  create(){
    let khatmData = {
      name: this.name,
      description: this.description,
      creator_shown: this.ownerShown,
      start_date: this.startDate,
      end_date: this.endDate,
      timezone:  moment.tz(moment.tz.guess()).format('z'),
      specific_sura: (this.range === 'whole') ? null : this.suraNumber,
      repeats: this.repeats
    };

    this.khatmService.createKhatm(khatmData)
      .then((res) => {
        this.msgService.message('Your khatm created successfully');
        this.dialogRef.close();
      })
      .catch((err) => {
        this.msgService.warn('Cannot save your khamt now. Please try again');
      })
  }

  getFormattedDate(num, isMonth){
    let n = isMonth ? num + 1 : num;

    if(n >=1 && n <= 9)
      return '0' + n.toString();
    else
      return n.toString();
  }
}
