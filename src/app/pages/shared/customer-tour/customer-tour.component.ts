import { Component, Input, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { AppList } from '../../../app.list';
import { TourBooking, TourRepo, NotificationService, Spinner, Error } from '../../../common';
import { TYPE_TRANSFER } from '../../../app.constants';
import { TourInfoPopupComponent } from '../../../components';
import { Router } from '@angular/router';

@Component({
    selector: 'customer-tour',
    templateUrl: './customer-tour.component.html',
})
export class CustomerTourComponent extends AppList {
    @ViewChild(TourInfoPopupComponent) tourInfoPopup: TourInfoPopupComponent;

    @Input() role: string = null;

    tourBooking: TourBooking[] = new Array<TourBooking>();

    DetailTourBooking: any = {};
    openSideBar: boolean = false;
    typeBooking: TYPE_TRANSFER;

    isExpiredDate: boolean = false;

    tourInfo: any = null;
    tourId: string = '';
    journey: any = null;
    selectedTour: TourBooking;

    constructor(private _tourRepo: TourRepo,
        private _noti: NotificationService,
        private _spinner: Spinner,
        private _router: Router) {

        super();
        this.request = this.getCustomerBookingReportTour;
    }

    ngOnInit() {
        this.getCustomerBookingReportTour();
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
                case 'cs': {
                    this.isCS = true;
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

    //get booking của customer + phân trang
    async getCustomerBookingReportTour() {
        this._spinner.show();
        const body = {
            Keyword: this.keyword,
            BookingDate: null
        }
        try {
            const dataFormServe: any = await this._tourRepo.getBookingTour((this.page - 1) * this.pageSize, this.limit, body);
            this.total = dataFormServe.data.total || 0;

            this.tourBooking = (dataFormServe.data.data || []).map(item => {
                const tourBooking: TourBooking = new TourBooking(item);
                return tourBooking;
            });
            this._spinner.hide();


        } catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
            this._spinner.hide();

        }

    }

    //xem chi tiết kh
    async showDetailTourBooking(tour: TourBooking) {
        this.tourId = tour.id;
        this.selectedTour = tour;
        this._spinner.show();
        try {
            const response: any = await this._tourRepo.getDetailBookingTour(tour.id);
            this.DetailTourBooking = response.data || {};
            if (this.openSideBar == false) {
                this.openSideBar = true;
                this.typeBooking = TYPE_TRANSFER.TOUR;
                this._spinner.hide();
            }
        }
        catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
            this._spinner.hide();
        }
    }

    //confirm ck
    confirmPayment(tour: TourBooking) {
        swal({
            title: 'Thông tin xác thực',
            html: `Tôi muốn xác thực, khách hàng <b>${tour.customerName}</b> đã thanh toán`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Hủy',
            allowEnterKey: false
        }).then(async (result) => {
            if (result.value) {
                this._spinner.show();

                try {
                    const data: any = await this._tourRepo.confirmPaid(tour.id);

                    if (data.code == 'Success') {
                        swal({ title: "Ok!", text: 'Xác thực thanh toán thành công', type: "success" }).then(() => {
                            this.getCustomerBookingReportTour();
                        });
                    }
                    else {
                        const errs = new Error(data.errors[0]);
                        this._noti.pushToast(`${errs.code === 1014 ? 'Tour đã hết chổ trống' : errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                    this._spinner.hide();

                }
                catch (err) {
                    const errs = new Error(err);
                    this._noti.pushToast(`${errs.code === 1014 ? 'Tour đã hết chổ trống' : errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    this._spinner.hide();
                }
                //end catch
            }
        });
    }

    //fn hủy tour
    cancelTour(tour: TourBooking) {	//custom alert box
        this._noti.pushQuestion('Thông tin hủy vé', 'tôi muốn hủy vé này', true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();

                try {
                    const response: any = await this._tourRepo.cancelBookingTour(tour.id);

                    if (response.code === 'Success') {
                        this._noti.pushAlert('OK', 'đã hủy tour thành công', 'success', 2000);
                        this.getCustomerBookingReportTour();
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
    //if expiryDate	do something
    runOutOfTime() {
        this.isExpiredDate = true;
    }

    //view detail tour popup
    async viewDetail(id: string) {
        this._spinner.show();
        try {
            const response: any = await this._tourRepo.getDetailBookingTour(id);
            if (response.code.toLowerCase() === 'success') {
                this.tourInfo = response.data.detail.tourDetailInfo || {};
                this.journey = await this.getJourney(this.tourInfo.tourPriceCode);
                setTimeout(() => {
                    this.tourInfoPopup.show();
                }, 100);
            }
            this._spinner.hide();
        }
        catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
            this._spinner.hide();
        }
    }

    //fn get thông tin lich trình tour
    async getJourney(tourCode: string) {
        this._spinner.show();
        try {
            const response: any = await this._tourRepo.getJourneyTourByCode(tourCode);
            return response.data;
        } catch (error) {
            const err: Error = new Error(error[0]);
            this._noti.pushToast(err.value, '', 'error', 3000, { showConfirmButton: false });
        }
        finally {
            this._spinner.hide(); 1
        }
    }

    //fn book tour
    onBookTour() {
        this._router.navigate(['booking/tour'] ,{queryParams: { tab: 'general', action: 'book'}});
    }

    onReceipt(tour: TourBooking) {
        this._router.navigate([`cashier/receipt/create`], { queryParams: { orderCode: tour.code, type: 'tour' } });
    }

}
