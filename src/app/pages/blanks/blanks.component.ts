import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: '',
  template: `
      <div class="page-blank">
          <router-outlet></router-outlet>
      </div>
  `
})
export class Blanks {

  url: any = '';

  constructor(protected _router: Router) {

    // fn detect event when change route
    this._router.events.subscribe((event: any) => {
      if (event.constructor.name === "NavigationEnd") {
        this.url = event.url;
      }
    });
  }

  ngOnInit() {
  }
}
