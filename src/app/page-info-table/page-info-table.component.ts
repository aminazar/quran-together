import { Component, OnInit, Input } from '@angular/core';
import { QuranService } from "../quran.service";

@Component({
  selector: 'app-page-info-table',
  templateUrl: './page-info-table.component.html',
  styleUrls: ['./page-info-table.component.css']
})
export class PageInfoTableComponent implements OnInit {
  @Input() suraname;
  @Input() pagenumber = 0;
  @Input() layer = 0;
  private  suraorder : any=0 ;
  private  pageJuzNumber: number=0;
  private  nightMode;

  constructor(private quranService: QuranService) {
  }
  ngOnInit() {
    this.nightMode = this.quranService.nightMode;
    this.suraname='';
    this.quranService.contentChanged$
      .subscribe((layer)=> {
        this.suraorder = this.suraname?this.quranService.suraNumberCheck(this.suraname):'';
        this.pageJuzNumber = this.quranService.pageJuzCheck(this.pagenumber);

        if (layer === this.layer) {
          this.suraname +=' ';
          this.suraname.trim();
        }
      });

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );
  }

}


