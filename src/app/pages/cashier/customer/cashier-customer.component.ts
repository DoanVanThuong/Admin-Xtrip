import { Component, ViewChild } from "@angular/core";
import { AppList } from "../../../app.list";
import { ExportFilePopupComponent } from "../../../components";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-cashier-customer",
	templateUrl: "./cashier-customer.component.html"
})
export class CashierCustomerComponent extends AppList {
	@ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;
	selectedTab: string = 'flight';
	role: string = 'cashier';

	constructor(private _activedRoute: ActivatedRoute,
		private _router: Router) {
		super();

	}

	ngOnInit() {
		this._activedRoute.queryParams.subscribe((params) => {
			if (params.tab) {
				this.selectedTab = params.tab;
			}
		});
	}

	//fn onselect tab
	onSelect($event: any, tab: string) {
		this.selectedTab = tab;
		this._router.navigate(['cashier/customer'], {
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

