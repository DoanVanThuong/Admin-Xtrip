import { Injectable } from '@angular/core';
import { ApiService } from './../services/index';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaymentRepo  {

    success(response: any = {}, resolve: any = Function, reject: any = Function) {
        if (!!response.code && response.code.toLowerCase() === 'success') {
            if (typeof resolve === 'function') {
                return resolve(response);
            }
            return response;
        } else {
            if (typeof reject === 'function') {
                return reject(response.errors);
            }
            return response.errors;
        }
    }

    constructor(private _api: ApiService) {
    }

    // get List method payment
    getPayments = (module: string = '', code: string = '') => {
        return new Promise((resolve, reject) => {
            return this._api
                .setBaseUrl(environment.API_PAY_URL)
                .post(`/method/${module}/${code}`)
                .then(
                    (response: any) => this.success(response, resolve, reject),
                    (errors: any) => reject(errors)
                );
        });
    };

    // post payment
    postPayment(module: string, code: string = '', data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .setBaseUrl(environment.API_PAY_URL)
                .post(`/payment/${module}/${code}`, data)
                .then(
                    (response: any) => {
                        return this.success(response, resolve, reject);
                    },
                    (errors: any) => {
                        reject(errors);
                    }
                );
        });
    }


}
