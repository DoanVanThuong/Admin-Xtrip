import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalState } from './../../global.state';
import { Security, User, AuthRepository, } from './../../common/index';
import { AppBase } from "../../app.base";
import { StorageService } from "../../common/services/storage.service";
import { ProfilePopupComponent, ChangePasswordPopupComponent } from '../../components';

@Component({
	selector: '[app-header]',
	templateUrl: './header.html',
})

export class Header extends AppBase {

	@ViewChild(ProfilePopupComponent) profilePopup: ProfilePopupComponent;
	@ViewChild(ChangePasswordPopupComponent) changePWPopup: ChangePasswordPopupComponent;

	currentUser: User = null;
	fullName: string = '';
	emailName: string = '';

	constructor(protected _router: Router,
		protected _state: GlobalState,
		protected _route: ActivatedRoute,
		protected _storage: StorageService,
		protected _security: Security,
		protected _auth: AuthRepository) {
		super();

		if (this._security.isAuthenticated()) {
			this.currentUser = this._security.getCurrentUser();
			this.emailName = this.currentUser.email.substring(0, this.currentUser.email.indexOf('@'));
			this.fullName = (!this.currentUser.firstName ? '' : this.currentUser.firstName) + ' ' + (!this.currentUser.lastName ? '' : this.currentUser.lastName);

		}

		this._state.subscribe('security.isLogged', (currentUser: User) => {
			this.currentUser = currentUser;

		});

		this._state.subscribe('security.loggedOut', () => {
			this.currentUser = null;
		});
	}

	//fn open profile popup
	openProfilePopup() {
		this.profilePopup.show();
	}

	//fn openChangePassword popup
	openChangePasswordPopup() {
		this.changePWPopup.show();
	}

	//fn logout
	logout() {
		this._security.signout().then((response: any) => {
			if (response.code === 'Success') {
				this._router.navigateByUrl("/sign-in");
			}
		});
	}

	//fn check updated Profile
	async onUpdateUserProfile(checked: boolean) {
		if (checked) {
			this.currentUser = new User(await this._auth.auth());
			this.fullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
		}
	}
}
