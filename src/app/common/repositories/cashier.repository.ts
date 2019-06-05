import { Injectable } from "@angular/core";
import { BaseRepository } from "./base.repository";
import { Receipt } from "../entities";
import { ApiService } from "../services";

@Injectable()
export class CashierRepo extends BaseRepository {
    constructor(_api: ApiService) {
        super(Receipt, 'admin', null, _api);
    }

    //fn get list reward point
    getListOrderReceipt(offset: number = 0, limit: number = 10, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api.customPOST(`core/management/order/receipt/list`, data, {
                offset: offset,
                limit: limit
            }).then(
                (response: any) => {
                    this.success(response, resolve, reject);
                },
                (errors: Error[] = []) => reject(errors)
            );
        });
    }

    //fn get list reward point
    getListOrderRefund(offset: number = 0, limit: number = 10, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api.customPOST(`core/management/order/refund/list`, data, {
                offset: offset,
                limit: limit
            }).then(
                (response: any) => {
                    this.success(response, resolve, reject);
                },
                (errors: Error[] = []) => reject(errors)
            );
        });
    }

    //fn get tour detail
    getDetailOrder(code: string, module: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/management/order/${module}/detail/${code}`, "")
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //create receipt
    createReceipt(data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/management/order/receipt/create`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //create receipt
    updateReceipt(id: string, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/management/order/receipt/update/${id}`,data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //get detail receipt
    getDetailReceipt(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/management/order/receipt/detail/${id}`)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //create refund order
    createRefundOrder(data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/management/order/refund/create`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //create receipt
    updateRefundOrder(id: string, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/management/order/refund/update/${id}`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //get detail receipt
    getDetailRefundOrder(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/management/order/refund/detail/${id}`)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }
}