import { Component, ViewChild } from "@angular/core";
import { AppList } from "../../../app.list";
import { ExportFilePopupComponent } from "../../../components";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-ticket",
    templateUrl: "./admin-ticket.component.html"
})
export class TicketComponent extends AppList {

    selectedTab: string = 'flight';

    @ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;
    constructor(
        private _router: Router,
        private _activeRoute: ActivatedRoute
    ) {
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
        this._router.navigate(['admin/ticket'], {
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
