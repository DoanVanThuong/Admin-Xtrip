import { Component, Output, EventEmitter} from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { TourRepo, Tour, Spinner, BookingTour, NotificationService, StorageService, TourSuggestRepository, Error } from '../../../../../common';
import { FormGroup, AbstractControl, Validators, FormBuilder, FormControl } from '@angular/forms';
import { CSTORAGE } from '../../../../../app.constants';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
@Component({
    selector: 'booking-tour-general',
    templateUrl: './booking-general.component.html',
    styleUrls: ['./booking-general.component.less']
})
export class BookingGeneralComponent extends AppBase {
    @Output() changeTab: EventEmitter<any> = new EventEmitter<any>();
    formGeneral: FormGroup;
    serialCode: AbstractControl; //mã công trình
    adultPrice: AbstractControl; //giá người lớn
    childPrice: AbstractControl; //giá trẻ em
    infantPrice: AbstractControl; //giá em bé
    totalPrice: AbstractControl;   //tổng tiền

    adult: number = 1; //số người lớn
    child: number = 0; //số trẻ em
    infant: number = 0; //số em bé
    price: number = 0; //tổng tiền OSE nhập

    tourDetail: Tour = null;
    code: string = '';
    bookingTour: BookingTour = new BookingTour();

    isSearch: boolean = false;

    priceSummary: any = null;

    constructor(private _tourRepo: TourRepo,
        private fb: FormBuilder,
        private _spinner: Spinner,
        private _storage: StorageService,
        private _notification: NotificationService,
        private _router: Router,
        private _activedRouter: ActivatedRoute) {
        super()
    }

    ngOnInit() {

        this.initForm();
        this.getParam();
    }

    getParam() {
        this._activedRouter.queryParams.subscribe((params: any) => {
            if (params.serialCode) {
                this.code = params.serialCode;
                this.serialCode.setValue(this.code);
                this.onGetDetailTour(this.code);
            }
        })
    }

    initForm() {
        this.formGeneral = this.fb.group({
            'serialCode': [, Validators.compose([
                Validators.required
            ])],
            'adultPrice': [, Validators.compose([
                Validators.required
            ])],
            'childPrice': [0, Validators.compose([
                Validators.required
            ])],
            'infantPrice': [0, Validators.compose([
                Validators.required
            ])],
            'totalPrice': [0, Validators.compose([
                Validators.required,
                Validators.min(1)
            ])],
        })

        this.serialCode = this.formGeneral.controls['serialCode'];
        this.adultPrice = this.formGeneral.controls['adultPrice'];
        this.childPrice = this.formGeneral.controls['childPrice'];
        this.infantPrice = this.formGeneral.controls['infantPrice'];
        this.totalPrice = this.formGeneral.controls['totalPrice'];
    }

    //fn khi blur khỏi input mct
    async onBlurSerialCode(serialCode: string) {
        if (!!serialCode && serialCode.length >= 8) {
            this.onGetDetailTour(serialCode);
        }
        else {
            this.serialCode.setValue(null);
            this.tourDetail = null;
            this.isSearch = false;
        }
    }

    //fn get detail tour
    async onGetDetailTour(serialCode: string) {
        const tour = await this.getDetailTour(serialCode);

        // nếu có dữ liệu tour theo mct
        if (!!tour) {
            this.isSearch = true;
            this.tourDetail = new Tour(tour);
            this.bookingTour.adults = 1;
            this.bookingTour.children = 0;
            this.bookingTour.infants = 0;
            // mct sinh ra từ DE
            if (this.tourDetail.isSystemCode) {
                // update thông tin booking
                this.bookingTour.code = this.tourDetail.code;
                this.bookingTour.departDate = this.tourDetail.departDate;
                this.bookingTour.childrenPrice = this.tourDetail.childPrice;
                this.bookingTour.adultsPrice = this.tourDetail.adultPrice;
                this.bookingTour.infantsPrice = this.tourDetail.infantPrice;

                // lấy giá 
                this.getPriceSummary(this.bookingTour);

                if (this.tourDetail.adultPrice) {
                    this.adultPrice.setValue(this.tourDetail.adultPrice);
                    this.adultPrice.disable();
                }
                if (this.tourDetail.childPrice) {
                    this.childPrice.setValue(this.tourDetail.childPrice);
                    this.childPrice.disable();
                }
                if (this.tourDetail.infantPrice >= 0) {
                    this.infantPrice.setValue(this.tourDetail.infantPrice);
                    this.infantPrice.disable();
                }
            }
            else {
                this.setValueForm(null, this.adultPrice, this.childPrice, this.infantPrice, this.totalPrice);

                // mở input cho nhập
                this.childPrice.enable();
                this.adultPrice.enable();
                this.infantPrice.enable();
                this.totalPrice.enable();
            }
        }
        // nếu tìm k thấy mã công trình
        else {
            this.isSearch = false;
            this.tourDetail = null;
            this.setValueForm(null, this.adultPrice, this.childPrice, this.infantPrice);
        }

    }

