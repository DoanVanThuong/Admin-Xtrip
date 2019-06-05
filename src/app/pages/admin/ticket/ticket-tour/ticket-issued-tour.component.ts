import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { TicketIssuedTour, Spinner, NotificationService, TourRepo, Error } from '../../../../common';

@Component({
    selector: 'ticket-issued-tour',
    templateUrl: './ticket-issued-tour.component.html',
})
export class TicketIssuedTourComponent extends AppList {
    tickets: TicketIssuedTour[] = new Array<TicketIssuedTour>();

    constructor(
        private _spinner: Spinner,
        private _noti: NotificationService,
        private _tourRepo: TourRepo
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
            const response: any = await this._tourRepo.getExportedTickets((this.page - 1) * this.pageSize, this.limit, body);
            if (response.code.toLowerCase() === 'success') {
                this.total = response.data.total || 0;
                this.tickets = (response.data.data || []).map((item: any) => new TicketIssuedTour(item));
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
