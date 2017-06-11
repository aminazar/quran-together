import { Component, OnInit, Input } from '@angular/core';
import { QuranService } from "../quran.service";

@Component({
  selector: 'app-page-info-table',
  templateUrl: './page-info-table.component.html',
  styleUrls: ['./page-info-table.component.css']
})
export class PageInfoTableComponent implements OnInit {
  @Input() suraname;
  @Input() suraorder;
  @Input() pagenumber = 0;
  @Input() layer = 0;
  private  pageJuzNumber: number=1;
  private  nightMode;
  private suraorderAr;
  private pageJuzNumberAr;
  private pagenumberAr;

  constructor(private quranService: QuranService) {
  }
  ngOnInit() {
      this.nightMode = this.quranService.nightMode;
      this.suraname='';
      this.quranService.contentChanged$
      .subscribe((layer)=> {
        this.pageJuzNumber = this.quranService.pageJuzCheck(this.pagenumber);

        if (layer === this.layer) {
          this.suraname +=' ';
          this.suraname.trim();
        }
        this.suraorderAr = this.suraorder?this.suraorder.toLocaleString('ar'):'';
        this.pageJuzNumberAr = this.pageJuzNumber?this.pageJuzNumber.toLocaleString('ar'):'';
        this.pagenumberAr = this.pagenumber?this.pagenumber.toLocaleString('ar'):'';
      });

    this.quranService.nightMode$
      .subscribe(
        (m)=>{
          this.nightMode=m;
        }
      );


  }

}


