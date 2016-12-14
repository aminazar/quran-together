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
  @Input() tanzillocation = '';
  private  suraAyaNumber : number=0;

  constructor(private quranService: QuranService) {
  }

  ngOnInit() {
    if( this.bismillahText === '' ) this.bismillahText = 'سوره التوبه';
    this.suraAyaNumber = this.quranService.suraAyaNumberCheck(this.suraname);
  }

}
