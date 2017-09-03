import {Component, OnInit, Inject} from '@angular/core';

import {KhatmService} from "../khatm.service";
import {QuranService} from "../quran.service";
import {MdDialogRef, MD_DIALOG_DATA, MdDialog} from "@angular/material";
import {MsgService} from "../msg.service";

@Component({
  selector: 'app-commitment',
  templateUrl: './commitment.component.html',
  styleUrls: ['./commitment.component.css']
})
export class CommitmentComponent implements OnInit {
  khatm: any;
  isSelect: boolean = true;
  startRange: any = null;
  endRange: any = null;
  allCommitments: any = [];
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };
  anyPagesCommitted: boolean = false;
  allSelection: boolean = false;
  selectionCounter: number = 0;

  constructor(private khatmService: KhatmService, private quranService: QuranService,
              public dialogRef: MdDialogRef<CommitmentComponent>,
              @Inject(MD_DIALOG_DATA) private data: any,
              public dialog: MdDialog, private msgService: MsgService) { }

  ngOnInit() {
    this.quranService.nightMode$.subscribe(
      (data) => {
        if(data) {
          this.conditionalColoring.background = 'night_back';
          this.conditionalColoring.text = 'night_text';
          this.conditionalColoring.primary = 'night_primary';
          this.conditionalColoring.secondary = 'night_secondary';
        }
        else{
          this.conditionalColoring.background = 'normal_back';
          this.conditionalColoring.text = 'normal_text';
          this.conditionalColoring.primary = 'normal_primary';
          this.conditionalColoring.secondary = 'normal_secondary';
        }
      }
    );

    this.khatm = this.data.khatm;
    this.isSelect = this.data.isSelect;

    this.khatmService.getCommitments(this.khatm.khid)
      .then((value: any) => {
        this.allCommitments = value.sort((a, b) => {
          if(a.page_number > b.page_number)
            return 1;
          else if(a.page_number < b.page_number)
            return -1;
          else{
            if(a.repeat_number > b.repeat_number)
              return 1;
            else if(a.repeat_number < b.repeat_number)
              return -1;
            else
              return 0;
          }
        });
      })
      .catch(err => {
        this.msgService.error(err);
        this.allCommitments = [];
      });

    this.dialogRef.afterClosed().subscribe(
      (data) => {
        if(this.startRange !== null && this.endRange === null){
          //Submit startRange commitment
          this.khatmService.commitPages(this.khatm.khid, [this.startRange], this.startRange.isread);
        }
      },
      (err) => {
        this.startRange.isread = true;
        this.khatm.you_read = (this.startRange.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
        this.khatm.you_unread = (this.startRange.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
        this.khatm.read_pages = (this.startRange.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
        this.startRange = null;
      }
    )
  }

  commit(page){
    this.anyPagesCommitted = true;

    if(this.startRange !== null)
      this.selectRange(page);
    else {
      page.isread = !page.isread;
      this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
      this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
      this.khatm.read_pages = (page.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
      this.khatmService.commitPages(this.khatm.khid, [page], page.isread);
    }
  }

  selectRange(page){
    if(this.startRange === null) {
      if(page.isread){
        this.startRange = null;
        this.commit(page);
      }
      else{
        page.isread = true;
        this.khatm.you_read = (page.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
        this.khatm.you_unread = (page.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
        this.khatm.read_pages = (page.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
        this.startRange = page;

        this.selectionCounter = (page.isread) ? this.selectionCounter + 1 : this.selectionCounter - 1;
      }
    }
    else if(this.endRange === null)
      this.endRange = page;

    if(this.startRange !== null && this.endRange !== null){
      //check the position of start/end range (change the position if needed)
      if(this.startRange.page_number > this.endRange.page_number){
        let tmp = this.startRange;
        this.startRange = this.endRange;
        this.endRange = tmp;
        this.endRange.isread = false;
        this.startRange.isread = true;
      }
      else if(this.startRange.page_number === this.endRange.page_number){
        if(this.startRange.repeat_number > this.endRange.repeat_number){
          let tmp = this.startRange;
          this.startRange = this.endRange;
          this.endRange = tmp;
          this.endRange.isread = false;
          this.startRange.isread = true;
        }
      }

      let anyIsRead = false;

      //Check pages status
      this.allCommitments.forEach(el => {
        if((el.page_number > this.startRange.page_number ||
          (el.page_number === this.startRange.page_number && el.repeat_number > this.startRange.repeat_number)) &&
          (el.page_number < this.endRange.page_number ||
          (el.page_number === this.endRange.page_number && el.repeat_number <= this.endRange.repeat_number)))
            anyIsRead = anyIsRead || el.isread;
      });

      if(anyIsRead){
        let tempStartRange = this.startRange;
        tempStartRange.isread = false;
        this.startRange = null;
        this.commit(tempStartRange);
        this.commit(this.endRange);
        this.endRange = null;
        return;
      }

      let pages = [];
      pages.push(this.startRange);

      this.allCommitments.forEach(el => {
        if((el.page_number > this.startRange.page_number ||
          (el.page_number === this.startRange.page_number && el.repeat_number > this.startRange.repeat_number)) &&
          (el.page_number < this.endRange.page_number ||
          (el.page_number === this.endRange.page_number && el.repeat_number <= this.endRange.repeat_number))){
          el.isread = !el.isread;
          this.khatm.you_read = (el.isread) ? parseInt(this.khatm.you_read) + 1 : parseInt(this.khatm.you_read) - 1;
          this.khatm.you_unread = (el.isread) ? parseInt(this.khatm.you_unread) - 1 : parseInt(this.khatm.you_unread) + 1;
          this.khatm.read_pages = (el.isread) ? parseInt(this.khatm.read_pages) + 1 : parseInt(this.khatm.read_pages) - 1;
          pages.push(el);

          this.selectionCounter = (page.isread) ? this.selectionCounter + 1 : this.selectionCounter - 1;
        }
      });

      let readPages = pages.filter(el => el.isread === true);
      let unreadPages = pages.filter(el => el.isread === false);

      this.khatmService.commitPages(this.khatm.khid, readPages, true)
        .then((res) => this.khatmService.commitPages(this.khatm.khid, unreadPages, false))
        .catch((err) => this.msgService.error(err));

      this.startRange = null;
      this.endRange = null;

      this.anyPagesCommitted = true;

      this.checkAllSelection();
    }
  }

  closeForm(){
    if(this.anyPagesCommitted){
      let confirmDialogRef = this.dialog.open(ConfirmationDialog, {
        height: '200px',
        width: '300px'
      });

      confirmDialogRef.afterClosed().subscribe(result => {
        if(result)
          this.dialogRef.close();
      });
    }
    else
      this.dialogRef.close();
  }

  allSelectionChange(){
    let currentReadStatus = false;

    if(this.allSelection)
      currentReadStatus = false;
    else
      currentReadStatus = true;

    let needChange = this.allCommitments.filter(el => el.isread === currentReadStatus);
    needChange.forEach(el => this.commit(el));
  }

  checkAllSelection(){
    let all_isread: boolean = true;

    this.allCommitments.forEach(el => all_isread = all_isread && el.isread);

    this.allSelection = all_isread
  }
}

@Component({
  selector: 'confirmation-dialog',
  template: `
    <div>
      <label>All changes will be irreversible after you exit. Do you sure to exit?</label>
      <md-grid-list cols="2" rowHeight="50px">
        <md-grid-tile>
          <button md-raised-button (click)="shouldExit(true)">YES</button>
        </md-grid-tile>
        <md-grid-tile>
          <button md-raised-button (click)="shouldExit(false)">NO</button>
        </md-grid-tile>
      </md-grid-list>
    </div>
  `
})
export class ConfirmationDialog {
  constructor(public dialogRef: MdDialogRef<ConfirmationDialog>){}

  shouldExit(value){
    this.dialogRef.close(value);
  }
}
