import {NgModule} from '@angular/core';

import {OAuth} from './oauth';
import {Security} from './security';

@NgModule({
  imports: [
  ],
  providers: [
    Security,
    OAuth,
  ],
})
export class SecurityModule {

}