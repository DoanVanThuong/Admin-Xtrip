import { Injectable } from '@angular/core';
import { ApiService } from '../services';
import { BaseRepository } from './base.repository';
import { Country } from '../entities';

@Injectable()
export class GlobalRepo extends BaseRepository {

  constructor(_api: ApiService) {
    super(Country, 'admin', null, _api);
  }

  // fn get countries
  getCountries() {
    return new Promise((resolve, reject) => {
      return this._api
        .get('global/countries')
        .then(
          (res: any) => resolve(res),
          (errors: any) => reject(errors)
        );
    });
  };

  //get construction code
  getListConstructionCode(offset: number = 0, limit: number = 10, data: any = {}) {
    return new Promise((resolve, reject) => {
      return this._api.customPOST('core/management/serial/list', data, {
        offset: offset,
        limit: limit
      }).then(
        (response: any) => {
          this.success(response, resolve, reject);
        },
        (errors: any) => reject(errors)
      );
    });
  }

  //fn create construction code
  createConstructionCode(data: any= {}){
    return new Promise((resolve, reject) => {
      return this._api.post('core/management/serial/create', data).then(
        (response: any) => {
          this.success(response, resolve, reject);
        },
        (errors: any) => reject(errors)
      );
    });
  }

  //fn get detail construction code
  getDetailConstructionCode(id: string) {
    return new Promise((resolve, reject) => {
      return this._api.post(`core/management/serial/detail/${id}`).then(
        (response: any) => {
          this.success(response, resolve, reject);
        },
        (errors: any) => reject(errors)
      );
    });
  }

  //fn update construction code
  updateConstructionCode(data: any = {}, id: string) {
    return new Promise((resolve, reject) => {
      return this._api.post(`core/management/serial/update/${id}`, data).then(
        (response: any) => {
          this.success(response, resolve, reject);
        },
        (errors: any) => reject(errors)
      );
    });
  }
}
