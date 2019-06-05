import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { ApiService } from '../services';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Error } from '../entities';

const urlTourCustomerReport = "core/tour/report/customers";
const urlTourTransfer = "core/tour/report/payment/transfer";
const urlTourList = "core/tour/index";
const urlTicket = "core/tour/report/tickets";
@Injectable()

export class TourRepo {

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

    constructor(private _api: ApiService, private _http: HttpClient) {
        this._api.setBaseUrl(environment.API_URL);
    }

    //fn lấy  booking tour theo limit, offsset
    getBookingTour(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlTourCustomerReport, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn lấy chi tiết booking của kh
    getDetailBookingTour(id: string) {
        return this._api.setBaseUrl(environment.API_URL).post(`${urlTourCustomerReport}/detail/${id}`);
    }

    //fn get chi tiết chuyen khoan
    getDetailTransfer(id: string) {
        return this._api.post(`${urlTourTransfer}/detail/${id}`);
    }

    //fn xác thực chuyển khoản
    confirmTransferTour(id: string) {
        return this._api.post(`${urlTourTransfer}/confirm/${id}`);
    }

    //fn xác thực thanh toán
    confirmPaid(id: string) {
        return this._api.post(`${urlTourCustomerReport}/confirm/${id}`);
    }

    //fn hủy booking tour
    cancelBookingTour(id: string) {
        return this._api.post(`${urlTourCustomerReport}/cancel/${id}`, {});
    }

    //fn get ds chuyen khoan cua tour
    getTransferTour(offset: number = 0, limit: number = 10, data: any = {}) {
        return this._api.customPOST(urlTourTransfer, data, {
            offset: offset,
            limit: limit
        })
    }

    //fn get suggest diem khoi hanh
    getSuggestDepart(keyword: string) {
        const body = {
            keyword: keyword
        }
        return this._api.post('core/tour/suggest/departure', body);
    }

    //fn get suggest nhà cung cấp
    getSuggestSupplier() {
        return this._api.post('core/tour/suggest/supplier');
    }

    //fn get suggest chủ đề tour
    getSuggestTopic() {
        return this._api.post('core/tour/suggest/tourtopic');
    }

    //fn get suggest dịch vụ tour
    getSuggestService() {
        return this._api.post('core/tour/suggest/service');
    }

    //fn get suggest điểm nổi bật
    getSuggestBenefit() {
        return this._api.post('core/tour/suggest/benefit');
    }

    //fn get suggest điểm đến
    getSuggestArival(isInternational: boolean, keyword: string) {
        const body = {
            isInternational: isInternational,
            keyword: keyword
        }
        return this._api.post('core/tour/suggest/arrival', body);
    }

    //fn tạo tour ( tạo thông tin chung)
    inputGeneralInfo(body: any) {
        return this._api.post('core/tour/create', body);
    }

    //fn upload image cho tour
    uploadImage(body: any, id: string) {
        return this._api.post(`/core/tour/${id}/images/upload`, body);
    }

    //fn get ds image của tour
    getListImage(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`/core/tour/${id}/images/list`)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn xóa ảnh của tour
    deleteImage(id: string, image: any) {
        return this._api.post(`/core/tour/${id}/images/delete`, image);
    }

    //fn pick ảnh đại diện cho tour
    setDefaulImageTour(id: string, image: any) {
        return this._api.post(`/core/tour/${id}/images/setdefault`, image);
    }

    //fn tạo/update chính sách, điều khoản
    setTermPolicyTour(id: string, policy: any, term: any) {
        const body = {
            term: term,
            policy: policy
        }
        return this._api.post(`/core/tour/${id}/termandpolicy`, body);
    }

    //fn tạo/update chuyến đi
    createJourney(body: any, id: string) {
        return this._api.post(`core/tour/${id}/journey`, body);
    }

    //fn kiểm tra ngày đã được tạo ngày khởi hành?
    checkDateIsApplied(date: string, id: string) {
        const body = {
            date: date
        }
        return this._api.post(`/core/tour/${id}/apply/detail`, body);
    }

    //fn update ngày khởi hành của tour
    updateStartingDate(id: string, body) {
        return this._api.post(`/core/tour/${id}/apply/update`, body)
    }

    //fn get danh sách tour
    getListTour(offset: number = 0, limit: number = 10, body: any = {}) {
        return this._api.customPOST(urlTourList, body, {
            offset: offset,
            limit: limit
        })
    }

    //fn get thông tin của tour mới tạo
    getTour(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .customPOST(`core/tour/${id}/update`, "")
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get thông tin chính sách điều khoản của tour
    getTourTermAndPolicy(id) {
        return this._api.customPOST(`core/tour/${id}/termandpolicy`, "");
    }

    //fn tạo ngày khởi hành
    createApplyDate(id: string, body: any) {
        return this._api.post(`/core/tour/${id}/apply/create`, body);
    }

    //fn update thông tin chung tour
    updateGeneralInfo(id: string, body: any) {
        return this._api.post(`core/tour/${id}/update`, body);
    }

    //fn get thong tin chuyến đi 
    getJourney(id: string) {
        return this._api.customPOST(`core/tour/${id}/journey`, "");
    }

    //fn ẩn tour
    enableTour(id: string, enable: boolean) {
        const body = {
            enabled: enable
        }
        return this._api.post(`core/tour/${id}/enable`, body);
    }

    //fn delete tour
    deleteTour(id: string) {
        return this._api.customPOST(`core/tour/${id}/delete`, {});
    }

    //fn copy tour
    copyTour(id: string) {
        return this._api.customPOST(`core/tour/${id}/clone`, {});
    }

    //fn get tất cả ngày khởi hành của tour
    getAllTourDepart(id: string) {
        return this._api.customPOST(`core/tour/${id}/apply`, "");
    }

    //fn delete starting date
    deleteApplyDate(date: string, id: string) {
        const body = {
            date: date
        }
        return this._api.post(`core/tour/${id}/apply/delete`, body);
    }

    //export excel 
    export(data: any) {
        return this._api.download('core/tour/report/customers/export', data);
    }

    //fn export transfer
    exportPaymentTransfer(data: any) {
        return this._api.download(`${urlTourTransfer}/export`, data);
    }

    //fn get journey by tourCode
    getJourneyTourByCode(tourCode: string): any {
        return this._api.get(`tour/journey/${tourCode}`);
    }

    //get list ticket issue/issued
    getListTicketIssue(offset: number = 0, limit: number = 10, body: any = {}) {
        return this._api.customPOST(urlTicket, body, {
            offset: offset,
            limit: limit
        });
    }

    //get detail ticket issue/issued
    getDetailTicketIssue(id: string) {
        return this._api.post(`${urlTicket}/detail/${id}`);
    }

    //fn comfirm ticket issue -> issued
    confimTicket(id: string) {
        return this._api.post(`${urlTicket}/issue/${id}`);
    }

    //fn get list ticket issued
    getExportedTickets(offset: number = 0, limit: number = 10, body: any = {}) {
        return this._api.customPOST(`${urlTicket}/listIssued`, body, {
            offset: offset,
            limit: limit
        });
    }

    //fn search tour 
    searchTour(data: any, offset: number = 0, limit: number = 10) {
        return new Promise((resolve, reject) => {
            return this._api
                .customPOST('tour/search', data, {
                    offset,
                    limit
                })
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn search tour 
    searchTourOSE(data: any, offset: number = 0, limit: number = 10) {
        return new Promise((resolve, reject) => {
            return this._api
                .customPOST('core/tour/tourose', data, {
                    offset,
                    limit
                })
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    // fn get price summary
    getPriceSummary(data: any) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`/tour/priceSummary`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn create booking
    generateRequestId(data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`/tour/booking/create`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    // fn make reverse tour
    makeReservationTour(data: any) {
        return new Promise((resolve, reject) => {
            return this._api
                .post('tour/booking', data)
                .then(
                    (response: any) => resolve(response),
                    (errors: any) => reject(errors)
                );
        });
    };

    //fn verify booking
    verifyBookingTour(code: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`/tour/booking/verify/${code}`)
                .then(
                    (response: any) => this.success(response, resolve, reject),
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get list tour hot
    getTourHot(offset: number = 0, limit: number = 10, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .customPOST('core/tour/tourhot', data, {
                    offset,
                    limit
                })
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get list tour popular
    getTourPopular(offset: number = 0, limit: number = 10, data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .customPOST('core/tour/tourpopular', data, {
                    offset,
                    limit
                })
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn update tour Hot
    updateTourHot(data: any = {}, id: string = '') {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourhot/update/${id}`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn update tour popular
    updateTourPopular(data: any = {}, id: string = '') {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourpopular/update/${id}`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn create tour Hot
    createTourHot(data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourhot/create`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn create tour popular
    createTourPopular(data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourpopular/create`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn create tour Hot
    deleteTourHot(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourhot/delete/${id}`, "")
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn create tour popular
    deleteTourPopular(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourpopular/delete/${id}`, "")
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get hash tag
    getHashTag(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .get(`core/tour/${id}/hashtag`)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn update hash tag
    updateHashTag(id: string, param: any) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/${id}/hashtag/update`, param)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get tour detail
    getDetailTour(code: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .get(`tour/detail/${code}`)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //get passenger info
    getPassengerInfoByBooking(id: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .get(`${urlTourCustomerReport}/update/passenger/${id}`)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //update passenger info
    updatePassengerInfo(id: string, data: any) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`${urlTourCustomerReport}/update/passenger/${id}`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        })
    }

    //fn get tour detail
    updateWeightImage(id: string, data: any) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/${id}/images/update`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get tour detail by serial code
    getTourBySerialCode(serialCode: string) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourose/info/${serialCode}`, "")
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get tour detail by serial code
    BookingTourByOSE(data: any = {}) {
        return new Promise((resolve, reject) => {
            return this._api
                .post(`core/tour/tourose/create`, data)
                .then(
                    (response: any) => {
                        this.success(response, resolve, reject);
                    },
                    (errors: any) => reject(errors)
                );
        });
    }

    //fn get tour flash deal
    getListFlashDealTour(offset: number, limit: number, body: any = {}): Observable<any> {
        return this._http.post(`core/tour/flashdeal`, body, {
            params: {
                offset: offset.toString(),
                limit: limit.toString()
            }
        }).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    getTourByCode(code: string): Observable<any> {
        return this._http.post(`core/tour/tourose/info/${code}`, "").pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );

    }

    createFlashDealTour(body: any = {}) {
        return this._http.post(`core/tour/flashdeal/create`, body).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    updateFlashDealTour(id: string, body: any = {}) {
        return this._http.post(`core/tour/flashdeal/update/${id}`, body).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    deleteFlashDealTour(id: string) {
        return this._http.post(`core/tour/flashdeal/delete/${id}`, {}).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    getListRecommendTour(offset: number, limit: number, body: any = {}): Observable<any> {
        return this._http.post(`core/tour/recommend/index`, body, {
            params: {
                offset: offset.toString(),
                limit: limit.toString()
            }
        }).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    createRecommendTour(body: any = {}) {
        return this._http.post(`core/tour/recommend/create`, body).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    updateRecommendTour(id: string, body: any = {}) {
        return this._http.post(`core/tour/recommend/${id}/update`, body).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    deleteRecommendTour(id: string): Observable<any> {
        return this._http.post(`core/tour/recommend/${id}/delete`, {}).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    getTourCategories(body: any = {}) {
        return this._http.post('core/tour/suggest/category', body).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    getDetailRecommedTour(id: string) {
        return this._http.post(`core/tour/recommend/${id}/detail`, {}).pipe(
            catchError((error) => Observable.throw(error)),
            map((data: any) => {
                return this.handleSuccess(data);
            })
        );
    }

    handleSuccess(data: any) {
        if (data.code === 'Success') {
            return data.data;
        } else {
            return new Error(data.errors[0]);
        }
    }
}
