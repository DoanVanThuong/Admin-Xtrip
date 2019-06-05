import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { Spinner, NotificationService, TourRepo, Error, TicketIssueTour } from '../../../../common';
import { TYPE_TRANSFER } from '../../../../app.constants';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'tour-ticket',
    templateUrl: './tour-ticket.component.html',
})
export class TourTicketComponent extends AppList {

    tickets: TicketIssueTour[] = new Array<TicketIssueTour>();

    ticketIssueId: string = '';
    type: string = '';
    tourId:string = '';
    
    isOpenSideBar: boolean = false;

    headers: any = [];
    ticketDetail: any = {};

    constructor(
        private _tourRepo: TourRepo,
        private _spinner: Spinner,
        private _noti: NotificationService,
        private _state: GlobalState
    ) {
        super();
        this.request = this.getListTicket;

    }

    ngOnInit() {
        this.headers = [
            { title: '#', field: 'no', },
            { title: 'Mã đặt chỗ', field: 'code', sortable: true },
            { title: 'Mã vé', field: 'bookingCode', sortable: true },
            { title: 'Khách hàng', field: 'customerName' },
            { title: 'Mã tour', field: 'tourCode' },
            { title: 'Tên tour', field: 'tourName' },
            { title: 'Hành trình', field: 'tourDepart' },
            { title: 'Ngày book', field: 'bookingDate', sortable: true },
            { title: 'Đại lý', field: 'agency' },
            { title: 'Giá vé', field: 'totalPrice', sortable: true },
            { title: 'Book', field: 'actualStatus', sortable: true },
            { title: 'Tình trạng', field: 'isIssued', sortable: true },
            { title: 'Chức năng', field: 'action', },
        ]
        this.getListTicket();
    }

    //fn get list
    async getListTicket(sortField?: string, order?: boolean) {
        this._spinner.show();

        const body = {
            keyword: this.keyword,
            bookingDate: null,
            sortField: sortField,
            ascending: order
        }
        try {
            const response: any = await this._tourRepo.getListTicketIssue(this.page - 1, this.limit, body);

            if (response.code.toLowerCase() === 'success') {
                this.total = response.data.total || 0;
                this.tickets = response.data.data.map(ticket => new TicketIssueTour(ticket));
            }
            else {
                const errs = new Error(response.errors[0]);
                this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
            }
            this._spinner.hide();

        } catch (error) {
            this._spinner.hide();
            const errs = new Error(error);
            this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
        }
    }

    //fn button confirm
    onComfirmTicket(tour: TicketIssueTour) {
        this._noti.pushQuestion('Thông tin xuất vé', `Tôi muốn xuất vé cho  <strong>${tour.tourName}</strong>`, true, 'Xác thực', 'Hủy').then((value: any) => {
            if (value.value) {
                this.comfirmTicket(tour.id);
            }
        })
    }

    //fn comfirm ticket
    async comfirmTicket(id: string) {
        this._spinner.show();

        try {
            const response: any = await this._tourRepo.confimTicket(id);
            if (response.code === 'Success') {
                this._noti.pushAlert('Đã xác thực xuất vé', '', 'success');
                this.getListTicket();
            }
            else {
                const errs = new Error(response.errors[0]);
                this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
            }
            this._spinner.hide();

        } catch (error) {
            this._spinner.hide();
            const errs = new Error(error);
            this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
        }
    }


    async showDetailTicket(tour: TicketIssueTour) {
        this.tourId = tour.id;
        this._spinner.show();
        this._state.notifyDataChanged('tourInfo:id', tour.id);

        try {
            const response: any = await this._tourRepo.getDetailTicketIssue(tour.id);
            if (response.code.toLowerCase() === 'success') {
                this.ticketDetail = response.data;
                if (!this.isOpenSideBar) {
                    this.isOpenSideBar = true;
                    this.type = TYPE_TRANSFER.TOUR;
                }
            }
            this._spinner.hide();
        }
        catch (err) { }
    }
}
