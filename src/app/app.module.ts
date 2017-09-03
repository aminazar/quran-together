import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MdButtonModule,
    MdDialogModule,
    MdInputModule,
    MdGridListModule,
    MdSnackBarModule,
    MdSidenavModule,
    MdSelectModule,
    MdIconModule, MdRadioModule, MdCheckboxModule, MdListModule
} from "@angular/material";
import 'hammerjs';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import {RouterModule} from "@angular/router";

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
import { RegistrationComponent } from './registration/registration.component';
import {AuthService} from "./auth.service";
import {HttpService} from "./http.service";
import {MsgService} from "./msg.service";
import {StylingService} from "./styling.service";
import {WindowRef} from "./windowRef";
import {ChangeCommitmentDialog, KhatmComponent, NotJoinDialog, NotLoggedInDialog} from './khatm/khatm.component';
import {KhatmService} from "./khatm.service";
import {CommitmentComponent, ConfirmationDialog} from './commitment/commitment.component';
import { RouteComponent } from './route/route.component';
import {ClipboardService} from "ng2-clipboard";
import { StoresComponent } from './stores/stores.component';

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
    RegistrationComponent,
    KhatmComponent,
    CommitmentComponent,
    RouteComponent,
    ConfirmationDialog,
    NotLoggedInDialog,
    ChangeCommitmentDialog,
    NotJoinDialog,
    StoresComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdDialogModule,
    MdInputModule,
    MdGridListModule,
    MdSnackBarModule,
    MdSidenavModule,
    MdSelectModule,
    MdRadioModule,
    MdCheckboxModule,
    MdListModule,
    MdIconModule,
    BrowserAnimationsModule,
    Ng2DeviceDetectorModule.forRoot(),
    RouterModule.forRoot([
      {path: '', component: PagesComponent, pathMatch: 'full'},
      {path: 'khatm/:khlink', component: RouteComponent},
      {path: 'download', component: StoresComponent},
    ]),
  ],
  providers: [
    QuranService,
    AuthService,
    HttpService,
    MsgService,
    StylingService,
    WindowRef,
    KhatmService,
    ClipboardService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [RegistrationComponent, KhatmComponent, CommitmentComponent, ConfirmationDialog, NotLoggedInDialog, ChangeCommitmentDialog, NotJoinDialog]
})
export class AppModule { }
