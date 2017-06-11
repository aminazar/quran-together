import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

import {HttpService} from "./http.service";

@Injectable()
export class AuthService {
  email: BehaviorSubject<string> = new BehaviorSubject(null);
  name: BehaviorSubject<string> = new BehaviorSubject(null);
  token: BehaviorSubject<string> = new BehaviorSubject(null);
  isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private httpService: HttpService) {
    this.email.subscribe(
      (data) => {
        if(data === null)
          this.isLoggedIn.next(false);
        else
          this.isLoggedIn.next(true);
      }
    );

    this.token.subscribe(
      (data) => {
        if(data === null)
          this.isLoggedIn.next(false);
        else
          this.isLoggedIn.next(true);
      }
    );

    //Load user data
    this.loadUserData();
  }

  saveUserData(userEmail, userName, userToken){
    this.saveEmail(userEmail);
    this.saveName(userName);
    this.saveToken(userToken);
  }

  loadUserData(){
    this.email.next(localStorage.getItem('email'));
    this.name.next(localStorage.getItem('name'));
    this.loadToken();
  }

  saveToken(userToken){
    this.token.next(userToken);
    localStorage.setItem('token', userToken);
  }

  saveEmail(userEmail){
    this.email.next(userEmail);
    localStorage.setItem('email', userEmail);
  }

  saveName(userName){
    this.name.next(userName);
    localStorage.setItem('name', userName);
  }

  loadToken(){
    this.token.next(localStorage.getItem('token'));
  }

  removeUser(){
    localStorage.removeItem('email');
    this.email.next(null);
    localStorage.removeItem('name');
    this.name.next(null);
    localStorage.removeItem('token');
    this.token.next(null);
  }

  logout(){
    this.removeUser();
    this.isLoggedIn.next(false);
  }

  register(userEmail, userName){
    return new Promise((resolve, reject) => {
      this.httpService.putData('user', {email: userEmail, name: userName}, false)
          .subscribe(
              (data) => {
                this.saveEmail(userEmail);
                this.saveName(userName);
                resolve();
              },
              (err) => {
            reject(err);
          }
      )
    });
  }

  verify(code){
    return new Promise((resolve, reject) => {
      this.httpService.postData('user/auth', {email: this.email.getValue(), code: code}, false)
          .subscribe(
              (data) => {
                let token = data.json().token;
                console.log(token.token);
                this.isLoggedIn.next(true);
                this.saveToken(token);
                this.httpService.deleteData('user/auth', true, this.email.getValue(), token)
                    .subscribe(
                        (res) => resolve(),
                        (er) => reject(er)
                    )
              },
              (err) => {
                reject(err);
              }
          );
    });
  }
}
