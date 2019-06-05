import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { CouponSuggestRepo } from '../../../../../common/repositories/coupon-suggest.respository';
import { NotificationService, Spinner, Error } from '../../../../../common';

@Component({
    selector: 'select-flight',
    templateUrl: './select-flight.component.html',
    styleUrls: ['./select-flight-component.less'],
    encapsulation: ViewEncapsulation.None
})
export class SelectFlightComponent extends AppBase {

    @Output() onselect: EventEmitter<any> = new EventEmitter<any>();
    departPlace: string = ''; //keyword
    departs: any[] = [];
    selectedDepart: IDeparture = {
        code: '',
        name: ''
    };

    arrivals: any[] = [];
    arrivalPlace: string = ''; //keyword
    selectedArrival: IArrival = {
        code: '',
        name: ''
    }

    typeTickets: any[] = [];
    selectedTypeTicket: any;

    @Input() tickets: any = [];

    isShowDepart: boolean = false;
    isSelectedDepart: boolean = false;
    isShowArrival: boolean = false;
    isSelectedArrival: boolean = false;

    constructor(private _couponRepo: CouponSuggestRepo,
        private _notification: NotificationService,
        private _spinner: Spinner) {
        super()
    }

    ngOnInit() {
        this.typeTickets = [{ title: '1 chiều', type: 1, roundTrip: false }, { title: 'Khứ hồi', type: 2, roundTrip: true }];
        this.selectedTypeTicket = this.typeTickets[0];
    }

    //fn select suggest 
    async selectSuggest(keyword: string, type: string) {
        switch (type) {
            case 'depart':
                this.arrivalPlace = "";
                this.selectedArrival = null;
                if (keyword.length > 0) {
                    await this.getDepart(keyword);
                    this.isShowDepart = true;
                }
                else {
                    this.isShowDepart = false;
                }
                break;
            case 'arrival':
                if (keyword.length > 0) {
                    await this.getArrival(keyword, this.selectedDepart.code);
                    this.isShowArrival = true;
                }
                else {
                    this.isShowArrival = false;
                }
                break;
            default:
                this.departs = [];
                this.arrivals = [];
                break;
        }
    }

    //fn get departPlace
    async getDepart(keyword: string) {
        this._spinner.show();
        try {
            const body = {
                keyword: keyword
            }
            const response: any = await this._couponRepo.getDeparts(this.offset, this.limit, body);
            if (response.code === 'Success') {
                this.departs = response.data || [];

            } else {
                this._spinner.hide();
            }

        } catch (error) {
            this.handleError(error);
            this._spinner.hide();
        }
    }

    //fn get arrival
    async getArrival(keyword: string, option: string) {
        this._spinner.show();
        try {
            const body = {
                keyword: keyword,
                option: option
            }
            const response: any = await this._couponRepo.getArrivals(this.offset, this.limit, body);
            if (response.code === 'Success') {
                this.arrivals = response.data || [];
            } else {
                this._spinner.hide();
            }

        } catch (error) {
            this.handleError(error);
            this._spinner.hide();
        }

    }

    //fn select depart
    selectDepart(depart: IDeparture) {
        this.selectedDepart = depart;
        this.departPlace = this.selectedDepart.name;

        //reset
        this.departs = [];
        this.isShowDepart = false;
        this.isSelectedDepart = true;
    }

    //fn select arrival
    selectArrival(arrival: IArrival) {
        this.selectedArrival = arrival;
        this.arrivalPlace = this.selectedArrival.name;

        //reset
        this.arrivals = [];
        this.isShowArrival = false;
        this.isSelectedArrival = true;
    }

    //fn add more ticket
    addTicket() {
        const data = {
            departure: this.selectedDepart,
            arrival: this.selectedArrival,
            roundTrip: this.selectedTypeTicket.roundTrip
        }
        this.tickets.push(data);

        this.onselect.emit(this.tickets);

        this.departPlace = this.arrivalPlace = '';

    }

    //fn delete ticket
    deleteTicket(index: number) {
        this.tickets.splice(index , 1);
    }

    //fn handle error
    handleError(errors: any) {
        this._notification.pushToast('Lỗi', new Error(errors).value, 'error', 3000);
    }
}


interface IDeparture {
    code: string;
    name: string;
}

interface IArrival {
    code: string;
    name: string;
}
