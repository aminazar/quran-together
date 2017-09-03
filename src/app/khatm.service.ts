import { Injectable } from '@angular/core';

import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";
import {BehaviorSubject} from "rxjs";
import * as moment from 'moment-timezone';

@Injectable()
export class KhatmService {
  khatms: BehaviorSubject<any> = new BehaviorSubject([]);
  activeKhatm: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private httpService: HttpService, private authService: AuthService) { }

  createKhatm(data){
    return new Promise((resolve, reject) => {
      this.httpService.putData('khatm', data, true, this.authService.user.getValue().email, this.authService.user.getValue().token)
        .subscribe(
          (data) => {
            this.loadKhatm(this.authService.user.getValue().email);
            resolve();
          },
          (err) => {
            reject(err);
          }
        )
    });
  }

  loadKhatm(userEmail){
    this.httpService.getData('khatm', true, this.authService.user.getValue().email, this.authService.user.getValue().token)
      .subscribe(
        (res) => {
          let data = res.json();
          let tempList = [];

          let mDate = moment(new Date());

          for(let item of data){
            if (moment(item.end_date).diff(mDate, 'days') >= 0)
              tempList.push(item);
          }
          this.khatms.next(tempList);
        },
        (err) => {
          this.khatms.next([]);
        }
    )
  }

  getKhatmByLink(khatm_link){
    return new Promise((resolve, reject) => {
      this.httpService.getData('khatm/link/' + khatm_link, true, this.authService.user.getValue().email, this.authService.user.getValue().token).subscribe(
        (res) => {
          let data = res.json();
          let mDate = moment(new Date());

          if (moment(data[0].end_date).diff(mDate, 'days') >= 0)
            resolve(data[0]);
          else
            reject('expired');
        },
        (err) => {
          reject(err);
        }
      )
    })
  }

  getCommitments(khatm_id) {
    return new Promise((resolve, reject) => {
      this.httpService.getData('khatm/commitment/' + khatm_id, true, this.authService.user.getValue().email, this.authService.user.getValue().token)
        .subscribe(
          (res) => {
            let data = res.json();
            resolve(data);
            // let promiseList = [];
            // data.forEach(el => promiseList.push(this.commitmentsReconciliation(el.khid, el.pages)));

            // Promise.all(promiseList)
            //   .then((res) => resolve())
            //   .catch((err) => reject(err));
          },
          (err) => {
            reject(err);
          }
        )
    });
  }

  getPages(number, khatm_id, type) {
    return new Promise((resolve, reject) => {
      this.httpService.postData('khatm/commitment/auto', {khid: khatm_id, pages: number}, true,
                                  this.authService.user.getValue().email, this.authService.user.getValue().token)
        .subscribe(
          (res) => {
            let data = res.json();

            if (data === null)
              resolve(null);
            else {
              let numberOfFinal = (type === 'delete') ? number : data.length;
              resolve(numberOfFinal);
            }
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  updateKhatmCommtiments(khatm_id, page_numbers) {
    return new Promise((resolve, reject) => {
      try{
        let khatms: any = (localStorage.getItem('khatms') === null) ? null : JSON.parse(localStorage.getItem('khatms'));
        let data = khatms.find(el => el.khid === khatm_id);
        data.you_unread = page_numbers;
        localStorage.setItem('khatms', JSON.stringify(khatms));
        resolve();
      }
      catch (err){
        reject(err);
      }
    });
  }

  start_stop_Khatm(khatm) {
    if (khatm.you_read === null || khatm.you_unread === null)
      this.activeKhatm.next(null);
    else if (this.activeKhatm.getValue() === null || this.activeKhatm.getValue().khid !== khatm.khid) {
      let actKhatm = Object.assign({}, khatm);
      try{
        let value = this.getCommitments(khatm.khid);
        if (value === null)
          actKhatm.pages = value;
        this.activeKhatm.next(actKhatm);
      }
      catch(err) {
        this.activeKhatm.next(null);
      }
    }
    else if (this.activeKhatm.getValue().khid === khatm.khid) {
      this.activeKhatm.next(null);
    }
  }

  commitPages(khatm_id, pages, is_read) {
    return new Promise((resolve, reject) => {
      let cids = pages.map(el => el.cid);

      if (pages === null || pages === undefined || pages.length === 0)
        resolve();
      else {
        this.httpService.postData('khatm/commitment/commit', {cids: cids, isread: is_read}, true,
          this.authService.user.getValue().email, this.authService.user.getValue().token)
          .subscribe(
            (data) => resolve(),
            (err) => {
              reject(err);
            }
          )
      }
    })
  }
}
