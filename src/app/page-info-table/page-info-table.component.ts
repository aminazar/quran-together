import { Component, OnInit, Input } from '@angular/core';
import { QuranService } from "../quran.service";

@Component({
  selector: 'app-page-info-table',
  templateUrl: './page-info-table.component.html',
  styleUrls: ['./page-info-table.component.css']
})
export class PageInfoTableComponent implements OnInit {
 // @Input() tanzillocation;
  @Input() suraname='';
  @Input() pagenumber = 0;
  @Input() layer = 0;
  @Input() suraorder = 0;



  constructor(private quranService: QuranService) {
  }

  ngOnInit() {

      this.quranService.contentChanged$
      .subscribe((layer)=> {
        if (layer === this.layer) {
          this.suraname +=' ';
          this.suraname.trim();
        }
      });

  }

}
