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
  private pageNum:number;
  private suraAyas;
  @ViewChild(StaticPageComponent) page:StaticPageComponent;
  constructor(private quranService:QuranService){}

  loadSura(){
    var page = this.quranService.getPage(this.pageNum);
    var startIndex = this.ayas.findIndex(a=>a.sura===page.start.sura && a.aya===page.start.aya);
    var endIndex   = this.ayas.findIndex(a=>a.sura===page.end.sura && a.aya===page.end.aya);
    if(page.start.aya===1&&page.start.sura!==1){
      startIndex--;
    }
    this.suraAyas = this.ayas.slice(startIndex,endIndex-1);
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
