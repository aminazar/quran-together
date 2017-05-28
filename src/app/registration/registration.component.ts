import { Component, OnInit } from '@angular/core';
import {QuranService} from "../quran.service";
import {AuthService} from "../auth.service";
import {MsgService} from "../msg.service";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  email: string = '';
  reEmail: string = '';
  name: string = '';
  showVerify: boolean = false;
  conditionalColoring: any = {
    background: 'normal_back',
    text: 'noraml_text',
    primary: 'normal_primary',
    secondary: 'normal_secondary'
  };
  loading: boolean = false;

  constructor(private quranService: QuranService, private authService: AuthService,
              private msgService: MsgService, public dialogRef: MdDialogRef<RegistrationComponent>) { }

  ngOnInit(){
    this.conditionalColoring.background = (this.quranService.nightMode) ? 'night_back' : 'normal_back';
    this.conditionalColoring.text = (this.quranService.nightMode) ? 'night_text' : 'normal_text';
    this.conditionalColoring.primary = (this.quranService.nightMode) ? 'night_primary' : 'normal_primary';
    this.conditionalColoring.secondary = (this.quranService.nightMode) ? 'night_secondary' : 'normal_secondary';

    this.quranService.nightMode$.subscribe(
        (data) => {
          if(data) {
            this.conditionalColoring.background = 'night_back';
            this.conditionalColoring.text = 'night_text';
            this.conditionalColoring.primary = 'night_primary';
            this.conditionalColoring.secondary = 'night_secondary';
          }
          else{
            this.conditionalColoring.background = 'normal_back';
            this.conditionalColoring.text = 'normal_text';
            this.conditionalColoring.primary = 'normal_primary';
            this.conditionalColoring.secondary = 'normal_secondary';
          }
        }
    );


    this.authService.email.subscribe(
        (email) => {
          if(email !== null && email !== undefined)
            this.showVerify = true;
          else
            this.showVerify = false;
        },
        (err) => {
          this.showVerify = false;
        }
    );
    this.authService.loadUserData();
  }

  register(){
    if(this.mailValidation(this.email)){
      if(this.email.toLowerCase() === this.reEmail.toLowerCase()){
        this.setLoading();

        //Register user
        this.authService.register(this.email, this.name)
            .then(() => {
              this.showVerify = true;
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              this.msgService.warn(err);
            })
      }
      else
        this.msgService.warn('The repeated email not match');
    }
    else
      this.msgService.warn('The email is not valid');
  }

  skip(){
    this.dialogRef.close();
  }

  mailValidation(mail){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

  reSend(){
    this.setLoading();
    this.authService.register(this.authService.email.getValue(), this.authService.name.getValue())
        .then((res) => {
          this.loading = false;
          this.msgService.message('The verifiction code sent to the ' + this.authService.email.getValue());
        })
        .catch((err) => {
          this.loading = false;
          this.msgService.warn(err);
        });
  }

  changeMail(){
    this.authService.removeUser();
    this.showVerify = false;
  }

  verify(code){
    if(!this.checkCode(code)){
      this.msgService.warn('The verification code should contain 6 digits');
    }
    else{
      this.authService.verify(code)
          .then(() => {
            this.showVerify = false;
            this.dialogRef.close();
          })
          .catch((err) => {
            this.msgService.warn(err);
          })
    }
  }

  checkCode(code){
    if(code.length > 6 || code.length < 6)
      return false;

    for(let i=0; i<code.length; i++){
      console.log(code.charCodeAt(i));
      if(code.charCodeAt(i) < 48 || code.charCodeAt(i) > 57)
        return false;
    }

    return true;
  }

  setLoading(){
    this.loading = true;
  }
}