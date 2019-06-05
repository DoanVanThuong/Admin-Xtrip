import { Component} from '@angular/core';
import { AppList } from '../../../app.list';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reward-point',
    templateUrl: './reward-point.module.component.html',
})
export class RewardPointComponent extends AppList{
    selectedTab: string = 'flight';

    constructor(private _router: Router, private _activeRoute: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this._activeRoute.queryParams.subscribe((params) => {
            if (params.tab) {
                this.selectedTab = params.tab;
            }
        });
    }

    //fn select tab
    onSelect(e: any, tab: string) {
        this.selectedTab = tab;
        this._router.navigate(['admin/reward-point'], {
            queryParams: {
                tab: this.selectedTab
            }
        })
    }
}
