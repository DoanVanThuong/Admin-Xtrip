import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalState } from './../../global.state';
import {
	Security,
	User,
} from './../../common/index';

@Component({
	selector: 'youvit-navbar',
	templateUrl: './navbar.html'
})

export class Navbar implements OnInit {

	user: User = new User();

	menu: any = [];

	constructor(protected _router: Router,
		protected _state: GlobalState,
		protected _route: ActivatedRoute,
		protected _security: Security) {

		this.user = _security.getCurrentUser();

		this._state.subscribe('security.isLogged', (currentUser: User) => {
			this.user = currentUser;
		});

		this._state.subscribe('security.loggedOut', () => {
			this.user = null;
		});

	}

	ngOnInit() {


	}

	// fn sign out
	onSignout = () => {

		let redirectTo = '';

		this._security
			.signout();
	};

	// mini sidebar
	miniNavigator = () => {
		$("body").toggleClass("mini-navbar");
		if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
			$('#side-menu').hide();
			setTimeout(
				function () {
					$('#side-menu').fadeIn(500);
				}, 100);
		} else if ($('body').hasClass('fixed-sidebar')) {
			$('#side-menu').hide();
			setTimeout(() => {
				$('#side-menu').fadeIn(500);
			}, 300);
		} else {
			$('#side-menu').removeAttr('style');
		}
	}

}