    //fn people change
    onPeopleChanges($event: any, type: any) {
        switch (type) {
            case 'adult':
                this.bookingTour.adults = $event;
                break;
            case 'children':
                this.bookingTour.children = $event;
                break;
            case 'infant':
                this.bookingTour.infants = $event;
                break;
            default:
                break;
        }

        if (this.bookingTour.adults + this.bookingTour.children > this.tourDetail.available) {
            this._notification.pushToast("Rất tiếc không còn đủ chỗ trống phù hợp với yêu cầu của bạn", '', 'error', 2000, { showConfirmButton: false });
            this.bookingTour.adults = (!!this.tourDetail && this.tourDetail.available > 0 ? 1 : 0);
            setTimeout(() => {
                this.bookingTour.children = 0;
            }, 100);
            this.bookingTour.infants = 0;
        }
        if (this.tourDetail.isSystemCode) {
            this.getPriceSummary(this.bookingTour);
        }
    }
    // fn get price summary
    getPriceSummary = async (bookingTour: BookingTour): Promise<any> => {
        this._spinner.show()
        try {
            const res: any = await this._tourRepo.getPriceSummary(bookingTour);
            this.priceSummary = res.data || {};
            this.price = 0;
            res.data.totalItems.map((item: any) => {
                this.price += item.price;
            });

            //set value cho tổng tiền
            this.totalPrice.setValue(this.price);
            this.totalPrice.disable();
            this.bookingTour.totalPrice = this.price;
        }
        catch (errors) { }
        finally {
            this._spinner.hide();
        }
    };
    
    //get detail tour
    async getDetailTour(code: string) {
        this._spinner.show();
        try {
            const response: any = await this._tourRepo.getTourBySerialCode(code);
            return response.data;

        } catch (error) {
            const errs = new Error(error[0]);
            this._notification.pushToast(`${errs.value}`, '', 'error', 3000, { showConfirmButton: false });
        }
        finally {
            this._spinner.hide();
        }
    }

    setValueForm(value: any, ...controls: any[]) {
        for (const control of controls) {
            if (control instanceof FormControl) {
                control.setValue(value);
            }
        }
    }

    detectDisabled() {
        return !this.formGeneral.valid || (!!this.tourDetail && !this.tourDetail.code)
    }

    //fn go next to passenger info
    goNext() {
        if (this.tourDetail.isSystemCode) {
            this._storage.setItem(CSTORAGE.BOOKING_TOUR, this.bookingTour);
            this._router.navigate(['booking/tour'], { queryParams: { tab: 'passenger', action: 'book' } });
        }
        else {
            this.bookingTour.code = this.serialCode.value;
            this.bookingTour.departDate = this.tourDetail.departDate;
            this.bookingTour.childrenPrice = this.childPrice.value;
            this.bookingTour.adultsPrice = this.adultPrice.value;
            this.bookingTour.infantsPrice = this.infantPrice.value;
            this.bookingTour.totalPrice = this.totalPrice.value;
            this.bookingTour.adults = this.adult;
            this.bookingTour.children = this.child;
            this.bookingTour.infants = this.infant;
        }
        this._storage.setItem(CSTORAGE.BOOKING_TOUR, this.bookingTour);

        this.changeTab.emit('passenger');
        this._router.navigate(['booking/tour'], { queryParams: { tab: 'passenger', action: 'book' } });
    }
}
