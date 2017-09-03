/**
 * Created by Ali on 5/28/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

function _window(){
  return window;
}

@Injectable()
export class WindowRef{
  showStoreRedirect: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(){
  }

  getWindow(){
    return _window();
  }
}
