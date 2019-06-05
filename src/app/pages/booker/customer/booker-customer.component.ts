import { Component, ViewChild } from "@angular/core";
import { AppList } from "../../../app.list";
import { ExportFilePopupComponent } from "../../../components";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-customer",
	templateUrl: "./booker-customer.component.html"
})
export class BookerCustomerComponent extends AppList {
	@ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;
	selectedTab: string = 'flight';
	role: string = 'Booker';

	constructor(private _activedRoute: ActivatedRoute,
		private _router: Router) {
		super();

	}

	ngOnInit() {
		this._activedRoute.params.subscribe(params => {
			if (params.tab) {
				this.selectedTab = params.tab;
			}
		})
	}

	//fn onselect tab
	onSelect($event: any, tab: string) {
		this.selectedTab = tab;
		this._router.navigate(['booker/customer'], {
			queryParams: {
				tab: this.selectedTab
			}
		})
	}

	//fn export file 
	openExportFilePopup() {
		this.exportFilePopup.show({
			backdrop: 'static'
		})
	}
}

