import { Component, OnInit, Input } from '@angular/core';
import { QuranService } from "../quran.service";

@Component({
  selector: 'app-sura-bismillah-info-table',
  templateUrl: './sura-bismillah-info-table.component.html',
  styleUrls: ['./sura-bismillah-info-table.component.css']
})
export class SuraBismillahInfoTableComponent implements OnInit {
  @Input() bismillahText = '';
  @Input() suraname = '';
  private  suraAyaNumber : number=0;
  private  suraTanzilLocation;
  private  suraArabicName;
  private imgflag;
  private nightMode=false;

  constructor(private quranService: QuranService) {
  }

  ngOnInit() {
    this.nightMode = this.quranService.nightMode;
    this.suraAyaNumber = this.quranService.suraAyaNumberCheck(this.suraname,false).a;
    this.suraTanzilLocation = this.quranService.suraAyaNumberCheck(this.suraname,true).b;
    this.imgflag = (this.suraTanzilLocation > "Meccan" ? false : true );
    this.suraTanzilLocation = (this.suraTanzilLocation > "Meccan" ? 'مدنی' : 'مکی' );
    this.suraArabicName = this.quranService.suraAyaNumberCheck(this.suraname,true).c;

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }
}



