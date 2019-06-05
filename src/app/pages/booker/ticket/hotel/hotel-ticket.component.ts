import { Component } from '@angular/core';
import { Spinner, HotelRepo, NotificationService, Error, TicketIssueHotel } from '../../../../common';
import { AppList } from '../../../../app.list';
import { TYPE_TRANSFER } from '../../../../app.constants';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'hotel-ticket',
    templateUrl: './hotel-ticket.component.html',
})
export class HotelTicketComponent extends AppList {

    tickets: TicketIssueHotel[] = new Array<TicketIssueHotel>();
    headers: any[] = [];

    ticketDetail: any = {};
    isOpenSideBar: boolean = false;
    type: string;

    ticketIssueId: string = '';

    constructor(private _spinner: Spinner,
        private _hotelRepo: HotelRepo,
        private _noti: NotificationService,
        private _state: GlobalState) {
        super();
        this.request = this.getTicketList;
    }

    ngOnInit(): void {
        this.headers = [
            { title: '#', field: 'no', },
            { title: 'Mã đặt chỗ', field: 'code', sortable: true },
            { title: 'Mã vé', field: 'bookingCode', sortable: true },
            { title: 'Khách hàng', field: 'customerName', sortable: false },
            { title: 'Khách sạn', field: 'hotelName' },
            { title: 'Phòng', field: 'roomName', },
            { title: 'Giá', field: 'totalPrice', sortable: true },
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
            const dataFormServe: any = await this._hotelRepo.getTicketLisst((this.page - 1) * this.pageSize, this.limit, body);
            this.total = dataFormServe.data.total || 0;

            this.tickets = (dataFormServe.data.data || []).map((item: any) => {
                return new TicketIssueHotel(item);
            });

        } catch (error) {
            const errs = new Error(error[0]);
            this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn button confirm
    onComfirmTicket(ticket: TicketIssueHotel) {
        this._noti.pushQuestion('Thông tin xuất vé', `Tôi muốn xuất vé cho  <strong>${ticket.customerName} - ${ticket.hotelName} - ${ticket.roomName}</strong>`, true, 'Xác thực', 'Hủy').then((value: any) => {
            if (value.value) {
                this.comfirmTicket(ticket.id);
            }
        })
    }

    //fn comfirm ticket
    async comfirmTicket(id: string) {
        this._spinner.show();
        try {
            await this._hotelRepo.confirmTicket(id);
            this._noti.pushAlert('Đã xác thực xuất vé', '', 'success');
            this.getTicketList();

        } catch (error) {
            const errs = new Error(error[0]);
            this._noti.pushToast(`${errs.value}`, '', 'error', 3000);
        }
        finally {
            this._spinner.hide();
        }
    }

    //get detail booking hotel
    async showDetailTicket(id: string = '') {
        this._spinner.show();
        this._state.notifyDataChanged('ticket-book-fail', id);
        this.ticketIssueId = id;
        try {
            const response: any = await this._hotelRepo.getDetailBookingHotel(id);
            this.ticketDetail = response.data.detail || {};

            if (this.isOpenSideBar == false) {
                this.isOpenSideBar = true;
                this.type = TYPE_TRANSFER.HOTEL;
            }
        } catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(
                `${errs.errorMessage}`,
                "vui lòng kiểm tra lại",
                "error",
                30000
            );
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn change PNR get new Ticket List Issue
    onChangePnr(value: any) {
        if (value.isChange === true) {
            this.getTicketList();
            this.showDetailTicket(value.id);
        }
    }
}
