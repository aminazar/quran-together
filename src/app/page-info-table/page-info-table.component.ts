import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-info-table',
  templateUrl: './page-info-table.component.html',
  styleUrls: ['./page-info-table.component.css']
})
export class PageInfoTableComponent implements OnInit {
  @Input() tanzillocation;
  @Input() suraname;
  @Input() pagenumber;
  constructor() { }

  ngOnInit() {
  }

}
