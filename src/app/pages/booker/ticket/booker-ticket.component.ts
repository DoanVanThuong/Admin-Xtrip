import { Component, ViewChild } from "@angular/core";

import { AppList } from "../../../app.list";
import { ExportFilePopupComponent } from "../../../components";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
	selector: "booker-ticket",
	templateUrl: './booker-ticket.component.html'
})
export class BookerTicketComponent extends AppList {

	@ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;

	selectedTab: string = 'flight';

	constructor(
		private _activeRoute: ActivatedRoute,
		private _router: Router) {
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
		this._router.navigate(['booker/ticket'], {
			queryParams: {
				tab: this.selectedTab
			}
		})
	}

	//fn open popup export file
	openExportFilePopup() {
		this.exportFilePopup.show({
			backdrop: 'static'
		})
	}



}

