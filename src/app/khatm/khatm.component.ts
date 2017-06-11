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
  duration;
  submitDisability: boolean = true;
  lastFocus: string = 'start';

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
    else if(this.range === 'sura' && (this.suraNumber === null || this.suraNumber === 0))
      this.msgService.warn('Please choose sura');
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

  checkDisability(){
    if(this.name.trim() === '' || this.name === null)
      this.submitDisability = true;
    else if(this.repeats < 0)
      this.submitDisability = true;
    else if(this.endDate === undefined || this.endDate === null || (this.endDate < this.startDate))
      this.submitDisability = true;
    else
      this.submitDisability = false;
  }

  changeDuration(currentFocus){
    var mDate = moment(this.currentDate);

    if(currentFocus === 'end' && this.endDate < this.startDate){
      this.msgService.warn('Please choose correct date');
      this.startDate = this.castDate(mDate);
      this.duration = null;
      this.endDate = null;
      return;
    }

    if(this.lastFocus === 'start'){
      if(currentFocus === 'end'){
        this.duration = this.getDate(this.startDate, null, this.endDate);
        this.lastFocus = currentFocus;
        console.log(this.duration);
      }
      else if(currentFocus === 'duration' || currentFocus === 'start'){
        if(this.duration === null || this.duration === 0)
          return;

        var e = this.getDate(this.startDate, this.duration, null);
        if(e > mDate.add(10, 'years')) {
          this.msgService.warn('The end date cannot great than 10 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else{
          this.endDate = this.castDate(e);
          this.lastFocus = currentFocus;
          console.log(this.endDate);
        }
      }
    }
    else if(this.lastFocus === 'duration'){
      if(currentFocus === 'start' || currentFocus === 'duration'){
        if(currentFocus === 'duration' && (this.duration === null || this.duration === 0))
          return;

        var e = this.getDate(this.startDate, this.duration, null);
        if(e > mDate.add(10, 'years')) {
          this.msgService.warn('The end date cannot great than 10 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else {
          this.endDate = this.castDate(e);
          this.lastFocus = currentFocus;
          console.log(this.endDate);
        }
      }
      else if(currentFocus === 'end'){
        var s = this.getDate(null, this.duration, this.endDate);
        if(s < mDate) {
          this.msgService.warn('The start date cannot less than current date');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else if(s > mDate.add(1, 'years')) {
          this.msgService.warn('The start date cannot great than 1 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else {
          this.startDate = this.castDate(s);
          this.lastFocus = currentFocus;
          console.log(this.startDate);
        }
      }
    }
    else if(this.lastFocus === 'end'){
      if(currentFocus === 'start'){
        this.duration = this.getDate(this.startDate, null, this.endDate);
        this.lastFocus = currentFocus;
        console.log(this.duration);
      }
      else if(currentFocus === 'duration' || currentFocus === 'end'){
        if(this.duration === null || this.duration === 0)
          return;

        var s = this.getDate(null, this.duration, this.endDate);
        if(s < mDate) {
          this.msgService.warn('The start date cannot less than current date');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else if(s > mDate.add(1, 'years')) {
          this.msgService.warn('The start date cannot great than 1 year later');
          this.duration = this.getDate(this.startDate, null, this.endDate);
        }
        else {
          this.startDate = this.castDate(s);
          this.lastFocus = currentFocus;
          console.log(this.startDate);
        }
      }
    }

    this.checkDisability();
  }

  getDate(startDate, duration, endDate){
    if(startDate === null){
      var e = moment(endDate);
      var s = e.subtract(duration, 'days');
      return s;
    }
    else if(duration === null){
      var s = moment(startDate);
      var e = moment(endDate);
      return e.diff(s, 'days');
    }
    else if(endDate === null){
      var s = moment(startDate);
      var e = s.add(duration, 'days');
      return e;
    }

    return null;
  }

  castDate(a){
    let date = new Date(a.toObject().years, a.toObject().months, a.toObject().date);

    return date.getFullYear() + '-' + this.getFormattedDate(date.getMonth(), true) + '-' + this.getFormattedDate(date.getDate(), false);
  }
}
