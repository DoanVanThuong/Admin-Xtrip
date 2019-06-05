import { Component, Input, HostListener, ElementRef, EventEmitter, Output } from '@angular/core';
import { AppBase } from '../../../../app.base';

import * as moment from 'moment';
import { TicketDetail, Ticket, FlightRepo, NotificationService, Error, Spinner } from '../../../../common';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'sidebar-ticket-detail-flight',
    templateUrl: './ticket-detail-flight.component.html',
    styleUrls: ['./ticket-detail-flight.component.less']
})

export class SideBarTicketDetailFlightComponent extends AppBase {

    @Input() open = false;
    @Input() data: TicketDetail = new TicketDetail();
    @Input() ticketIssueId: string = '';
    @Output() onChangePNR: EventEmitter<any> = new EventEmitter<any>();

    isShowEditPnr: boolean = false;
    statusBooking: boolean = false;
    isShowFormEditPnr: boolean = false;

    selectedPnr: string = '';

    constructor(
        private _state: GlobalState,
        private _flightRepo: FlightRepo,
        private _noti: NotificationService,
        private _spinner: Spinner) {
        super();
    }

    ngOnInit() { }

    ngOnChanges() {
        if (_.isEmpty(this.data)) {
            this.open = false;
            this.isShowEditPnr = false;

        } else {
            this.open = true;
        }
        this.isShowEditPnr = !this.statusBooking;
        this.isShowFormEditPnr = false;
    }

    ngAfterViewInit() {
        this._state.subscribe('ticket-book-fail', (status: boolean) => {
            this.statusBooking = status;
        })
    }

    //fn detect ESC key to close sidebar
    @HostListener('document:keyup', ['$event']) onKeyDown(event) {
        if (event.keyCode === 27 || event.code === 'Escape') {
            if (this.open) {
                this.open = false;
            }
        }
    }

    hideDetail() {
        this.open = !this.open;
    }

    //fn format time arrival
    returnTimeArrival(date: string) {
        return moment(date.substring((date.indexOf("-") || 0) + 1, date.length).trim(), "MM/DD/YYYY hh:mm A").format("HH:mm DD/MM/YYYY");
    }

    //fn format time depart
    returnTimeDepart(date: string) {
        return moment(date.substring(0, date.indexOf("-") || 0).trim(), "MM/DD/YYYY hh:mm A").format("HH:mm DD/MM/YYYY");
    }

    //fn open edit PNR
    onEditPrn(ticket: Ticket) {
        this.isShowFormEditPnr = !this.isShowFormEditPnr;
    }

    onUpdatePnr(ticket: Ticket) {
        this._noti.pushQuestion('Sửa mã PNR', 'Bạn có chắc muốn sửa mã của vé này', true, 'Cập nhật', 'Hủy').then((value: any) => {
            if (value.value) {
                this.UpdatePnr(ticket);
            }
        })
    }

    //fn update PNR
    async UpdatePnr(ticket: Ticket) {
        this._spinner.show();

        const body = {
            id: this.ticketIssueId,
            segments: this.data.tickets.map((ticket: Ticket) => {
                return {
                    id: ticket.segmentId,
                    newCode: ticket.pnrCode,
                }
            })
        }
        try {
            const dataFormServe: any = await this._flightRepo.updatePNR(body);
            if (dataFormServe.code.toLowerCase() === 'success') {

                //emit to get new Data
                this.onChangePNR.emit({
                    isChange: true,
                    ticket: {
                        id: this.ticketIssueId
                    }
                });
                this.isShowFormEditPnr = !this.isShowFormEditPnr;

                this._noti.pushAlert('Thành công', 'Mã PNR đã được cập nhật', 'success', 3000);
            }
            else {
                const errs = new Error(dataFormServe.errors[0]);
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