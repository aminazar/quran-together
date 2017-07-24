import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

import {HttpService} from "./http.service";

@Injectable()
export class AuthService {
  isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject(false);
  user: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private httpService: HttpService) {
    this.user.subscribe(
      (data) => {
        if(data === null || data.email === null || data.token === null)
          this.isLoggedIn.next(false);
        else
          this.isLoggedIn.next(true);
      },
      (err) => this.isLoggedIn.next(false)
    );

    //Load user
    this.loadUser();
  }

  saveUser(userEmail, userName, userToken){
    let tempUser = {
      email: userEmail,
      name: userName,
      token: userToken
    };

    this.user.next(tempUser);
    localStorage.setItem('user', JSON.stringify(tempUser));
  }

  loadUser(){
    try {
      let tempUser = localStorage.getItem('user');
      this.user.next(JSON.parse(tempUser));
    }
    catch (err){
      console.log(err.message);
      this.user.next(null);
    }
  }

  saveToken(userToken){
    let tempUser = this.user.getValue();
    this.saveUser((tempUser === null) ? null :  tempUser.email,
                  (tempUser === null) ? null : tempUser.name,
                  userToken);
  }

  saveEmail(userEmail){
    let tempUser = this.user.getValue();
    this.saveUser(userEmail,
                  (tempUser === null) ? null : tempUser.name,
                  (tempUser === null) ? null : tempUser.token);
  }

  saveName(userName){
    let tempUser = this.user.getValue();
    this.saveUser(tempUser.email, userName, tempUser.token);
  }

  removeUser(){
    localStorage.removeItem('user');
    this.user.next(null);
  }

  logout(){
    this.removeUser();
    this.isLoggedIn.next(false);
  }

  register(userEmail, userName, isRegister){
    return new Promise((resolve, reject) => {
      if(!isRegister){
        this.httpService.postData('user/exist', {email: userEmail}, false).subscribe(
          (data) => {
            if(data.json().exist)
              this.register_signin(userEmail, userName)
                .then(res => resolve(res))
                .catch(err => reject(err));
            else
              reject('This email is not exist. Please register');
          },
          (err) => reject(err)
        );
      }
      else{
        this.httpService.postData('user/exist', {email: userEmail}, false).subscribe(
          (data) => {
            if(!data.json().exist)
              this.register_signin(userEmail, userName)
                .then(res => resolve(res))
                .catch(err => reject(err));
            else
              reject('This email is exist now. Please choose another email');
          },
          (err) => reject(err)
        );
      }
    });
  }

  private register_signin(userEmail, userName){
    return new Promise((resolve, reject) => {
      this.httpService.putData('user', {email: userEmail, name: userName}, false).subscribe(
        (data) => {
          try{
            this.saveUser(userEmail, userName, null);
            resolve();
          }
          catch(er) {
            reject(er);
          }
        },
        (err) => reject(err));
    });
  }

  verify(code){
    return new Promise((resolve, reject) => {
      this.httpService.postData('user/auth', {email: this.user.getValue().email, code: code}, false)
        .subscribe(
          (data) => {
            let token = data.json().token;
            this.isLoggedIn.next(true);
            this.saveToken(token);
            console.log('EMAIL:' + this.user.getValue().email);
            console.log('TOKEN:' + token);
            this.httpService.deleteData('user/auth', true, this.user.getValue().email, token)
              .subscribe(
                (res) => resolve(),
                (er) => reject(er)
              );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
}
