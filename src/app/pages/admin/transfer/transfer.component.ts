import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExportFilePopupComponent } from "../../../components";
import { AppBase } from "../../../app.base";
@Component({
	selector: "app-payment-list",
	templateUrl: "./transfer.component.html"
})

export class TransferComponent extends AppBase {

	@ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;
	constructor(private _activeRoute: ActivatedRoute, private _router: Router) {
		super();
	}

	selectedTab: string = 'flight';
	module: string = this.selectedTab + '-transfer';

	ngOnInit() {
		this._activeRoute.queryParams.subscribe((params) => {
			if (params.tab) {
				this.selectedTab = params.tab;
				this.module = this.selectedTab + '-transfer';
			}
		});
	}

	//fn select tab
	onSelect(e: any, tab: string) {
		this.selectedTab = tab;
		this._router.navigate(['admin/payment'], {
			queryParams: {
				tab: this.selectedTab
			}
		})
	}

	//fn open export file popup
	openExportFilePopup() {
		this.exportFilePopup.show({
			backdrop: 'static'
		})
	}
}


