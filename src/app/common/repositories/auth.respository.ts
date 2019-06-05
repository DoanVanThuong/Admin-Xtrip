import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ApiService } from "../services/api.service";
import { StorageService } from '../services/storage.service';

const urlCoreAccount = 'core/management/user';
@Injectable()
export class AuthRepository {

	protected _resource = '';

	constructor(protected _api: ApiService, private _localStorage: StorageService) {
	}

	// Check login
	auth() {
		return this._api.get('account/profile');
	}

	// fn update profile
	updateProfile = (data: any = {}) => {
		return new Promise((resolve, reject) => {
			return this._api
				.put('/account/profile', data)
				.then(
					(response: any) => {
						if (response.status) {
							resolve(response);
						} else {
							reject(response.errors);
						}
					},
					(errors: any) => reject(errors)
				);
		});
	};

	// fill data to profile
	fillData = (params?: any) => {
		return this._api.put(this._resource + '/fill-data', params);
	};

	// upload to profile
	upload = (file?: any) => {
		return new Promise((resolve, reject) => {
			let fd = new FormData();
			fd.append('file', file);

			return this._api
				.postFormData(this._resource + '/upload', fd)
				.then(
					(response: any) => resolve(response.data),
					errors => reject(errors)
				);
		});
	};

	// Signin by username or email and password
	signin = (params?: any) => {
		return this._api
			.post('account/login/local', params);
	};

	signup(params?: any) {
		return this._api.post(this._resource + '/register', params);
	}

	oauth(provider: string, accessToken: string) {
		let dataParams = {
			'access_token': accessToken,
			'driver': provider,
			'grant_type': 'social',
			'client_id': environment.OAUTH.CLIENT_ID,
			'client_secret': environment.OAUTH.CLIENT_SECRET,
		};
		return this._api
			.post(this._resource + '/' + provider, dataParams);
	}

	// fn oauth sign up
	oauthSignUp(country_id: number, phoneNumber: string, provider: string, accessToken: string) {
		let dataParams = {
			'country_id': country_id,
			'phone_number': phoneNumber,
			'access_token': accessToken,
			'driver': provider,
			'grant_type': 'social',
			'client_id': environment.OAUTH.CLIENT_ID,
			'client_secret': environment.OAUTH.CLIENT_SECRET,
		};

		return this._api.post(this._resource + '/' + provider + '/signUp', dataParams);
	}

	// fn forgot
	forgot(email: string) {
		return new Promise((resolve, reject) => {
			return this._api
				.post(this._resource + '/forgot', {
					email: email
				})
				.then(
					(response: any) => resolve(response.data),
					(errors: any) => reject(errors)
				);
		})

	}

	// fn change password
	change(params: any) {
		return new Promise((resolve, reject) => {
			return this._api.post('/account/password/change', params)
				.then(
					(response: any) => resolve(response),
					(errors: any) => reject(errors)
				);
		});
	}

	// fn reset password
	newPassword(params) {
		return this._api.put(this._resource + '/reset', params);
	}

	signout() {
		return this._api.post('account/logout');
	}

	//get list
	getListUser(offset: number = 0, limit: number = 10, data: any = {}) {
		return this._api.customPOST(`${urlCoreAccount}/list`, data, {
			offset: offset,
			limit: limit
		});
	}

	//fn get roles
	getRole() {
		return this._api.post(`${urlCoreAccount}/role`, "");
	}

	//fn create account
	createAccount(body: any) {
		return this._api.post(`${urlCoreAccount}/create`, body);
	}

	//fn delete account
	deleteAccount(id: string) {
		return this._api.post(`${urlCoreAccount}/delete/${id}`);
	}

	//fn enable Account
	enableAccount(id: string) {
		return this._api.post(`${urlCoreAccount}/enable/${id}`);
	}

	//get Account info
	getInfo(id: string) {
		return this._api.post(`${urlCoreAccount}/detail/${id}`);
	}

	//fn update account 
	update(id: string, body: any) {
		return this._api.post(`${urlCoreAccount}/update/${id}`, body);
	};

}
