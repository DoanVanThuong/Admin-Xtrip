import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { Spinner, FlightRepo, NotificationService, Error } from '../../../../common';
import { TYPE_TRANSFER } from '../../../../app.constants';
import { GlobalState } from '../../../../global.state';
import { TicketIssueFlight } from '../../../../common/entities/flights/ticket-issue-flight';

@Component({
    selector: 'flight-ticket',
    templateUrl: './flight-ticket.component.html',
})
export class FlightTicketComponent extends AppList {
    headers: any[] = [];
    tickets: TicketIssueFlight[] = new Array<TicketIssueFlight>();

    ticketDetail: any = {};
    openSideBar: boolean = false;

    typeTransfer: TYPE_TRANSFER;
    ticketIssueId: string = '';

    constructor(
        private _spinner: Spinner,
        private _flightRepo: FlightRepo,
        private _noti: NotificationService,
        private _state: GlobalState

    ) {
        super();
        this.request = this.getTicketList
    }

    ngOnInit() {
        this.headers = [
            { title: '#', field: 'no', },
            { title: 'Mã đặt chỗ', field: 'code', sortable: true },
            { title: 'Mã vé', field: 'bookingCode', sortable: true },
            { title: 'Khách hàng', field: 'customerInfo.customerName', sortable: true },
            { title: 'Hành trình', field: 'journey', sortable: true },
            { title: 'Mã chuyến bay', field: 'flightNumber' },
            { title: 'Đại lý', field: 'agency', sortable: true },
            { title: 'Giá vé', field: 'totalPrice', sortable: true },
            { title: 'Ngày book', field: 'bookingDate', sortable: true },
            { title: 'Thời gian giữ vé', field: 'holdExpiry', sortable: true },
            { title: 'Book', field: 'actualStatus', sortable: true },
            { title: 'Tình trạng', field: 'isIssued', sortable: true },
            { title: 'Chức năng', field: 'action', },
        ]
        this.getTicketList();

    }

    //get list ticket
    async getTicketList(sortField?: string, order?: boolean) {
        this._spinner.show();
        const body = {
            keyword: this.keyword,
            bookingDate: null,
            sortField: sortField,
            ascending: order
        }
        try {
            const dataFormServe: any = await this._flightRepo.geTickets((this.page - 1) * this.pageSize, this.limit, body);
            this.total = dataFormServe.data.total || 0;

            this.tickets = (dataFormServe.data.data || []).map(item => {
                return new TicketIssueFlight(item);
            });

            this._spinner.hide();

        } catch (error) {
            this._spinner.hide();
            const errs = new Error(error);
            this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
        }
    }


    //fn button confirm
    onComfirmTicket(ticket: TicketIssueFlight) {
        this._noti.pushQuestion('Thông tin xuất vé', `Tôi muốn xuất vé cho  <strong>${ticket.customerName}</strong>`, true, 'Xác thực', 'Hủy').then((value: any) => {
            if (value.value) {
                this.comfirmTicket(ticket.id);
            }
        })
    }

    //fn comfirm ticket
    async comfirmTicket(id: string) {
        this._spinner.show();

        try {
            const dataFormServe: any = await this._flightRepo.confirmTicket(id);
            if (dataFormServe.code === 'Success') {
                this._noti.pushAlert('Đã xác thực xuất vé', '', 'success');
                this.getTicketList();
            }
            else {
                const errs = new Error(dataFormServe.errors[0]);
                this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
            }
            this._spinner.hide();

        } catch (error) {
            this._spinner.hide();
            const errs = new Error(error);
            this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
        }
    }

    //xem chi tiet flight
    async showDetailTicket(ticket: TicketIssueFlight) {

        this._state.notifyDataChanged('ticket-book-fail', ticket.actualStatus);
        this.ticketIssueId = ticket.id;

        try {
            const dataFormServe: any = await this._flightRepo.getDetailTicket(ticket.id);
            if (dataFormServe.code.toLowerCase() === 'success') {
                this.ticketDetail = dataFormServe.data.detail;
            }
            if (this.openSideBar == false) {
                this.openSideBar = true;
                this.typeTransfer = TYPE_TRANSFER.FLIGHT;
            }
        }
        catch (err) { }
    }

    //fn change PNR get new Ticket List Issue
    onChangePnr(value: any) {
        if (value.isChange === true) {
            this.getTicketList();
            this.showDetailTicket(value.ticket);
        }
    }
}
