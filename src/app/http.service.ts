import { Injectable } from '@angular/core';
import {Response, Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class HttpService {
  serverAddress: string = 'api';

  constructor(private http: Http) { }

  postData(address, data) : Observable<Response>{
    return this.http.post(this.serverAddress + '/' + address, data);
  }

  putData(address, data) : Observable<Response> {
    return this.http.put(this.serverAddress + '/' + address, data);
  }

  getData(){

  }

  deleteData(address, data) : Observable<Response>{
    return this.http.delete(this.serverAddress + '/' + address);
  }
}
