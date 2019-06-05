import {Injectable} from '@angular/core';
import {FacebookService, LoginResponse, InitParams, LoginOptions} from 'ngx-facebook';

import {AuthService} from 'ng2-ui-auth';

import {environment} from '../../../environments/environment';
import {Script} from "../services/script.service";

@Injectable()
export class OAuth {
  constructor(script: Script, protected _fb: FacebookService, protected _auth: AuthService,) {
    script.load('fbSdk').then(() => {
      let initParams: InitParams = {
        appId: environment.FACEBOOK.APP_ID,
        version: environment.FACEBOOK.APP_VERSION,
        xfbml: true,
      };
      _fb.init(initParams);
    }).catch(error => console.log(error));


  }

  fbLogin() {
    return new Promise((resolve, reject) => {
      let option: LoginOptions = {
        scope: 'email',
      };
      this._fb.login(option)
        .then((response: LoginResponse) => resolve(response.authResponse.accessToken))
        .catch((errors: any) => reject(errors));
    });
  }

  authenticate(provider) {
    this._auth.authenticate(provider)
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
