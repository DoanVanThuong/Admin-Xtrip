import { Component } from '@angular/core';
import { AppList } from '../../../app.list';
import { ActivatedRoute, Router } from '@angular/router';

export enum TYPE {
    DAY_TOUR = 'daytour',
    ACTIVITIES = 'activities'
}
@Component({
    selector: 'app-extra-activity',
    templateUrl: './extra-activity.component.html',
})

export class ExtraActivityComponent extends AppList {

    selectedTab: TYPE = TYPE.DAY_TOUR;

    constructor(private _activedRoute: ActivatedRoute,
        private _router: Router) {
        super();
    }

    ngOnInit(): void {
        this._activedRoute.queryParams.subscribe((param: any) => {
            if (param.tab) {
                this.selectedTab = param.tab;
            }
        })
    }

    onSelect(e: Event, tab: TYPE) {
        this.selectedTab = tab;
        this._router.navigate(['data-entry/extra-activity'], {
            queryParams: {
                tab: this.selectedTab
            }
        })
    }
}
