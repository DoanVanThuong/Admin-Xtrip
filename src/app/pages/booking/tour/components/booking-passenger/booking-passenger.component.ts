import { Component } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CPATTERN, CSTORAGE, ACTION_TOUR_TYPE, ACTION_TOUR } from '../../../../../app.constants';
import { BookingTour, StorageService, Passenger, NotificationService, Spinner, TourRepo, PaymentRepo, Error } from '../../../../../common';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
    selector: 'booking-tour-passenger',
    templateUrl: './booking-passenger.component.html',
    styleUrls: ['./booking-passenger.component.less']
})
export class BookingPassengerComponent extends AppBase {

    formContact: FormGroup;
    firstName: AbstractControl;
    lastName: AbstractControl;
    email: AbstractControl;
    mobileNumber: AbstractControl;

    bookingTour: BookingTour = new BookingTour();

    titles: any[] = [];
    selectedTitle: any = {};

    passengers: Passenger[] = [];
    adultPassengers: Passenger[] = [];
    childPassengers: Passenger[] = [];
    infantPassengers: Passenger[] = [];

    isValidPassenger: boolean = false;

    counter: number = 0;
    requestId: string = '';
    reservationCode: string = '';
    action: ACTION_TOUR_TYPE = ACTION_TOUR.BOOOK;
    bookingId: string = '';

    bookingInfo: IBookingInfo = null;
    params: Partial<IParam> = {};
    constructor(private fb: FormBuilder,
        private _storage: StorageService,
        private _noti: NotificationService,
        private _spinner: Spinner,
        private _tourRepo: TourRepo,
        private _router: Router,
        private _paymentRepo: PaymentRepo,
        private _activeRouter: ActivatedRoute,
        private _location: Location

    ) {
        super();
    }

    ngOnInit() {
        this._activeRouter.queryParams.subscribe((params: any) => {
            this.params = params;
            
            if (!!params.action && !!params.bookingId) {
                this.bookingId = this.params.bookingId;
                this.getPassengerInfo(this.bookingId);
            }
        })

        switch (this.params.action) {
            case ACTION_TOUR.UPDATE_PASSENGER: {
                break;
            }
            default:
                this.bookingTour = this._storage.getItem(CSTORAGE.BOOKING_TOUR);
                // this.createBooking();
                this.getPassenger(this.bookingTour.adults, this.bookingTour.children, this.bookingTour.infants);
                break;
        }
        this.initFormContact();
    }

    //fn init form contact
    initFormContact() {
        this.formContact = this.fb.group({
            'firstName': [, Validators.compose([
                Validators.required
            ])],
            'lastName': [, Validators.compose([
                Validators.required
            ])],
            'email': [, Validators.compose([
                Validators.required,
                Validators.pattern(CPATTERN.EMAIL),
            ])],
            'mobileNumber': [, Validators.compose([
                Validators.required,
                (this.params.action === ACTION_TOUR.UPDATE_PASSENGER ? null : Validators.maxLength(10)),
                (this.params.action === ACTION_TOUR.UPDATE_PASSENGER ? null : Validators.pattern(CPATTERN.PHONE_NUMBER))
            ])],

        })

        this.firstName = this.formContact.controls['firstName'];
        this.lastName = this.formContact.controls['lastName'];
        this.email = this.formContact.controls['email'];
        this.mobileNumber = this.formContact.controls['mobileNumber'];

        //get value contact change
        this.formContact.valueChanges.subscribe((contact: IContact) => {
            this.bookingTour.contact = contact;
        });
    }

    //initFormContact
    initFormUpdateContact(contacts: IContact) {
        this.formContact.setValue({
            firstName: contacts.firstName,
            lastName: contacts.lastName,
            email: contacts.email,
            mobileNumber: contacts.mobileNumber
        });
    }

    getPassenger(adults: number = 1, children: number = 0, infants: number = 0) {
        let noAdult = 0;
        let noChild = 0;
        let noInfant = 0;

        while (adults > 0) {
            const pasenger = new Passenger();
            pasenger.setNo(noAdult);
            pasenger.setType('ADT')
            noAdult++;
            this.adultPassengers.push(pasenger);
            adults--;
        }
        while (children > 0) {
            const pasenger = new Passenger();
            pasenger.setNo(noChild);
            pasenger.setType('CHD')
            noChild++;
            this.childPassengers.push(pasenger);
            children--;
        }
        while (infants > 0) {
            const pasenger = new Passenger();
            pasenger.setNo(noInfant);
            pasenger.setType('INF')
            noInfant++;
            this.infantPassengers.push(pasenger);
            infants--;
        }
        this.passengers = [...this.adultPassengers, ...this.childPassengers, ...this.infantPassengers];

    }

    onChangePassenger(data: any) {
        this.isValidPassenger = data[1];
        this.bookingTour.passengers = this.passengers;
    }

