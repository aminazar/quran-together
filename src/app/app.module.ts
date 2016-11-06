import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { QuranService } from "./quran.service";
import { StaticPageComponent } from './static-page/static-page.component';

@NgModule({
  declarations: [
    AppComponent,
    StaticPageComponent
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
