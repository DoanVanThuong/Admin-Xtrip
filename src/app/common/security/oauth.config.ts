/**
 * References:
 * - https://github.com/ronzeidman/ng2-ui-auth
 * - https://github.com/pcdummy/ng2-ui-auth-example
 * - https://ng2-satellizer.pc-dummy.net/login
 */
import {CustomConfig} from 'ng2-ui-auth';

import {environment} from "../../../environments/environment";

export class OAuthConfig extends CustomConfig {
  defaultHeaders = {'Content-Type': 'application/json'};
  providers = {
    facebook: {
      url: `${environment.API_URL}api/auth/facebook`,
      clientId: environment.FACEBOOK.APP_ID,
      redirectUri: window.location.protocol + '//' + window.location.host + '/youvit/service/public',
    },
    google: {
      url: '/api/auth/v1/a/google',
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      redirectUri: '',
    },
    github: {
      url: '/api/auth/v1/a/github',
      clientId: 'YOUR_GITHUB_CLIENT_ID',
      redirectUri: '',
    },
    twitter: {
      url: '/api/auth/v1/a/twitter',
      redirectUri: '',
    }
  };
}
