import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { Spinner, NotificationService, Error, TicketIssuedHotel, HotelRepo } from '../../../../common';

@Component({
    selector: 'ticket-issued-hotel',
    templateUrl: './ticket-issued-hotel.component.html',
})
export class TicketIssuedHotelComponent extends AppList {

    tickets: TicketIssuedHotel[] = new Array<TicketIssuedHotel>();
    constructor(private _hotelRepo: HotelRepo,
        private _spinner: Spinner,
        private _noti: NotificationService
    ) {
        super();
        this.request = this.getListTickets;
    }

    ngOnInit(): void {
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
            const response: any = await this._hotelRepo.getExportedTickets((this.page - 1) * this.pageSize, this.limit, body);
            if (response.code.toLowerCase() === 'success') {
                this.total = response.data.total || 0;
                this.tickets = (response.data.data || []).map((item: any) => {
                    return new TicketIssuedHotel(item);
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
