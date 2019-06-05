import { Component } from '@angular/core';
import { AppBase } from '../../../app.base';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-booking-tour',
    templateUrl: './booking-tour.component.html',
    styles: [
        `.booking-tab-tour{
            max-width:1200px;
        }`
    ]
})
export class BookingTourComponent extends AppBase {
    tab: string = 'general';
    params: any = {};
    constructor(private _activedRoute: ActivatedRoute,
        private _router: Router) {
        super();
    }

    ngOnInit(): void {
        this._activedRoute.queryParams.subscribe((params: any) => {
            this.params = params;
            if (params.tab) {
                this.tab = params.tab
            }
        });
    }

    //fn change tab
    changeTab(tabName: string) {
        this.tab = tabName;
    }

    selectTab(e: any, tab: string) {
        this.tab = tab;
        this._router.navigate(['booking/tour'], Object.assign({}, this.params, { tab: this.tab }));
    }

}
