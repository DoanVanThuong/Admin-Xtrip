import { ApiService, StorageService } from "../services/index";

export abstract class BaseRepository {

  constructor(protected _model: any,
    protected _resource: string,
    protected _storage: StorageService,
    protected _api: ApiService) {
    try {
      new this._model();
    } catch (e) {
      console.error('Model of ' + this.constructor.name + ' does not exist.');
    }
    if (!this._resource) {
      console.error('Resource of ' + this.constructor.name + ' does not exist');
    }
  }

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
  /***
   * Get Api
   *
   * @returns {ApiService}
   */
  api() {
    return this._api;
  }

  /**
   * Return a array elements of the resource
   *
   * @param {string} resource
   * @param {number} page
   * @param {number} pageSize
   * @param {string} sort
   * @param {string} order
   * @param data
   * @param {boolean} loading
   * @returns {Promise<any>}
   */
  getListByResource(resource: string, page: number, pageSize: number, sort: string, order: string, data: any, loading?: boolean) {
    return new Promise((resolve, reject) =>
      this._api
        .get(resource, this._api.getPagingParams(page, pageSize, sort, order, data), loading)
        .then(
          (response: any) => {
            response.data = response.data.map(item => new this._model(item));
            resolve(response);
          },
          errors => reject(errors)
        )
    );
  }

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
        .get(this._resource + '/' + id, this._api.getPagingParams(undefined, undefined, undefined, undefined, data))
        .then(
          (response: any) => resolve(new this._model(response.data)),
          errors => reject(errors)
        )
    );
  }

  /**
   * Return a array of all elements of the resource
   */
  all(params: any = {}) {
    return new Promise((resolve, reject) => {

      return this._api
        .all(this._resource, params)
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
  }

  /**
   * Return a array elements of the resource
   *
   * @param {number} page
   * @param {number} pageSize
   * @param {string} sort
   * @param {string} order
   * @param data
   * @param {boolean} loading
   * @returns {Promise<any>}
   */
  getList(page: number, pageSize: number, sort: string, order: string, data: any, loading?: boolean) {
    return this.getListByResource(this._resource, page, pageSize, sort, order, data, loading);
  }

  /**
   * Create a resource
   *
   * @param {Object} data
   */
  create(data: any = new Object()) {
    return new Promise((resolve, reject) =>
      this._api
        .post(this._resource, data)
        .then(
          (response: any) => resolve(new this._model(response.data)),
          errors => reject(errors)
        )
    );
  }

  /**
   * Update a resource
   *
   * @param model
   * @param {Object} data
   */
  update(model, data: Object) {
    let id;
    if (model instanceof Object) {
      id = model.id;
    } else {
      id = model;
    }

    return new Promise((resolve, reject) =>
      this._api
        .put(this._resource + '/' + id, data)
        .then(
          response => resolve(new this._model(response)),
          errors => reject(errors)
        )
    );
  }

  /**
   * Destroy a resource
   *
   * @param model
   * @param {boolean} loading
   * @returns {Promise<any>}
   */
  destroy(model, loading?: boolean) {
    let id;
    if (model instanceof Object) {
      id = model.id;
    } else {
      id = model;
    }

    return new Promise((resolve, reject) =>
      this._api
        .delete(this._resource + '/' + id, null, loading)
        .then(
          (response: any) => resolve(response.data),
          errors => reject(errors)
        )
    );
  }

  /**
   * Find a resource by an array of attributes
   *
   * @param {Object} $attributes
   */
  findByAttributes($attributes: Object) {

  }

  /**
   * Return a array of elements who's ids match
   *
   * @param {Object} $ids
   */
  findByMany($ids: Object) {

  }

  /**
   * Delete a resource by an array of attributes
   *
   * @param {Object} $attributes
   */
  destroyByAttributes($attributes: Object) {

  }
}
