import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NotificationService, ApiService } from '../services';
import { BaseRepository } from './base.repository';
import { Hotel } from '../entities';

const urlHotelCustomerReport = "core/hotel/report/customers";
const urlHotelTransfer = "core/hotel/report/payment/transfer";
const urlHotelTicket = "core/hotel/report/tickets";
@Injectable()

export class HotelRepo extends BaseRepository {
    constructor(_api: ApiService) {
        super(Hotel, 'admin', null, _api);
    }

    //fn get ds booking khach san
    getBookingHotel(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlHotelCustomerReport, data, {
            offset: offset,
            limit: limit
        });
    }

    //fn get chi tiết booking khach san
    getDetailBookingHotel(id: string) {
        return this._api.setBaseUrl(environment.API_URL).post(`${urlHotelCustomerReport}/detail/${id}`);
    }

    //fn get ds chuyen khoan cua khach san
    getTransferHotel(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlHotelTransfer, data, {
            offset: offset,
            limit: limit
        });
    }

    //fn get chi tiết chuyen khoan ks
    getDetailTransfer(id: string) {
        return this._api.post(`${urlHotelTransfer}/detail/${id}`);
    }

    //fn xác thực chuyển khoản 
    confirmTransferHotel(id: string) {
        return this._api.post(`${urlHotelTransfer}/confirm/${id}`);
    }

    //fn hủy booking hotel
    cancelBookingHotel(id: string) {
        return this._api.post(`${urlHotelCustomerReport}/cancel/${id}`, {});
    }

    //fn xác thực thanh toán
    confirmPaid(id: string) {
        return this._api.post(`${urlHotelCustomerReport}/confirm/${id}`);
    }

    //export excel 
    export(data: any) {
        return this._api.download(`${urlHotelCustomerReport}/export`, data);
    }

    //fn export transfer
    exportPaymentTransfer(data: any) {
        return this._api.download(`${urlHotelTransfer}/export`, data);
    }

    //fn get ticket list
    getTicketLisst(offset: number = 0, limit: number = 10, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api.customPOST(urlHotelTicket, data, {
                offset: offset,
                limit: limit
            })
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: Error[] = []) => reject(errors)
                );
        });
    }

    //fn confirm ticket
    confirmTicket(id: string) {
        return new Promise((resolve, reject) => {
            return this._api.post(`${urlHotelTicket}/issue/${id}`)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: Error[] = []) => reject(errors)
                );
        });
    }

    //get Exported Tickets
    getExportedTickets(offset: number = 0, limit: number = 10, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api.customPOST(`${urlHotelTicket}/listexported`, data, {
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

    //fn update pnr code hotel
    updatePnr(body: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api.customPOST(`${urlHotelTicket}/updateCode`, body).then(
                (response: any) => {
                    this.success(response, resolve, reject);
                },
                (errors: Error[] = []) => reject(errors)
            );
        });
    }
}
