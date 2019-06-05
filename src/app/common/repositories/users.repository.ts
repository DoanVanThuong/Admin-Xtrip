import {Injectable} from '@angular/core';

import {ApiService, StorageService} from './../services/index';
import {User} from "../entities/index";
import {BaseRepository} from "./base.repository";
import {resource} from "selenium-webdriver/http";

@Injectable()
export class UsersRepository extends BaseRepository {

  _resource: '/admin/users';

  constructor(storage: StorageService, _api: ApiService) {
    super(User, 'admin/users', storage, _api);
  }

  allHR = (params: any) => {
    return new Promise((resolve, reject) => {

      return this._api
        .all(this._resource + `/hr`, params)
        .then(
          (response: any) => {
            if (response.data.data) {
              // paging
              response.data.data = response.data.data.map(item => new this._model(item));
            } else {
              response.data = response.data.map(item => new this._model(item));
            }
            resolve(response.data)
          },
          (errors: any) => reject(errors)
        );
    });
  };

  /**
   * Find a resource by an id
   *
   * @param id
   * @param {Object} data
   * @returns {Promise<any>}
   */
  find(id, data?: Object) {
    return new Promise((resolve, reject) =>
      this._api
        .get(this._resource + `/${id}`)
        .then(
          (response: any) => resolve(new this._model(response.data)),
          errors => reject(errors)
        )
    );
  }

  // fn get suggest list
  suggest(params: any = Object, options: any = {
    order: 'name',
    order_by: 'asc'
  }) {
    return new Promise((resolve, reject) => {

      return this._api
        .all(this._resource + '/suggest', Object.assign(params, options), false)
        .then(
          (response: any) => {
            resolve(response.data)
          },
          (errors: any) => reject(errors)
        );
    });
  }

  // upload profile
  upload = (id: any, file: any) => {
    return new Promise((resolve, reject) => {

      let fd = new FormData();
      fd.append('file', file);

      return this._api
        .postFormData(this._resource + "/" + id, fd)
        .then(
          (response: any) => resolve(new this._model(response)),
          (errors: any) => reject(errors)
        );
    });
  };

  // switch user role
  switchType(model: User, role: string = 'employee') {

    let id;
    if (model instanceof Object) {
      id = model.id;
    } else {
      id = model;
    }

    return new Promise((resolve, reject) =>
      this._api
        .post(this._resource + `/${id}/role/${role}`)
        .then(
          (response: any) => resolve(new this._model(response.data)),
          errors => reject(errors)
        )
    );
  };

  // active profile
  active(model: User, action: string = 'activated') {

    let id;
    if (model instanceof Object) {
      id = model.id;
    } else {
      id = model;
    }

    return new Promise((resolve, reject) =>
      this._api
        .post(this._resource + `/${id}/${action}`)
        .then(
          (response: any) => resolve(new this._model(response.data)),
          errors => reject(errors)
        )
    );
  }

  // fn import csv
  import = (file: any) => {
    return new Promise((resolve, reject) => {

      let fd = new FormData();
      fd.append('file', file);

      return this._api
        .postFormData(this._resource + `/import`, fd)
        .then(
          (response: any) => resolve(response.data),
          (errors: any) => reject(errors)
        );
    });
  };

  // fn export excel
  export = (params: any = Object) => {

    return new Promise((resolve, reject) => {
      this._api
        .download(this._resource + `/export`, params)
        .then(
          (response: any) => resolve(response),
          errors => reject(errors)
        )
    });
  };

  // fn export hr excel
  exportHR = (params: any = Object) => {
    return new Promise((resolve, reject) => {
      this._api
        .download(this._resource + `/hr/export`, params)
        .then(
          (response: any) => resolve(response),
          errors => reject(errors)
        )
    });
  };
}
