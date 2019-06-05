import { Component, ViewChild } from "@angular/core";
import { AppList } from "../../../../app.list";
import { FlightRepo, Spinner, NotificationService, Error, TicketIssuedFlight } from "../../../../common";
import { ExportFilePopupComponent } from "../../../../components";

@Component({
	selector: "ticket-issue-flight",
	templateUrl: "./ticket-issued-flight.component.html"
})
export class TicketIssuedFlightComponent extends AppList {

	tickets: TicketIssuedFlight[] = new Array<TicketIssuedFlight>();

	@ViewChild(ExportFilePopupComponent) exportFilePopup: ExportFilePopupComponent;
	constructor(private _flightRepo: FlightRepo,
		private _spinner: Spinner,
		private _noti: NotificationService
	) {
		super();
		this.request = this.getListTickets;

	}
	ngOnInit() {
		this.getListTickets();
	}

	//fn get list ticket was exported
	async getListTickets() {

		this._spinner.show();
		const body = {
			keyword: this.keyword,
			bookingDate: null
		}
		try {
			const response: any = await this._flightRepo.getExportedTickets((this.page - 1) * this.pageSize, this.limit, body);
			if (response.code.toLowerCase() === 'success') {
				this.total = response.data.total || 0;
				this.tickets = (response.data.data || []).map(item => {
					return new TicketIssuedFlight(item);
				});
			}
			else {
				const errs = new Error(response.errors[0]);
				this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
			}

			this._spinner.hide();
		} catch (error) {
			const errs = new Error(error);
			this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
			this._spinner.hide();
		}
	}


}
