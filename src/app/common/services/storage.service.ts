import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class StorageService {

  protected storage: any = null;

  constructor(protected _cookieService: CookieService) {

    if (typeof localStorage === 'object') {
      // Safari will throw a fit if we try to use localStorage.setItem in private browsing mode.
      try {
        localStorage.setItem('localStorageTest', '1');
        localStorage.removeItem('localStorageTest');
        this.storage = localStorage;
      } catch (e) {
        this.fakeStorage();
      }
    } else {
      this.fakeStorage();
    }
  }

  // fn config local storage fake
  protected fakeStorage() {

    this.storage = {};
    this.storage.getItem = (key) => {
      return this._cookieService.get(key);
    };
    this.storage.setItem = (key, data) => {
      return this._cookieService.put(key, data);
    };
    this.storage.removeItem = (key) => {
      return this._cookieService.remove(key);
    };
    this.storage.clear = () => {
      return this._cookieService.removeAll();
    };
  }

  // fn get item
  getItem(key: string, isJson: boolean = true) {

    if (isJson) {
      return this.string2Json(this.storage.getItem(key));
    }
    return this.storage.getItem(key);
  }

  // fn set item
  setItem(key: string, data: any, isJson: boolean = true) {

    if (isJson) {
      return this.storage.setItem(key, this.json2String(data));
    }

    return this.storage.setItem(key, data);
  }

  // fn destroy item
  removeItem(key: string) {
    return this.storage.removeItem(key);
  }

  // fn clear all storage
  clear(): void {
    return this.storage.clear();
  }

  //fn check data
  checkInLocalStorage(key: string) {
    const data = this.storage.getItem(key);
    if (data || !_.isNull(data)) {
      return true
    }
    return false;
  }

  // fn json to string
  json2String(object: any = Object()) {
    return JSON.stringify(object);
  }

  // fn string to json
  string2Json(string: any = '') {
    return JSON.parse(string);
  }
}
