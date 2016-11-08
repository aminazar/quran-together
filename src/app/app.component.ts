import { Component, OnInit, ViewChild } from '@angular/core';
import { QuranService } from "./quran.service";
import { Response } from "@angular/http";
import { StaticPageComponent } from "./static-page/static-page.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  ngOnInit():void {
  }

}
