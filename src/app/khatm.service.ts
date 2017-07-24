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
            console.log(err);
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
          console.log(data);
          let tempList = [];

          let mDate = moment(new Date());

          for(let item of data){
            if (moment(item.end_date).diff(mDate, 'days') >= 0)
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
            console.log(err.message);
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
            resolve();
            // let data = res.json();
            // if (data === null)
            //   resolve();
            // else {
              //Save/Update page numbers
              // this.storeKhatmPages(khatm_id, data, type);
              // this.updateKhatmCommtiments(khatm_id, number);
            //   resolve();
            // }
          },
          (err) => {
            console.log(err.message);
            reject(err);
          }
        );
    });
  }

  // storeKhatms(khatms) {
  //   localStorage.setItem('khatms', JSON.stringify(khatms));
  // }

  // getKhatms(): any {
  //   return (localStorage.getItem('khatms') === null) ? null : JSON.parse(localStorage.getItem('khatms'));
  // }

  // storeKhatmPages(khatm_id, pages, action) {
  //   let value: any  = (localStorage.getItem('khatm_' + khatm_id) === null) ? null : JSON.parse(localStorage.getItem('khatm_' + khatm_id));
  //   if (value != null) {
  //     if (action === 'add') {
  //       value = value.concat(pages);
  //     }
  //     else if (action === 'delete') {
  //       let pNumbers = pages.map(el => el.page_number);
  //       value = value.filter(el => pNumbers.findIndex(i => i === el.page_number) === -1);
  //     }
  //     else if (action === 'update') {
  //       let pNumbers = pages.map(el => el.page_number);
  //       value = value.filter(el => pNumbers.findIndex(i => i === el.page_number) === -1);
  //       value = value.concat(pages);
  //     }
  //   }
  //   else {
  //     value = pages;
  //   }
  //
  //   if (value.length === 0)
  //     localStorage.removeItem('khatm_' + khatm_id);
  //   else
  //     localStorage.setItem('khatm_' + khatm_id, JSON.stringify(value));
  // }

  updateKhatmCommtiments(khatm_id, page_numbers) {
    return new Promise((resolve, reject) => {
      try{
        let khatms: any = (localStorage.getItem('khatms') === null) ? null : JSON.parse(localStorage.getItem('khatms'));
        let data = khatms.find(el => el.khid === khatm_id);
        console.log(data);
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
        console.log(err);
        this.activeKhatm.next(null);
      }
    }
    else if (this.activeKhatm.getValue().khid === khatm.khid) {
      this.activeKhatm.next(null);
      // console.log('Active khatm is: ', this.activeKhatm.getValue());
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
              console.log(err);
              reject(err);
            }
          )
      }
    })
  }

  // clearStorage() {
  //   if (this.khatms.getValue() !== null) {
  //     let khids = this.khatms.getValue().map(el => el.khid);
  //     for (let id of khids) {
  //       localStorage.removeItem('khatm_' + id);
  //     }
  //   }
  //   localStorage.removeItem('khatms');
  //   this.khatms.next(null);
  //   this.activeKhatm.next(null);
  // }

  // commitmentsReconciliation(khatm_id, pages) {
  //   let values: any = (localStorage.getItem('khatm_' + khatm_id) === null) ? null : JSON.parse(localStorage.getItem('khatm_' + khatm_id));
  //   let updateServer_List = [];
  //   let updateLocal_List = [];
  //
  //   if (values === null) {
  //     pages.forEach(el => {
  //       updateLocal_List.push({type: 'add', page: el});
  //     })
  //   }
  //   else if (values.length > pages.length) {
  //     for (let index = 0; index < pages.length; index++) {
  //       if (values.findIndex(el => el.cid === pages[index].cid) === -1) {
  //         updateLocal_List.push({type: 'add', page: pages[index]});
  //       }
  //       else if (values.find(el => el.cid === pages[index].cid).isread !== pages[index].isread) {
  //         updateLocal_List.push({type: 'update', page: pages[index]});
  //       }
  //     }
  //
  //     values.forEach(el => {
  //       if (pages.find(i => i.cid === el.cid) === undefined) {
  //         updateServer_List.push({type: 'add', page: el});
  //       }
  //     })
  //   }
  //   else {
  //     for (let index = 0; index < values.length; index++) {
  //       if (pages.findIndex(el => el.cid === values[index].cid) === -1) {
  //         updateServer_List.push({type: 'add', page: values[index]});
  //       }
  //       else if (pages.find(el => el.cid === values[index].cid).isread !== values[index].isread) {
  //         updateServer_List.push({type: 'update', page: values[index]});
  //       }
  //     }
  //
  //     pages.forEach(el => {
  //       if (values.find(i => i.cid === el.cid) === undefined) {
  //         updateLocal_List.push({type: 'add', page: el});
  //       }
  //     })
  //   }
  //
  //   //Update server
  //   let readPages = updateServer_List.filter(el => el.page.isread === true).map(el => el.page);
  //   let unreadPages = updateServer_List.filter(el => el.page.isread === false).map(el => el.page);
  //   if (readPages.length > 0)
  //     this.commitPages(khatm_id, readPages, true);
  //   if (unreadPages.length > 0)
  //     this.commitPages(khatm_id, unreadPages, false);
  //
  //   //Update local
  //   let addPages = updateLocal_List.filter(el => el.type === 'add').map(el => el.page);
  //   let updatePages = updateLocal_List.filter(el => el.type === 'update').map(el => el.page);
  //
  //   if (addPages.length > 0)
  //     this.storeKhatmPages(khatm_id, addPages, 'add');
  //   if (updatePages.length > 0)
  //     this.storeKhatmPages(khatm_id, updatePages, 'update');
  // }
}
