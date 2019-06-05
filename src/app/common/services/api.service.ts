//=== Reference: http://ngx-restangular.com/
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Error } from './../entities/error';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_STORAGE: any = {
	authToken: null,
};

@Injectable()
export class ApiService {
	constructor(protected _restangular: Restangular, private _http: HttpClient) {
	}

	setAuthToken(authToken) {
		
		API_STORAGE.authToken = `Bearer ${authToken}`;
	}

	getAuthToken() {
		return API_STORAGE.authToken;
	}

	getPagingParams(page?: number, pageSize?: number, sort?: string, order?: string, data?: any, isEncode?: boolean) {
		let params = {
			timezoneOffset: new Date().getTimezoneOffset(),
		};

		if (!_.isUndefined(page)) {
			params['page'] = page;
		}
		if (!_.isUndefined(pageSize)) {
			params['pageSize'] = pageSize;
		}
		if (!_.isUndefined(sort)) {
			params['sort'] = sort;
		}
		if (!_.isUndefined(order)) {
			params['order'] = order;
		}
		if (!_.isEmpty(data)) {
			if (isEncode === false) {
				_.each(data, function (val, key) {
					params[key] = val;
				});
			} else {
				params['data'] = encodeURIComponent(JSON.stringify(data));
			}
		}

		return params;
	}

	private handleSuccess(response: any, resolve) {
		resolve(response.data.data);
	}

	private handleError(response: any, reject) {
		let errors = [];
		let data = response.data;
		if (_.isObject(data) && _.isArray(data.errors)) {
			data.errors.forEach(function (error) {
				errors.push(new Error(error));
			});
		} else {
			errors.push(new Error({
				errorMessage: response.statusText,
			}));
		}
		reject(errors);
	}

	// Method
	setBaseUrl = (url: string = '') => {
		this._restangular.provider.setBaseUrl(url);

		return this;
	}

	all(resource, params?: Object, showSpinner?: boolean) {
		return new Promise((resolve, reject) => {

			return this._restangular
				.all(resource)
				.getList(params)
				.subscribe(
					(response: any) => this.handleSuccess(response, resolve),
					(response: any) => this.handleError(response, reject)
				);
		});
	}

	get(resource, params?: Object, showSpinner?: boolean) {
		return new Promise((resolve, reject) => {
			this._restangular
				.all(resource)
				.customGET('', Object.assign({}, params))
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject)
				);
		});
	}

	download(resource: string, params?: Object) {
		return new Promise((resolve, reject) => {
			this._restangular
				.one(resource)
				.withHttpConfig({ responseType: 'arraybuffer' })
				.post('', params)
				.subscribe(
					response => this.handleSuccess(response, resolve),
					response => this.handleError(response, reject)
				);
		});
	}

	post(resource: string, params?: Object) {
		return new Promise((resolve, reject) => {
			this._restangular
				.one(resource)
				.post('', params, {})
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject)
				);
		});
	}

	customPOST(resource: string, data?: Object, params?: Object) {
		return new Promise((resolve, reject) => {
			this._restangular
				.all(resource)
				.customPOST(data, null, params)
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject)
				);
		});
	}

	postFormData(resource: string, formData: FormData) {
		return new Promise((resolve, reject) => {
			this._restangular.all(resource)
				.customPOST(formData, undefined, undefined, { 'Content-Type': undefined })
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject))
		});
	}

	uploadImage(resource: string, formData: FormData, module: string, path: string) {
		return new Promise((resolve, reject) => {
			this._restangular.all(resource)
				.customPOST(formData, undefined, undefined, { 'Content-Type': undefined, Module: module, Path: path })
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject))
		});
	}


	put(resource: string, params?: Object, showSpinner?: boolean) {
		return new Promise((resolve, reject) => {
			return this._restangular.one(resource)
				.customPUT(params, '')
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject))
		});
	}

	patch(resource: string, params?: Object, showSpinner?: boolean) {
		return new Promise((resolve, reject) => {
			this._restangular.one(resource)
				.patch(params)
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject))
		});
	}

	delete(resource: string, params?: any, showSpinner?: boolean) {
		return new Promise((resolve, reject) => {
			this._restangular.one(resource)
				.remove(Object.assign({}, params))
				.subscribe(
					(response) => this.handleSuccess(response, resolve),
					(response) => this.handleError(response, reject))
		});
	}

	//fn call API using HttpClient
	callAPI(method: string, url: string, data?: any) {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const body: any = data && JSON.stringify(data);
		
		return this._http.request(new HttpRequest(method, `${url}`,body ,{
			headers: headers,
		}));
	};
}
