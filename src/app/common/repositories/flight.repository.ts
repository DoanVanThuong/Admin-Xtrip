import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService, NotificationService } from '../services';

const urlFlightCustomerReport = "core/flight/report/customers";
const urlFlightTransfer = "core/flight/report/payment/transfer";
const urlFlightTicket = "core/flight/report/tickets";
@Injectable()
export class FlightRepo {

    constructor(private _api: ApiService, private _noti: NotificationService) { }

    //fn get flight booking theo limit offset
    getBookingFlight(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.setBaseUrl(environment.API_URL).customPOST(urlFlightCustomerReport, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn get detail booking flight
    getBookingDetailFlight(id) {
        return this._api.setBaseUrl(environment.API_URL).post(`${urlFlightCustomerReport}/detail/${id}`);
    }


    //fn get ds chuyen khoan flight
    getTransferFight(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlFlightTransfer, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn get detail chuyen khoan
    getDetailTransferFlight(id: string) {
        return this._api.post(`${urlFlightTransfer}/detail/${id}`);
    }

    //fn xác thực chuyển khoản
    confirmTransferFlight(id: string) {
        return this._api.post(`${urlFlightTransfer}/confirm/${id}`);
    }

    //fn cofirm thanh toán
    confirmPaid(id: string) {
        return this._api.post(`${urlFlightCustomerReport}/confirm/${id}`);
    }

    //fn hủy flight
    cancelBookingFlight(id: string) {
        return this._api.post(`${urlFlightCustomerReport}/cancel/${id}`, {});
    }

    //fn get list tickets
    geTickets(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlFlightTicket, data, {
            offset: offset,
            limit: limit
        });
    }

    //fn confirm ticket exported
    confirmTicket(id: string) {
        return this._api.post(`${urlFlightTicket}/issue/${id}`);
    }

    //get Detail ticket
    getDetailTicket(id: string) {
        return this._api.post(`${urlFlightTicket}/detail/${id}`);
    }

    //fn get list tickets exported
    getExportedTickets(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(`${urlFlightTicket}/listexported`, data, {
            offset: offset,
            limit: limit
        });
    }

    //fn get ticket is expiry
    getTicketExpiry(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(`${urlFlightTicket}/expiry`, data, {
            offset: offset,
            limit: limit
        });
    }

    //export excel customer booking
    export(data: any) {
        return this._api.download(`${urlFlightCustomerReport}/export`, data);
    }

    //export excel booking payment transfer
    exportPaymentTransfer(data: any) {
        return this._api.download(`${urlFlightTransfer}/export`, data);
    }

    //export excel ticket issued
    exportTicketIssued(data: any) {
        return this._api.download(`${urlFlightTicket}/export/issued`, data);
    }

    //export excel ticket need issued
    exportTicketNeedIssued(data: any) {
        return this._api.download(`${urlFlightTicket}/export/needissue`, data);
    }

    //fn update PNR code
    updatePNR(data: any) {
        return this._api.post(`${urlFlightTicket}/updatecode`, data);
    }
}
