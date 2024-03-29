import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import * as moment from 'moment-timezone';
import {MdDialogRef, MD_DIALOG_DATA, MdDialog} from "@angular/material";
import {ClipboardService} from 'ng2-clipboard/ng2-clipboard';

import {MsgService} from "../msg.service";
import {KhatmService} from "../khatm.service";
import {QuranService} from "../quran.service";
import {CommitmentComponent} from "../commitment/commitment.component";
import {AuthService} from "../auth.service";
import {RegistrationComponent} from "../registration/registration.component";

@Component({
  selector: 'app-khatm',
  templateUrl: './khatm.component.html',
  styleUrls: ['./khatm.component.css']
})
export class KhatmComponent implements OnInit {
  @ViewChild('commitPagesInput') commitPagesInput: HTMLFormElement;
  basicShareLink: string = 'https://www.read.quran.parts/khatm/';
  khatmIsStarted: boolean = true;
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
  endDateDisplay: string = '';
  rest_days: number = null;
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };
  isChangingCommitments: boolean = false;
  isLoading: boolean = false;
  isMember: boolean = true;
  isCommit: boolean = false;

  constructor(private msgService: MsgService, private khatmService: KhatmService,
              public dialogRef: MdDialogRef<KhatmComponent>, private quranService: QuranService,
              public dialog: MdDialog, @Inject(MD_DIALOG_DATA) private data: any,
              private authService: AuthService, private clipboard: ClipboardService) {
    this.suras = this.quranService.getAllSura();
  }

  ngOnInit() {
    this.startDate = this.currentDate.getFullYear() + '-' +
                     this.getFormattedDate(this.currentDate.getMonth(), true) + '-' +
                     this.getFormattedDate(this.currentDate.getDate(), false);

    let khatmLink = this.data.shareLink;

    if(khatmLink !== undefined && khatmLink !== null){
      let stillNotLoggedIn: boolean = true;
      let visited: boolean = false;
      this.isMember = false;

      //Check user authentication
      this.authService.isLoggedIn.subscribe(
        (status) => {
          if(status){
            stillNotLoggedIn = false;
            this.isNew = true;
            this.khatm = null;
            this.khatmService.getKhatmByLink(khatmLink)
              .then(res => {
                this.khatm = res;
                this.isNew = false;

                let mDate = moment(this.currentDate);
                if(moment(this.khatm.start_date) > mDate)
                  this.khatmIsStarted = false;
                else
                  this.khatmIsStarted = true;

                this.rest_days = moment(this.khatm.end_date).diff(mDate, 'days');
                if(this.rest_days !== 0 || parseInt(mDate.format('D')) !== parseInt(moment(this.khatm.end_date).format('D')))
                  this.rest_days++;

                this.isMember = (this.khatm.you_read !== null && this.khatm.you_unread !== null);
              })
              .catch(err => {
                this.khatm = null;
                this.msgService.message('Cannot get khatm details. The khatm maybe expired. ' + err.message);
              })
          }
          else if(!status && !visited){
            visited = true;
            setTimeout(() => {
              if(stillNotLoggedIn && !this.authService.isLoggedIn.getValue()){
                stillNotLoggedIn = false;

                let logginAlert = this.dialog.open(NotLoggedInDialog, {
                  height: '150px',
                  width: '400px'
                });

                logginAlert.afterClosed().subscribe(
                  (data) => {
                    switch (data) {
                      case 0: {
                        this.dialog.open(RegistrationComponent, {
                          height: '400px',
                          width: '300px',
                          data: {
                            isRegister: true
                          }
                        });
                      }
                        break;
                      case 1: {
                        this.dialog.open(RegistrationComponent, {
                          height: '400px',
                          width: '300px',
                          data: {
                            isRegister: false
                          }
                        })
                      }
                        break;
                      case 2: this.dialogRef.close();
                        break;
                    }
                  }
                )
              }
            }, 1000);
          }
        },
        (err) => {
          this.msgService.error(err);
        }
      );
    }
    else{
      this.isNew = this.data.isNew;
      this.khatm = this.data.khatm;
      this.isMember = true;

      if(this.khatm !== null){
        this.endDateDisplay = moment(this.khatm.end_date).format('YYYY-MMM-DD');

        let mDate = moment(this.currentDate);

        this.rest_days = moment(this.khatm.end_date).diff(mDate, 'days');
        if(this.rest_days !== 0 || parseInt(mDate.format('D')) !== parseInt(moment(this.khatm.end_date).format('D')))
          this.rest_days++;

        if(moment(this.khatm.start_date) > mDate)
          this.khatmIsStarted = false;
        else
          this.khatmIsStarted = true;
      }
    }
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

  changeDuration(currentFocus, newVal){
    let currentDate = moment(this.currentDate);
    let startDate = (currentFocus === 'start') ? moment(newVal) : moment(this.startDate);
    let endDate = (currentFocus === 'end') ? moment(newVal) : moment(this.endDate);

    //Check start date validation
    if(this.isFirstLess(startDate, currentDate)){
      this.startDate = this.castDate(currentDate);
      this.msgService.warn('Please choose valid start date');
      this.submitDisability = true;
      return;
    }

    //Check all date validation
    if(!moment(this.startDate).isValid){
      this.msgService.warn('Please choose the valid start date');
      this.startDate = null;
      this.submitDisability = true;
      return;
    }
    else if(!moment(this.endDate).isValid){
      this.msgService.warn('Please choose the valid end date');
      this.endDate = null;
      this.submitDisability = true;
      return;
    }

    if(this.lastFocus === 'start'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.startDate = this.castDate(currentDate);
          this.msgService.warn('Please choose valid start date');
          this.submitDisability = true;
          return;
        }

        if(this.duration !== null && this.duration !== '')
          this.startDate = this.castDate(this.getDate(this.startDate, this.duration, null));
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, startDate)){
          this.endDate = null;
          this.msgService.warn('Please choose valid end date');
          this.submitDisability = true;
          return;
        }
        else
          this.duration = this.getDate(startDate, null, endDate);
      }
      else if(currentFocus === 'duration'){
        if(this.duration !== null && this.duration !== '') {
          if (this.duration > (365 * 10)) {
            this.duration = null;
            this.msgService.warn('The duration cannot be greater than 10 years');
            this.submitDisability = true;
            return;
          }
          else
            this.endDate = this.castDate(this.getDate(startDate, this.duration, null));
        }
      }
    }
    else if(this.lastFocus === 'end'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.startDate = this.castDate(currentDate);
          this.msgService.warn('Please choose valid start date');
          this.submitDisability = true;
          return;
        }
        else
          this.duration = this.getDate(startDate, null, endDate);
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, currentDate)){
          this.endDate = null;
          this.msgService.warn('Please choose valid end date');
          this.submitDisability = true;
          return;
        }
        else
          this.duration = this.getDate(startDate, null, endDate);
      }
      else if(currentFocus === 'duration'){
        if(this.duration !== null && this.duration !== '') {
          if (this.duration < 0) {
            this.duration = null;
            this.msgService.warn('The duration value cannot be negative');
            this.submitDisability = true;
            return;
          }
          else {
            let tempStartDate = this.getDate(null, this.duration, endDate);

            if (this.isFirstLess(tempStartDate, currentDate)) {
              this.startDate = this.castDate(currentDate);
              this.endDate = this.castDate(endDate.add(currentDate.diff(tempStartDate, 'days'), 'days'));
            }
            else
              this.startDate = this.castDate(tempStartDate);
          }
        }
      }
    }
    else if(this.lastFocus === 'duration'){
      if(currentFocus === 'start'){
        if(this.isFirstLess(startDate, currentDate)){
          this.msgService.warn('The start date cannot be less than current date');
          this.startDate = this.castDate(currentDate);
          this.submitDisability = true;
          return;
        }
        else if(this.duration !== null && this.duration !== '')
          this.endDate = this.castDate(this.getDate(startDate, this.duration, null));
      }
      else if(currentFocus === 'end'){
        if(this.isFirstLess(endDate, currentDate)){
          this.endDate = null;
          this.msgService.warn('The end date cannot be less than current date');
          this.submitDisability = true;
          return;
        }
        else if(this.duration !== null && this.duration !== ''){
          let tempStartDate = this.getDate(null, this.duration, endDate);

          if(this.isFirstLess(tempStartDate, currentDate)){
            this.startDate = this.castDate(currentDate);
            this.endDate = this.castDate(endDate.add(currentDate.diff(tempStartDate, 'days'), 'days'));
          }
          else
            this.startDate = this.castDate(tempStartDate);
        }
      }
      else if(currentFocus === 'duration'){
        if(this.duration !== null && this.duration !== '') {
          if (this.duration < 0) {
            this.msgService.warn('The duration value cannot be negative');
            this.duration = null;
            this.submitDisability = true;
            return;
          }
          else
            this.endDate = this.castDate(this.getDate(startDate, this.duration, null));
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

  copyLink(){
    this.clipboard.copy(this.basicShareLink + this.khatm.share_link);
  }

  changeCommitPages(data){
    let newValNum = parseInt(data);
    if(data.toString() === '')
      newValNum = 0;

    if(!this.isMember)
      this.isCommit = !(newValNum === 0);

    console.log(this.commitPagesInput);

    if(newValNum < 0){
      this.commitPagesInput.nativeElement.value = (this.khatm.you_unread === null) ? 0 : this.khatm.you_unread;
      this.msgService.warn('The value cannot be less than  0');
      return;
    }

    if(data !== null && data !== undefined && newValNum !== this.khatm.you_unread){
      //Start loading controller
      this.isLoading = true;

      //update commit page for khatm
      let type = (newValNum < (this.khatm.you_unread === null ? 0 : this.khatm.you_unread)) ? 'delete' : 'add';

      if(type === 'add' && this.khatm.commitment_pages >= this.khatm.repeats * 604){
        this.commitPagesInput.nativeElement.value = this.khatm.you_unread;
        this.msgService.warn('Sorry. All pages are committed');
        this.isChangingCommitments = false;
      }
      else{
        this.khatmService.getPages(newValNum, this.khatm.khid, type)
          .then((res: any) => {
            if(res !== null){
              this.khatm.commitment_pages = (this.khatm.commitment_pages === null) ? 0 : this.khatm.commitment_pages;
              this.khatm.you_unread = (this.khatm.you_unread === null) ? 0 : this.khatm.you_unread;
              this.khatm.you_read = (this.khatm.you_read === null) ? 0 : this.khatm.you_read;

              if(type === 'add'){
                this.khatm.commitment_pages = parseInt(this.khatm.commitment_pages) + parseInt(res);
                this.khatm.you_unread = (newValNum === 0) ? null : (parseInt(this.khatm.you_unread) + parseInt(res));
                this.msgService.message(res + ' pages are assigned to you');
              }
              else{
                this.khatm.commitment_pages = parseInt(this.khatm.commitment_pages) - (parseInt(this.khatm.you_unread) - parseInt(res));
                this.msgService.message((parseInt(this.khatm.you_unread) - parseInt(res)) + ' pages get down from your commitments');
                this.khatm.you_unread = (newValNum === 0) ? null : res;
              }
            }

            this.isChangingCommitments = false;

            //Stop loading controller
            this.isLoading = false;
          })
          .catch((err) => {
            //Stop loading controller
            this.isLoading = false;
            this.isChangingCommitments = false;

            this.msgService.error(err);
            this.msgService.warn('Cannot assing you requested pages');
          });
      }
    }
    else
      this.isChangingCommitments = false;
  }

  goToCommitment(isSelect){
    let dialogRef = this.dialog.open(CommitmentComponent, {
      height: '500px',
      width: '400px',
      data: {
        isSelect: isSelect,
        khatm: this.khatm
      }
    });
  }

  start_stop_Khatm(){
    this.khatmService.start_stop_Khatm(this.khatm);

    if(this.khatmService.activeKhatm.getValue() !== null)
      this.dialogRef.close();
  }

  isFirstLess(aDate, bDate){
    return aDate.diff(bDate, 'days') < 0 ? true : false;
  }

  limitClick(value){
    if(value !== null || value !== undefined){
      let data: number = (value.toString() === '') ? 0 : parseInt(value);

      this.isChangingCommitments = (data !== parseInt(this.khatm.you_unread));
    }
    else
      this.isChangingCommitments = false;
  }

  checkCommitmentStatus(value) {
    if (value !== null && value !== '' && parseInt(value) !== parseInt(this.khatm.you_unread)) {
      let changeAlert = this.dialog.open(ChangeCommitmentDialog, {
        height: '150px',
        width: '400px'
      });

      changeAlert.afterClosed().subscribe(
        (data) => {
          if (data === 'yes') {
            this.changeCommitPages(value);
            this.khatmService.loadKhatm(this.authService.user.getValue().email);
          }
          else if (data === 'no') {
            this.commitPagesInput.nativeElement.value = this.khatm.you_unread;
            this.isChangingCommitments = false;
          }
        }
      )
    }
    else if (value === null || value === '') {
      this.checkOnLeft();
    }
    else
      this.khatmService.loadKhatm(this.authService.user.getValue().email);
  }

  checkOnLeft(){
    if((this.isChangingCommitments && !this.isCommit) || (!this.isMember && !this.isChangingCommitments && !this.isCommit)){
      if(this.isMember){
        let changeAlert = this.dialog.open(ChangeCommitmentDialog, {
          height: '150px',
          width: '400px'
        });

        changeAlert.afterClosed().subscribe(
          (data) => {
            if(data === 'yes')
              this.changeCommitPages(this.commitPagesInput.nativeElement.value);
            else if(data === 'no'){
              this.commitPagesInput.nativeElement.value = this.khatm.you_unread;
              this.isChangingCommitments = false;
            }
          }
        )
      }
      else{
        if(this.khatm.owner_email !== this.authService.user.getValue().email){
          let joinAlert = this.dialog.open(NotJoinDialog, {
            height: '150px',
            width: '400px'
          });

          joinAlert.afterClosed().subscribe(
            (data) => {
              if(!data){
                this.khatmService.loadKhatm(this.authService.user.getValue().email);
                this.dialogRef.close();
              }
            }
          )
        }
        else
          this.dialogRef.close();
      }
    }
    else{
      this.khatmService.loadKhatm(this.authService.user.getValue().email);
      this.dialogRef.close();
    }
  }
}


@Component({
  selector: 'notLoggedIn_dialog',
  template: `
    <div>
      <label>You should be logged in to see khatm details</label>
      <md-grid-list cols="3" rowHeight="50px">
        <md-grid-tile colspan="1">
          <button md-raised-button (click)="clickResponse(0)">Register</button>
        </md-grid-tile>
        <md-grid-tile colspan="1">
          <button md-raised-button (click)="clickResponse(1)">Sign In</button>
        </md-grid-tile>
        <md-grid-tile colspan="1">
          <button md-raised-button (click)="clickResponse(2)">Cancel</button>
        </md-grid-tile>
      </md-grid-list>
    </div>
  `
})
export class NotLoggedInDialog{
  constructor(public dialogRef: MdDialogRef<NotLoggedInDialog>){}

  clickResponse(number){
    this.dialogRef.close(number);
  }
}

@Component({
  selector: 'changeCommitment-dialog',
  template: `
    <div>
      <label>Your commitment page number is changed. Would you like to save it?</label>
      <md-grid-list cols="2" rowHeight="50px">
        <md-grid-tile colspan="1">
          <button md-raised-button (click)="clickResponse('yes')">Yes</button>
        </md-grid-tile>
        <md-grid-tile colspan="1">
          <button md-raised-button (click)="clickResponse('no')">No</button>
        </md-grid-tile>
      </md-grid-list>
    </div>
  `
})
export class ChangeCommitmentDialog{
  constructor(public dialogRef: MdDialogRef<ChangeCommitmentDialog>){}

  clickResponse(action){
    this.dialogRef.close(action);
  }
}

@Component({
  selector: 'notJoin_dialog',
  template: `
    <div>
      <label>You cannot join to this khatm unless commit some pages. Do you want to join this khatm?</label>
      <md-grid-list cols="2" rowHeight="50px">
        <md-grid-tile colspan="1">
          <button md-raised-button (click)="clickResponse(true)">Interested to join</button>
        </md-grid-tile>
        <md-grid-tile colspan="1">
          <button md-raised-button (click)="clickResponse(false)">Uninterested to join</button>
        </md-grid-tile>
      </md-grid-list>
    </div>
  `
})
export class NotJoinDialog{
  constructor(public dialogRef: MdDialogRef<NotJoinDialog>){}

  clickResponse(action){
    this.dialogRef.close(action);
  }
}
