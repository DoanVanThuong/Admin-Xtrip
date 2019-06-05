import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportFilePopupComponent } from '../../../components';
import { AppBase } from '../../../app.base';

@Component({
    selector: 'cs-customer',
    templateUrl: './customer.component.html',
})

export class CSCustomerComponent extends AppBase {

    @ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;
    selectedTab: string = 'flight';

    role: string = 'cs';
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
        this._router.navigate(['cs/customer'], {
            queryParams: {
                tab: this.selectedTab
            }
        })
    }

    //fn open file export
    openExportFilePopup() {
        this.exportFilePopup.show({
            backdrop: 'static'
        });
    }

}