    //fn booking
    onBookTour() {
        this._noti.pushQuestion('Xác nhận đặt tour', 'Tôi muốn đặt tour này', true, 'Xác nhận', 'Hủy').then((value: any) => {
            if (value.value) {
                this.onMakeReservationCode();
            }
        })
    }
    //fn creat booking
    async createBooking() {
        const body = {
            code: this.bookingTour.code,
            departDate: this.bookingTour.departDate,
            adults: this.bookingTour.adults,
            children: this.bookingTour.children,
            infants: this.bookingTour.infants
        }
        try {
            const response: any = await this._tourRepo.generateRequestId(body);
            this.requestId = response.data.requestId || '';

            this.bookingTour.requestId = this.requestId;

        } catch (error) {
            const errs = new Error(error[0]);
        }
    }

    //fn on make reservation code
    async onMakeReservationCode() {
        this._spinner.show();
        if (this.counter === 3) {
            this._spinner.hide();
            this._noti.pushToast('Lỗi đặt tour', 'Vui lòng kiểm tra lại!', 'error', 3000);
            return;
        }
        try {
            // booking qua OSE
            const res: any = await this._tourRepo.BookingTourByOSE(this.bookingTour);
            this.reservationCode = res.data.code || '';

            switch (res.data.statusCode) {
                case 0: {
                    // pending
                    this.counter++;
                    setTimeout(() => {
                        this.onMakeReservationCode();
                    }, 10 * 1000); // 10s
                    break;
                }
                case 1: {
                    // success
                    this._noti.pushAlert('Đặt tour thành công', `Mã: ${this.reservationCode}`, 'success', 2000);
                    this._router.navigate(['cs/customer'], {
                        queryParams: {
                            tab: 'tour'
                        }
                    });
                    // this.onPayment();
                    break;
                }
                default: {
                    this._router.navigate(['booking/tour']);
                    this._spinner.hide();
                    this._noti.pushToast('Lỗi đặt tour', 'Vui lòng kiểm tra lại!', 'error', 3000);
                    break;
                }
            }
        }
        catch (errors) {
            this._noti.pushToast('Lỗi đặt tour', 'Vui lòng kiểm tra lại!', 'error', 3000);
        }
        finally{
            this._spinner.hide();
        }
    }

    //fn on payment
    async onPayment() {
        const body = {
            Gateway: 'XPay',
            Method: 'Office',
        }
        try {
            await this._paymentRepo.postPayment('tour', this.reservationCode, body);
            this.verifyBooking(this.reservationCode);
        } catch (error) {
            this._router.navigate(['booking/tour']);
        }
    }

    //fn verify booking
    async verifyBooking(code: string) {
        this._spinner.show();
        try {
            await this._tourRepo.verifyBookingTour(code);
            this._noti.pushAlert('Đặt tour thành công', `Mã: ${this.reservationCode}`, 'success', 2000);
            this._router.navigate(['cs/customer'], {
                queryParams: {
                    tab: 'tour'
                }
            });

        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    //get passengerInfo
    async getPassengerInfo(id: string) {
        try {
            const respone: any = await this._tourRepo.getPassengerInfoByBooking(id);
            this.bookingInfo = respone.data;
            
            const contact: IContact = {
                firstName: this.bookingInfo.contactFirstName,
                lastName: this.bookingInfo.contactLastName,
                email: this.bookingInfo.email,
                mobileNumber: this.bookingInfo.mobileNumber
            }

            this.initFormUpdateContact(contact);

            if (!this.bookingInfo.passengers.length) {
                this.getPassenger(this.params.adults, this.params.childrens, this.params.infants);
            }
            else
                this.passengers = this.bookingInfo.passengers;
        } catch (error) { }
    }

    //fn update passenger info
    async upDatePassengerInfo() {
        this._spinner.show();
        const body = {
            contactFirstName: this.firstName.value,
            contactLastName: this.lastName.value,
            email: this.email.value,
            mobileNumber: this.mobileNumber.value,
            passengers: this.passengers
        }
        try {
            await this._tourRepo.updatePassengerInfo(this.bookingId, body);
            swal({
                title: "Cập nhật thành công",
                type: "success",
            }).then(() => {
                this._location.back();
            });

        } catch (error) {
            const errs = new Error(error[0]);
            this._noti.pushToast(`${errs.value}`, '', 'error', 2000, { showConfirmButton: false });
        }
        finally {
            this._spinner.hide()
        }
    }
}

interface IContact {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
}

interface IBookingInfo {
    contactFirstName: string;
    contactLastName: string;
    email: string;
    mobileNumber: string;
    passengers: Passenger[];
}

interface IParam {
    bookingId: string,
    adults: number,
    childrens: number,
    infants: number,
    action: ACTION_TOUR_TYPE
}
