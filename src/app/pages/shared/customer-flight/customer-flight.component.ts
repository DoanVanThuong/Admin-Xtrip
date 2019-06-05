import { Component, Input } from '@angular/core';
import { AppList } from '../../../app.list';
import { FlightBooking, FlightRepo, NotificationService, Spinner, Error } from '../../../common';
import { TYPE_TRANSFER } from '../../../app.constants';
import { Router } from '@angular/router';

@Component({
    selector: 'customer-flight',
    templateUrl: './customer-flight.component.html',
})
export class CustomerFlightComponent extends AppList {
    @Input() role: string = null;

    flightBooking: FlightBooking[] = new Array<FlightBooking>();

    DetailFlightBooking: any = {};
    typeBooking: TYPE_TRANSFER;
    openSideBar: boolean = false;

    isExpiredDate: boolean = false;
    selectedFlight: FlightBooking;

    constructor(private _flightRepo: FlightRepo,
        private _noti: NotificationService,
        private _spinner: Spinner,
        private _router: Router) {
        super();
        this.request = this.getCustomerBookingReportFlight;
    }

    ngOnInit() {
        this.getCustomerBookingReportFlight();
    }

    ngOnChanges() {
        if (!!this.role) {
            switch (this.role.toLowerCase()) {
                case 'admin': {
                    this.isAdmin = true;
                    break;
                }
                case 'booker': {
                    this.isBooker = true;
                    break;
                }
                case 'cashier': {
                    this.isCashier = true;
                    break;
                }
                default: {
                    [this.isAdmin, this.isCS, this.isBooker, this.isCashier] = [false, false, false, false];
                    break;
                }
            }
        }
    }

    //get Booking Flight 
    async getCustomerBookingReportFlight() {
        this._spinner.show();
        const body = {
            Keyword: this.keyword,
            BookingDate: null
        }
        try {
            const dataFormServe: any = await this._flightRepo.getBookingFlight((this.page - 1) * this.pageSize, this.limit, body);
            this.total = dataFormServe.data.total || 0;

            this.flightBooking = (dataFormServe.data.data || []).map(item => {
                const flight: FlightBooking = new FlightBooking(item);
                return flight;
            });
            this._spinner.hide();

        } catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
            this._spinner.hide();
        }
    }

    //fn xem chi tiết 
    async showDetailFlightBooking(flight: FlightBooking) {
        this._spinner.show();
        this.selectedFlight = flight;
        try {
            const response: any = await this._flightRepo.getBookingDetailFlight(flight.id);
            this.DetailFlightBooking = response.data.detail || {};

            if (this.openSideBar == false) {
                this.openSideBar = true;
                this.typeBooking = TYPE_TRANSFER.FLIGHT;
                this._spinner.hide();
            }
        }
        catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
            this._spinner.hide();
        }
    }

    //if expiryDate	do something
    runOutOfTime() {
        this.isExpiredDate = true;
    }

    //fn xác thực thanh toán
    conFirmFlight(flight: FlightBooking) {	//custom alert box
        this._noti.pushQuestion('Thông tin xác thực', 'Xác thực thanh toán', true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();

                try {
                    const response: any = await this._flightRepo.confirmPaid(flight.id);
                    this._spinner.hide();

                    if (response.code === 'Success') {
                        this._noti.pushAlert('OK', 'Xác thực thánh toán thành công', 'success', 2000);
                        this.getCustomerBookingReportFlight();
                    }
                    this._spinner.hide();
                }
                catch (err) {
                    const errs = new Error(err);
                    this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
                    this._spinner.hide();
                }
                //end catch
            }
        });

    }

    //fn hủy booking của flight
    cancelFlight(flight: FlightBooking) {	//custom alert box
        this._noti.pushQuestion('Thông tin hủy vé', 'tôi muốn hủy vé này', true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();

                try {
                    const response: any = await this._flightRepo.cancelBookingFlight(flight.id);
                    this._spinner.hide();

                    if (response.code === 'Success') {
                        this._noti.pushAlert('OK', 'đã hủy vé thành công', 'success', 2000);
                        this.getCustomerBookingReportFlight();
                    }
                    else {
                        this._noti.pushAlert('Hủy không thành công', 'Vui lòng kiểm tra lại', 'error', 2000);
                    }
                    this._spinner.hide();
                }
                catch (err) {
                    const errs = new Error(err);
                    this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
                    this._spinner.hide();
                }
                //end catch
            }
        });

    }


    onReceipt(flight: FlightBooking) {
        this._router.navigate([`cashier/receipt/create`], { queryParams: { orderCode: flight.code, type:'flight' } });
    }

}
