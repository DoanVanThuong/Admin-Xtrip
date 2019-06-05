import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { Image, Spinner, Error, NotificationService } from '../../../../../common';
import { CouponSuggestRepo } from '../../../../../common/repositories/coupon-suggest.respository';

@Component({
    selector: 'select-activity',
    templateUrl: './select-activity.component.html',
    styleUrls: ['./select-activity.component.less'],
    encapsulation: ViewEncapsulation.None

})
export class SelectActivityComponent extends AppBase {

    @Input() selectedProducts: IActivity[] = [];
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

    products: Partial<IActivity[]> = new Array<IActivity>();

    keyword: string = '';
    isSelected: boolean = false;
    isShow: boolean = false;
    timeout: any = null;
    
    constructor(private _spinner: Spinner,
        private _couponRepo: CouponSuggestRepo,
        private _notification: NotificationService) {
        super();
    }

    ngOnInit(): void { }

    //fn select get suggest
    async selectSuggest(keyword: string) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
            if (keyword.length > 0) {
                await this.getProduct(keyword);
                this.isShow = true;
            }
            else
                this.isShow = false;
        }, 500);
    }

    //fn get product
    async getProduct(keyword: string) {
        this._spinner.show();
        try {
            const body = {
                keyword: keyword
            }
            const response: any = await this._couponRepo.getSuggestActivity(this.offset, this.limit, body);

            if (response.code === 'Success') {
                this.products = response.data || [];

                //xóa trùng
                this.products = _.differenceBy(this.products, this.selectedProducts, 'code');
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
    selectProduct(activity: IActivity) {
        this.selectedProducts.push(activity);
        this.onSelect.emit(this.selectedProducts);

        //reset value
        this.keyword = '';
        this.isSelected = true;
        this.isShow = false;
        this.products = [];
    }

    //fn delete tour
    deleteActivity(activity: IActivity) {
        this.selectedProducts.splice(_.findIndex(this.selectedProducts, item => item.code == activity.code), 1);
    }

    //fn handle error
    handleError(errors: any) {
        this._notification.pushToast('Lỗi', new Error(errors).value, 'error', 3000);
    }
}


interface IActivity {
    code: string;
    name: string;
    address: string;
    photo: Image;
    duration: string;
}
