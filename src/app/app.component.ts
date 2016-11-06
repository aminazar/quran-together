import {Component, OnInit, ViewChild} from '@angular/core';
import { QuranService } from "./quran.service";
import { Response } from "@angular/http";
import {StaticPageComponent} from "./static-page/static-page.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private ayas;
  private sura:number;
  private suraAyas;
  @ViewChild(StaticPageComponent) page:StaticPageComponent;
  constructor(private quranService:QuranService){}

  loadSura(){
    this.suraAyas = this.ayas.filter(a=>a.sura===+this.sura);
    this.page.contentChange();
  }

  ngOnInit():void {
    this.quranService.getQuran()
      .subscribe(
        data=>this.ayas=data,
        (err:Response)=>console.log("Error loding quran: ", err)
      )
  }

  title = 'app works!';

}
