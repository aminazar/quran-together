/**
 * Created by Ali on 5/28/2017.
 */
import {Injectable} from "@angular/core";

function _window(){
  return window;
}

@Injectable()
export class WindowRef{
  constructor(){}

  getWindow(){
    return _window();
  }
}