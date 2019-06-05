import { Component } from '@angular/core';
import { StorageService } from '../../../../common';
import { AppBase } from '../../../../app.base';

import { ALL_TAB_CREATE_TOUR, CSTORAGE} from '../../../../app.constants';
import { Router, NavigationStart } from '../../../../../../node_modules/@angular/router';
@Component({
    selector: 'create-tour',
    templateUrl: './create-tour.component.html',
    styleUrls: ['./create-tour.less']
})

export class CreateTourComponent extends AppBase {
    tab: string = '';
    url: string = '';

    constructor(private _storage: StorageService, private _router: Router) {
        super();
        this._router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.url = event.url;
            }
        });
    }

    ngOnInit() {
        //đi thẳng tới tab hiện tại
        this.tab = ALL_TAB_CREATE_TOUR.GENERAL;
        this._storage.removeItem(CSTORAGE.TOUR_GENERAL)
    }

    //fn change tab
    changeTab(tabName: string) {
        this.tab = tabName;
    }

    //fn select tab
    selectTab(tabName: string) {
        this.tab = tabName;
    }
}