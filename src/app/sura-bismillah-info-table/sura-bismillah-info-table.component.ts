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
  private imgAdress;
  private imgflag;

  constructor(private quranService: QuranService) {
  }

  ngOnInit() {
    this.suraAyaNumber = this.quranService.suraAyaNumberCheck(this.suraname,false).a;
    this.suraTanzilLocation = this.quranService.suraAyaNumberCheck(this.suraname,true).b;
    //this.imgAdress = (this.suraTanzilLocation > "Meccan" ? "../../assets/madani-Black-Normal.png" : "../../assets/makki-Black-Normal.png");
    this.imgflag = (this.suraTanzilLocation > "Meccan" ? false : true );
    this.suraTanzilLocation = (this.suraTanzilLocation > "Meccan" ? 'مدنی' : 'مکی' );
    this.suraArabicName = this.quranService.suraAyaNumberCheck(this.suraname,true).c;
  }
}



