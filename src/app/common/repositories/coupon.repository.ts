import { Injectable } from '@angular/core';
import { ApiService } from '../services';

const urlCouponList = "core/coupon/index";
@Injectable()
export class CouponRepo {

    constructor(protected _api: ApiService) {
    }

    //fn get list coupon
    getListCoupon(offset: number = 0, limit: number = 10, body: any = {}) {
        return this._api.customPOST(urlCouponList, body, {
            offset: offset,
            limit: limit
        })
    }

    //delete coupon
    deleteCoupon(id: string) {
        return this._api.post(`core/coupon/${id}/delete`, {});
    }

    //fn enabled/disabled coupon
    enableCoupon(id: string, enable: boolean) {
        const body = {
            enabled: enable
        }
        return this._api.post(`core/coupon/${id}/enable `, body);
    }

    //fn create coupon
    createCoupon(body) {
        return this._api.post('core/coupon/create', body);
    }

    //fn get info coupon
    getCouponInfo(id: string) {
        return this._api.post(`core/coupon/${id}/detail`, {});
    }

    //fn update coupon
    updateCoupon(id: string, body: any) {
        return this._api.post(`core/coupon/${id}/update`, body);

    }
}
