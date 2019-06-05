import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { CouponSuggestRepo } from '../../../../../common/repositories/coupon-suggest.respository';
import { Hotel, NotificationService, Error, Spinner } from '../../../../../common';
import * as _ from 'lodash';

@Component({
    selector: 'select-hotel',
    templateUrl: './select-hotel.component.html',
    styleUrls: ['./select-hotel.componen.less'],
    encapsulation: ViewEncapsulation.None
})
export class SelectHotelComponent extends AppBase {

    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

    hotels: any[] = [];
    @Input()selectedHotels: any[] = [];

    isShow: boolean = false;
    isSelected: boolean = false;

    keyword: string = '';
    timeout: any = null;
    
    constructor(private _couponRepo: CouponSuggestRepo,
        private _notification: NotificationService,
        private _spinner: Spinner) {
        super()
    }

    ngOnInit(): void {

    }


    //fn select hotel
   async selectSuggest(keyword: string) {
       clearTimeout(this.timeout);
       this.timeout = setTimeout(async () => {
           if (keyword.length > 0) {
               await this.getHotel(keyword);
               this.isShow = true;
           }
           else
               this.isShow = false;
       }, 500);
    }

    //getSuggest hotel
    async getHotel(keyword) {
        this._spinner.show();
        try {
            const body = {
                keyword: keyword
            }
            const response: any = await this._couponRepo.getSuggestHotels(this.offset, this.limit, body);
            if (response.code === 'Success') {
                this.hotels = (response.data || []).map(hotel => new Hotel(hotel));
                
                //xóa trùng
                this.hotels = _.differenceBy(this.hotels, this.selectedHotels, 'code');
            }
            else {
                this.handleError(response.errors[0]);
            }
            this._spinner.hide();
        } catch (error) {
            this.handleError(error);
            this._spinner.hide();
        }
    }

    //fn select hotel
    selectHotel(hotel: Hotel) {
        this.selectedHotels.push(hotel);
        this.onSelect.emit(this.selectedHotels);
        
        //reset value
        this.keyword = '';
        this.isSelected = true;
        this.isShow = false;
        this.hotels = [];
    }

    //fn handle error
    handleError(errors: any) {
        this._notification.pushToast('Lỗi', new Error(errors).value, 'error', 3000);
    }

    //fn delete hotel
    deleteHotel(hotel: Hotel) {
        this.selectedHotels.splice(_.findIndex(this.selectedHotels, item => item.code == hotel.code), 1);
    }
}
