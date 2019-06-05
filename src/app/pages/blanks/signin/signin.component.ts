import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { EmailValidator, Security, Error, StorageService, NotificationService, Spinner, } from '../../../common';

import { AppForm } from '../../../app.form';
import { GlobalState } from '../../../global.state';
import { Restangular } from 'ngx-restangular';
import { REMEMBER, ROLE } from '../../../app.constants';

@Component({
	selector: 'admin-signin',
	templateUrl: './signin.html',
	styleUrls: ['./sign-in.less']
})
export class Signin extends AppForm {

	showPassword: boolean = false;

	form: FormGroup;
	email: AbstractControl;
	password: AbstractControl;

	loginStatus: boolean = false;
	isShow: boolean = false;
	remember: boolean = true;
	error: { email: any, password: any } = { email: '', password: '' };

	constructor(fb: FormBuilder,
		private _localStorage: StorageService,
		protected _router: Router,
		protected _state: GlobalState,
		private _notification: NotificationService,
		protected _restangular: Restangular,
		protected _security: Security,
		private _spinner: Spinner) {
		super();

		this.form = fb.group({
			'email': [, Validators.compose([
				Validators.required,
				EmailValidator.validate
			])],
			'password': [, Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(36),
			])]
		});

		this.email = this.form.controls['email'];
		this.password = this.form.controls['password'];

		this.showValid = false;
	}

	// init
	ngOnInit() {
		const isHaveRememberEmail = this._localStorage.getItem(REMEMBER.EMAIL, false);
		if (isHaveRememberEmail) {
			this.form.controls["email"].setValue(isHaveRememberEmail);
		}

	}

	checkRemember() {
		this.remember = !this.remember;
	}

	onSubmit(param: any) {
		this._spinner.show();
		this.showValid = true;

		this.error = { email: '', password: '' };
		const body = {
			username: param.email,
			password: param.password,
		}

		this._security.signin(body).then((res: any) => {
			this._spinner.hide();

			if (res.id) {

				if (this.remember) {
					this._localStorage.setItem(REMEMBER.EMAIL, param.email, false);
				}
				else {
					this._localStorage.removeItem(REMEMBER.EMAIL);
				}
				if (this._security.isAuthenticated()) {

					this._state.notifyDataChanged("security.isLogged", this._security.getCurrentUser());
					this._security.getCurrentUser();

					const role = this._security.getRole();
					if (_.includes(role, ROLE.ADMIN)) {
						this._router.navigate(['admin/customer']);
						return;
					}
					if (_.includes(role, ROLE.BOOKER)) {
						this._router.navigate(['booker/customer']);
						return;
					}
					if (_.includes(role, ROLE.DENTRY)) {
						this._router.navigate(['data-entry/tour']);
						return;
					}
					if (_.includes(role, ROLE.CS)) {
						this._router.navigate(['cs/customer']);
						return;
					}
					if (_.includes(role, ROLE.CASHIER)) {
						this._router.navigate(['cashier/customer']);
						return;
					}
					else {
						this._notification.pushToast('Tài khoản hoặc mật khẩu không đúng', 'Vui lòng kiểm tra lại', 'error', 2000);
					}
				}
			}
			else {
				this._notification.pushToast('Tài khoản hoặc mật khẩu không đúng', 'Vui lòng kiểm tra lại', 'error', 2000);
			}
		}).catch((errors: any) => {
			const error: Error = new Error(_.head(errors.errors));
			this._notification.pushToast(`${error.value}`, 'Vui lòng kiểm tra lại', 'error', 2000);
			this._spinner.hide();
		});

	}

	// fn handle error
	private handleError = (errors: Array<Error> = []): void => {
		let self = this;

		errors.forEach(function (error: Error, index: number) {
			switch (error.errorCode) {
				case 3000:
				case 3001:
				case 3003:
				case 3019:
				case 3020:
				case 3021:
				case 3022: {
					self.error.email = error.errorMessage;
					break;
				}
				case 3023:
				case 3024:
				case 3025:
				case 3026:
				case 3029: {
					self.error.password = error.errorMessage;
				}
			}
		});
	}

}