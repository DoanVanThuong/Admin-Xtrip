import { Injectable } from '@angular/core';
import { ApiService } from '../services';

const urlCouponSuggest = "core/coupon/suggest";
@Injectable()
export class CouponSuggestRepo {

    constructor(protected _api: ApiService) {
    }

    //fn get suggest hotel
    getSuggestHotels(offset: number, limit: number, body: any) {
        return this._api.customPOST(`${urlCouponSuggest}/hotel`, body, {
            offset: offset,
            limit: limit
        })
    }

    //fn get suggest tour
    getSuggestTours(offset: number, limit: number, body: any) {
        return this._api.customPOST(`${urlCouponSuggest}/tour`, body, {
            offset: offset,
            limit: limit
        })
    }

    //fn get suggest activity
    getSuggestActivity(offset: number, limit: number, body: any) {
        return this._api.customPOST(`${urlCouponSuggest}/product`, body, {
            offset: offset,
            limit: limit
        })
    }

    //fn get suggest account
    getSuggestAccount(offset: number, limit: number, body: any) {
        return this._api.customPOST(`${urlCouponSuggest}/account`, body, {
            offset: offset,
            limit: limit
        })
    }

    //fn get suggest departPlace
    getDeparts(offset: number, limit: number, body: any) {
        return this._api.customPOST(`${urlCouponSuggest}/destination`, body, {
            offset: offset,
            limit: limit
        })
    }

    //fn get suggest arrivalPlace
    getArrivals(offset: number, limit: number, body: any) {
        return this._api.customPOST(`${urlCouponSuggest}/arrival`, body, {
            offset: offset,
            limit: limit
        })
    }

    //fn gen coupon
    genCouponCode() {
        return this._api.post('core/coupon/gencode', {});
    }

    //fn check code
    checkexist(code: string) {
        const body = {
            keyword: code
        }
        return this._api.post('core/coupon/checkexist', body);
    }
}
