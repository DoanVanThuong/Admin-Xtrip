// Angular2 specified stuff
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Component specified stuff
import { CSECURITY, ROLE } from '../../app.constants';
import { GlobalState } from '../../global.state';
import { User } from '../entities';
import { AuthRepository } from "../repositories";
import { ApiService } from "../services/api.service";
import { StorageService } from "../services/storage.service";


@Injectable()
export class Security {

	protected static _currentUser: any;
	protected static _authToken;
	protected static _role: any = ''; // rempty - remove it
	public static goBackUrl = null;

	constructor(protected _router: Router,
		protected _state: GlobalState,
		protected _apiService: ApiService,
		protected _storage: StorageService,
		protected _authRepo: AuthRepository) {
	}

	// fn remove local storage
	protected removeLocalStorage() {
		this._storage.removeItem(CSECURITY.tokenName);
	}

	// fn set current user
	setCurrentUser = (params) => {
		if (!_.isEmpty(params)) {
			Security._currentUser = new User(params);
			this.setRole(Security._currentUser.roles);
		}
	};

	// fn sign in
	signin(params) {
		return new Promise((resolve, reject) => {
			this._authRepo.signin(params).then((response: any) => {
				if (response.code === 'Success') {

					Security._authToken = response.data.access_token;

					this._storage.setItem(CSECURITY.tokenName, Security._authToken, false);

					// Set the Request Header 'Authorization'
					this._apiService.setAuthToken(Security._authToken);

					resolve(this.auth());
				}
				else {
					reject(response);
				}
			});
		})
	}

	// fn request forgot password
	forgot(email) {
		return new Promise((resolve, reject) =>
			this._authRepo.forgot(email)
				.then(
					(response: any) => resolve(response.data),
					errors => reject(errors)
				)
		);
	}

	// Apply detail password
	newPassword(params) {
		return new Promise((resolve, reject) =>
			this._authRepo.newPassword(params).then(
				(response: any) => resolve(response.data),
				errors => reject(errors)
			)
		);
	}

	// fn sign out
	signout() {
		return new Promise((resolve, reject) => {
			this._authRepo.signout().then((response: any) => {
				if (response.code === 'Success') {
					Security._currentUser = null;
					Security._role = [];
					this._storage.removeItem(CSECURITY.tokenName);
					resolve(response);
				}
			});
		});
	}

	// Is the current user authenticated?
	isAuthenticated() {
		return !!Security._currentUser;
	}

	// fn request current user
	getCurrentUser() {
		return Security._currentUser;
	}

	// Ask the backend to see if a user is already authenticated - this may be from a previous session.
	auth() {
		return new Promise((resolve, reject) => {
			let authToken = this._storage.getItem(CSECURITY.tokenName, false);
			if (authToken) {
				this._authRepo.auth().then((response: any) => {
					this.setCurrentUser(response);
					resolve(response), error => {
					};
				});
			}
			else {
				resolve((data) => {
					this._router.navigate(['/sign-in']);
				})
			}
		})

	}
	// Ask the backend to see if a user is already authenticated - this may be from a previous session.
	requestCurrentUser() {
		return new Promise((resolve, reject) => {
			resolve(this.auth());
		})
	}

	// fn permission 
	isAdmin = () => {
		return this.isAuthenticated() && _.includes(Security._role, ROLE.ADMIN);
	};

	isBooker = () => {
		return this.isAuthenticated() && _.includes(Security._role, ROLE.BOOKER);
	};

	isDataEntry = () => {
		return this.isAuthenticated() && _.includes(Security._role, ROLE.DENTRY);
	};

	isCustomerService = () => {
		return this.isAuthenticated() && _.includes(Security._role, ROLE.CS);
	}

	isCashier = () => {
		return this.isAuthenticated() && _.includes(Security._role, ROLE.CASHIER);
	};

	isRole = (role: any) => {
		return this.isAuthenticated() && !Security._role;
	};

	setRole(role: any) {
		Security._role = role;
	}

	getRole() {
		return Security._role;
	}

	// Get auth token
	getToken() {
		return this._storage.getItem(CSECURITY.tokenName, false);
	}
}
