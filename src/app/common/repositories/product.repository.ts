import { Injectable } from '@angular/core';
import { ApiService } from '../services';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, } from '@angular/common/http/';

const urlProductCustomerReport = "core/product/report/customers";
const urlProductPaymentTransfer = "core/product/report/payment/transfer";
const urlProductTicket = "core/product/report/tickets";

@Injectable()
export class ProductRepo {

    constructor(protected _api: ApiService, private _http: HttpClient) {
    }

    //fn get flight booking theo limit offset
    getBookingProduct(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.setBaseUrl(environment.API_URL).customPOST(urlProductCustomerReport, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn cancel booking
    cancelBooking(id: string) {
        return this._api.post(`${urlProductCustomerReport}/cancel/${id}`, {});
    }

    //fn confirm booking
    confirmBooking(id: string) {
        return this._api.post(`${urlProductCustomerReport}/confirm/${id}`);
    }

    ////fn confirm payment transfer
    confirmPaymentTransfer(id: string) {
        return this._api.post(`${urlProductPaymentTransfer}/confirm/${id}`);
    }

    //fn get detail booking product
    getDetailBooking(id: string) {
        return this._api.post(`${urlProductCustomerReport}/detail/${id}`);
    }

    //fn get transfer payment list
    getListPaymentTransfer(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlProductPaymentTransfer, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn get ticket list
    getTicketLisst(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlProductTicket, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn confirm ticket
    confirmTicket(id: string) {
        return this._api.post(`${urlProductTicket}/issue/${id}`);
    }

    //get Detail ticket
    getDetailTicket(id: string) {
        return this._api.post(`${urlProductTicket}/detail/${id}`);
    }

    //getExportedTickets
    getExportedTickets(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(`${urlProductTicket}/listexported`, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn get destination
    getDestination(type: string): Observable<any> {
        return this._http.post(`core/product/products/destination/${type}`, {})
    }

    //fn get list product by type and destination
    getProductsByDestination(type: string, destination: any = {}, offset: number = 0, limit: number = 10): Observable<any> {
        const body = {
            destination: destination
        };
        return this._http.post(`core/product/products/${type}`, body, {
            params: {
                offset: offset.toString(),
                limit: limit.toString()
            }
        });
    }

    //fn create popular activity
    createPopularActivity(id: string): Observable<any> {
        return this._http.post(`core/product/products/create/${id}`, {});
    }

    //fn update popular activity
    updatePopularActivity(id: string, data: any): Observable<any> {
        return this._http.post(`core/product/products/update/${id}`, data);
    }

    //fn delete popular activity
    deletePopularActivity(id: string) {
        return this._http.post(`core/product/products/delete/${id}`, {});
    }

    success(response: any = {}) {
        if (!!response.code && response.code.toLowerCase() === 'success') {
            return response;
        } else {
            return response.errors;
        }
    }

}
