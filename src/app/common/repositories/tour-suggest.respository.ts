import { Injectable } from '@angular/core';
import { ApiService } from '../services';

@Injectable()
export class TourSuggestRepository {

    constructor(protected _api: ApiService) {
    }

    getSuggestTransports() {
        return this._api.post(`/core/tour/suggest/transports`);
    }

    getSuggestAirlines(keyword: string) {
        const body = {
            keyword: keyword
        }
        return this._api.post(`/core/tour/suggest/airlines`, body);
    }

    getSuggestHotels(keyword: string) {
        const body = {
            keyword: keyword,
            hotelCode: null
        }
        return this._api.post(`/core/tour/suggest/hotels`, body);
    }

    getSuggestCategories(isInternational: boolean = false,keyword: string = '') {
        const body = {
            isInternational: isInternational,
            keyword: keyword
        }
        return this._api.post('core/tour/suggest/category', body);
    }

}
