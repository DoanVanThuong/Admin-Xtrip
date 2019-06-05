import { Component, ViewChild, ElementRef, HostListener } from "@angular/core";
import { Router, NavigationStart, NavigationEnd } from "@angular/router";

import { Spinner } from "./common/index";

import { GlobalState } from "./global.state";
import { Helpers } from "./helpers";
import { environment } from "../environments/environment";

@Component({
  selector: "my-app",
  template: `
	<router-outlet></router-outlet>
  `
})
export class App {
  constructor(
    protected _spinner: Spinner,
    protected _state: GlobalState,
    protected _router: Router
  ) {
    this._state.subscribe("security.loggedOut", () => {
      this._router.navigateByUrl("/signin");
    });
  }

  ngOnInit() {
    Helpers.bodyClass("fixed-navbar");
    this._router.events.subscribe(route => {
      if (route instanceof NavigationStart) {
        Helpers.setLoading(true);
      }
      if (route instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        Helpers.setLoading(false);

        // Initialize page: handlers ...
        Helpers.initPage();
      }
    });
  }
  ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    if (!this._spinner.queues.length) {
      setTimeout(() => {
        this._spinner.hide();
      }, 100);
    }

    this._router.events.subscribe(() => {
      $(window).scrollTop(0);
    });

    // $('body').on('mouseover', () => {
    //   if (environment.live) {
    //     console.clear();
    //   }
    // })
  }
}
