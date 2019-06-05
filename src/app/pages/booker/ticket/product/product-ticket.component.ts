import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { ProductRepo, Spinner, NotificationService, Error, TicketIssueProduct, ProductBookingDetail } from '../../../../common';
import { GlobalState } from '../../../../global.state';
import { TYPE_TRANSFER } from '../../../../app.constants';

@Component({
    selector: 'product-ticket',
    templateUrl: './product-ticket.component.html',
})
export class ProductTicketComponent extends AppList {

    tickets: TicketIssueProduct[] = new Array<TicketIssueProduct>();

    ticketIssueId: string = '';
    type: string = '';

    isOpenSideBar: boolean = false;

    headers: any = [];
    ticketDetail: any = {};

    constructor(private _productRepo: ProductRepo,
        private _spinner: Spinner,
        private _noti: NotificationService,
        private _state: GlobalState) {
        super();
        this.request = this.getListTicket;

    }

    ngOnInit() {
        this.headers = [
            { title: '#', field: 'no', },
            { title: 'Mã đặt chỗ', field: 'code', sortable: true },
            { title: 'Mã vé', field: 'bookingCode', sortable: true },
            { title: 'Khách hàng', field: 'customerName', sortable: false },
            { title: 'Tên SP', field: 'productName', sortable: true },
            { title: 'Giá vé', field: 'totalPrice', sortable: true },
            { title: 'Ngày book', field: 'bookingDate', sortable: true },
            { title: 'Thời gian giữ vé', field: 'holdExpiry', sortable: true },
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
            const response: any = await this._productRepo.getTicketLisst(this.page - 1, this.limit, body);

            if (response.code.toLowerCase() === 'success') {
                this.total = response.data.total || 0;
                this.tickets = response.data.data;
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
    onComfirmTicket(ticket: TicketIssueProduct) {
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
            const response: any = await this._productRepo.confirmTicket(id);
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


    async showDetailTicket(ticket: TicketIssueProduct) {

        this._state.notifyDataChanged('ticket-book-fail', ticket.actualStatus);
        this.ticketIssueId = ticket.id;

        try {
            const response: any = await this._productRepo.getDetailTicket(ticket.id);
            if (response.code.toLowerCase() === 'success') {
                this.ticketDetail = new ProductBookingDetail(response.data);
                if (!this.isOpenSideBar) {
                    this.isOpenSideBar = true;
                    this.type = TYPE_TRANSFER.PRODUCT;
                }
            }
            this._spinner.hide();
        }
        catch (err) { }
    }


}
