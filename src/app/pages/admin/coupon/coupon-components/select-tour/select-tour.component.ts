import { Component, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { CouponSuggestRepo } from '../../../../../common/repositories/coupon-suggest.respository';
import { NotificationService, Error, Spinner } from '../../../../../common';

@Component({
    selector: 'select-tour',
    templateUrl: './select-tour.component.html',
    styleUrls: ['./select-tour.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class SelectTourComponent extends AppBase {

    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

    tours: any[] = [];
    @Input()selectedTours: any[] = [];

    isShow: boolean = false;
    isSelected: boolean = false;

    keyword: string = '';
    timeout: any = null;
    
    constructor(private _couponRepo: CouponSuggestRepo,
        private _notification: NotificationService,
        private _spinner: Spinner) {
        super();
    }

    ngOnInit() {  }

    //fn select get suggest
    async selectSuggest(keyword: string) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
            if (keyword.length > 0) {
                await this.getTour(keyword);
                this.isShow = true;
            }
            else
                this.isShow = false;
        }, 500);
    }

    //fn get tour
    async getTour(keyword: string) {
        this._spinner.show();
        try {
            const body = {
                keyword: keyword
            }
            const response: any = await this._couponRepo.getSuggestTours(this.offset, this.limit, body);

            if (response.code === 'Success') {
                this.tours = response.data || [];

                //xóa trùng
                this.tours = _.differenceBy(this.tours, this.selectedTours, 'code');
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

    //fn select tour
    selectTour(tour: any) {
        this.selectedTours.push(tour);
        this.onSelect.emit(this.selectedTours);

        //reset value
        this.keyword = '';
        this.isSelected = true;
        this.isShow = false;
        this.tours = [];
    }

    //fn delete tour
    deleteTour(tour: any) {
        this.selectedTours.splice(_.findIndex(this.selectedTours, item => item.code == tour.code), 1);
    }

    //fn handle error
    handleError(errors: any) {
        this._notification.pushToast('Lỗi', new Error(errors).value, 'error', 3000);
    }
}
