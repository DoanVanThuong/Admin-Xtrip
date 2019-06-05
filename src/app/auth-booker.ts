import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";

import { GlobalState } from "./global.state";
import { Security, StorageService } from "./common/index";
import { CSECURITY } from "./app.constants";

@Injectable()
export class AuthBooker implements Resolve<any> {
    constructor(
        protected _state: GlobalState,
        protected _router: Router,
        protected _security: Security,
        protected _storage: StorageService

    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {


        return this._security
            .requestCurrentUser()
            .then(() => {
                if (this._security.isAuthenticated() && this._security.isBooker()) {
                } else {

                    this._storage.removeItem(CSECURITY.tokenName);
                    this._router.navigate(['sign-in']);
                }
            });
    }
}
