import { Component, Input } from '@angular/core';
import { NotificationService, UtilityHelper, Error, HotelBooking, HotelRepo, Spinner } from '../../../common';
import { TYPE_TRANSFER } from '../../../app.constants';
import { AppList } from '../../../app.list';

import swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
    selector: "customer-hotel",
    templateUrl: "./customer-hotel.component.html"
})
export class CustomerHotelComponent extends AppList {

    @Input() role: string = null;
    hotelBooking: HotelBooking[] = new Array<HotelBooking>();

    DetailHotelBooking: any = {};

    typeBooking: TYPE_TRANSFER;

    openSideBar: boolean = false;
    isExpiredDate: boolean = false;
    isAdmin: boolean = false;
    isCS: boolean = false;
    selectedHotel: HotelBooking;

    constructor(
        private _hotelRepo: HotelRepo,
        private _noti: NotificationService,
        private _spinner: Spinner,
        private _router: Router
    ) {
        super();
        this.request = this.getCustomerBookingHotel;
    }

    ngOnInit() {
        this.getCustomerBookingHotel();
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

    //get customer's transfer offset, limit => return Arr HotelBooking
    async getCustomerBookingHotel() {
        this._spinner.show();
        const body = {
            Keyword: this.keyword,
            BookingDate: null
        };
        try {
            const dataFormServe: any = await this._hotelRepo.getBookingHotel((this.page - 1) * this.pageSize, this.limit, body);

            this.total = dataFormServe.data.total || 0;

            this.hotelBooking = (dataFormServe.data.data || []).map(item => {
                const hotel: HotelBooking = new HotelBooking(item);
                return hotel;
            });
            this._spinner.hide();

        } catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(
                `${errs.errorMessage}`,
                "vui lòng kiểm tra lại",
                "error",
                2000
            );
            this._spinner.hide();
        }
    }

    //get detail booking hotel show sidebar detail component
    async showDetailHotelBooking(hotel: HotelBooking) {
        this._spinner.show();
        this.selectedHotel = hotel;
        try {
            const response: any = await this._hotelRepo.getDetailBookingHotel(hotel.id);
            this.DetailHotelBooking = response.data.detail || {};

            if (this.openSideBar == false) {
                this.openSideBar = true;
                this.typeBooking = TYPE_TRANSFER.HOTEL;
                this._spinner.hide();
            }
        } catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(
                `${errs.errorMessage}`,
                "vui lòng kiểm tra lại",
                "error",
                2000
            );
            this._spinner.hide();
        }
    }

    conFirmHotel(hotel: HotelBooking) {
        //custom alert box
        swal({
            title: "Thông tin xác thực",
            html: `Tôi muốn xác thực khách hàng <b>${
                hotel.customerName
                }</b> đã thanh toán`,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
            allowEnterKey: false
        }).then(async result => {
            if (result.value) {
                this._spinner.show();

                try {
                    const response: any = await this._hotelRepo.confirmPaid(
                        hotel.id
                    );

                    if (response.code === "Success") {
                        this._noti.pushAlert(
                            "OK",
                            "Xác thực thánh toán thành công",
                            "success",
                            2000
                        );
                        this.getCustomerBookingHotel();
                    } else {
                        this._noti.pushToast(
                            "Nops",
                            "Có lỗi, vui lòng kiểm tra lại",
                            "error",
                            2000
                        );
                    }
                    this._spinner.hide();

                } catch (err) {
                    const errs = new Error(err);
                    this._noti.pushToast(
                        `${errs.errorMessage}`,
                        "vui lòng kiểm tra lại",
                        "error",
                        2000
                    );
                    this._spinner.hide();
                }
                //end catch
            }
        });
    }

    //if expiryDate	do something
    runOutOfTime() {
        this.isExpiredDate = true;
    }

    cancelHotel(hotel: HotelBooking) {	//custom alert box
        this._noti.pushQuestion('Thông tin hủy phòng', 'tôi muốn hủy phòng này', true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();

                try {
                    const response: any = await this._hotelRepo.cancelBookingHotel(hotel.id);

                    if (response.status) {
                        this._noti.pushAlert('OK', 'đã hủy phòng thành công', 'success', 2000);

                        this.getCustomerBookingHotel();
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

    onReceipt(hotel: HotelBooking) {
        this._router.navigate([`cashier/receipt/create`], { queryParams: { orderCode: hotel.code, type:'hotel' } });
    }
}





