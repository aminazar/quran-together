import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { QuranService } from "./quran.service";
import { StaticPageComponent } from './static-page/static-page.component';
import { NavComponent } from './nav/nav.component';
import { PagesComponent } from './pages/pages.component';
import { AyaNumberSignComponent } from './aya-number-sign/aya-number-sign.component';
import { NumberTranslatorComponent } from './number-translator/number-translator.component';
import { PageInfoTableComponent } from './page-info-table/page-info-table.component';
import { QhizbSajdaTooltipSignComponent } from './qhizb-sajda-tooltip-sign/qhizb-sajda-tooltip-sign.component';
import { SuraBismillahInfoTableComponent } from './sura-bismillah-info-table/sura-bismillah-info-table.component';
import { SuraNameListShowComponent } from './sura-name-list-show/sura-name-list-show.component';

@NgModule({
  declarations: [
    AppComponent,
    StaticPageComponent,
    NavComponent,
    PagesComponent,
    AyaNumberSignComponent,
    NumberTranslatorComponent,
    PageInfoTableComponent,
    QhizbSajdaTooltipSignComponent,
    SuraBismillahInfoTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [QuranService],
  bootstrap: [AppComponent]
})
export class AppModule { }
