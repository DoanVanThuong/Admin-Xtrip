import { Component, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ExportFilePopupComponent } from "../../../components";
import { AppBase } from "../../../app.base";

@Component({
	selector: "app-customer",
	templateUrl: "./admin-customer.component.html",
})
export class CustomerComponent extends AppBase {

	@ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;

	selectedTab: string = 'flight';
	role: string = 'admin';

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
		this._router.navigate(['admin/customer'], {
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

