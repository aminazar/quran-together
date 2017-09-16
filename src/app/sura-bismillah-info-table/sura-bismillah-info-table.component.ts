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
  @Input() suraNumber;
  suraAyaNumber : number=0;
  suraTanzilLocation;
  suraArabicName;
  imgflag;
  nightMode=false;

  constructor(private quranService: QuranService) {
  }

  ngOnInit() {
    this.nightMode = this.quranService.nightMode;
    let suraStats = this.quranService.suraStats(this.suraNumber);
    this.suraAyaNumber = suraStats.ayas;
    this.suraTanzilLocation = suraStats.tanzilLocation;
    this.imgflag = this.suraTanzilLocation === "Meccan";
    this.suraTanzilLocation = this.suraTanzilLocation !== "Meccan" ? 'مدنية' : 'مکية';
    this.suraArabicName = suraStats.name;

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }
}



