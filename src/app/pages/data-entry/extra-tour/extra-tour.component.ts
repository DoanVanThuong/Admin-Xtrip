import { Component } from '@angular/core';
import { AppList } from '../../../app.list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-extra-tour',
    templateUrl: './extra-tour.component.html',
})
export class ExtraTourComponent extends AppList{
    
    selectedTab: string = 'hot-tour';
    constructor(private _activedRoute: ActivatedRoute,
        private _router: Router) { 
        super();
    }

    ngOnInit(): void { 
        this._activedRoute.queryParams.subscribe((param: any) => {
            if(param.tab) {
                this.selectedTab = param.tab;
            }
        })
    }

    onSelect(e: Event,tab: string) {
        this.selectedTab = tab;
        this._router.navigate(['data-entry/extra-tour'],{queryParams: {
            tab: this.selectedTab
        }})
    }
}
