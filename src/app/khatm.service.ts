import { Injectable } from '@angular/core';

import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";
import {MsgService} from "./msg.service";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class KhatmService {
  khatms: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private httpService: HttpService, private authService: AuthService) { }

  createKhatm(data){
    return new Promise((resolve, reject) => {
      this.httpService.putData('khatm', data, true, this.authService.email.getValue(), this.authService.token.getValue())
        .subscribe(
          (data) => {
            this.loadKhatm(this.authService.email.getValue());
            resolve();
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        )
    });
  }

  loadKhatm(userEmail){
    this.httpService.getData('khatm', true, this.authService.email.getValue(), this.authService.token.getValue())
      .subscribe(
        (res) => {
          let data = res.json();
          let tempList = [];
          for(let item of data){
            tempList.push(item);
          }
          this.khatms.next(tempList);
        },
        (err) => {
          console.log(err.message);
          this.khatms.next([]);
        }
    )
  }
}
