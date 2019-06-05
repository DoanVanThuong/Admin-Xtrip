import { Component } from '@angular/core';
import { Security } from '../../common/security/security';
import { Helpers } from '../../helpers';
import { Router, NavigationEnd } from '@angular/router';
@Component({
	selector: '[app-sidebar]',
	templateUrl: './sidebar.html'
})
export class Sidebar {
	url: string = '';
	menuArr: any = [];

	constructor(private _router: Router, private _security: Security) {
	}

	ngOnInit() {
		this.setUpMenu();
		this._router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.url = event.url;
			}
		});
	}

	//fn logout
	logout() {
		this._security.signout().then((response: any) => {
			if (response.code === 'Success') {
				this._router.navigateByUrl("/sign-in");
			}

		});

	}

	ngAfterViewInit() {
		Helpers.initLayout();
	}

	//fn get user logged
	getUserLogged() {
		return this._security.getCurrentUser();
	}

	//fn setup menu
	setUpMenu() {
		if (this._security.isAdmin()) {
			const menuAdmin = {
				title: "Admin",
				icon: 'fa fa-bar-chart',
				active: true,
				submenu: [
					{ title: 'Khách hàng', icon: 'fa fa-male', url: '/admin/customer' },
					{ title: 'Xuất vé', icon: 'fa fa-ticket', url: '/admin/ticket' },
					{ title: 'D/S Chuyển khoản', icon: 'fa fa-list-ul', url: '/admin/payment' },
					{ title: 'Mã khuyến mãi', icon: 'fa fa-money', url: '/admin/coupon' },
					{ title: 'Điểm thưởng', icon: 'fa fa-trophy', url: '/admin/reward-point' },
				]
			};
			const menuInternal =
			{
				title: "Quản lý tài khoản",
				icon: 'fa fa-users',
				active: true,
				submenu: [
					{ title: 'Nội bộ Xtravel', icon: 'fa fa-user-plus', url: '/admin/internal' },
				]
			};

			const menuConstruction =
			{
				title: "Quản lý mã công trình",
				icon: 'fa fa-wrench',
				active: true,
				submenu: [
					{ title: 'Mã công trình', icon: 'fa fa-building', url: '/admin/construction' },
				]
			};
			
			this.menuArr.push(menuAdmin, menuInternal, menuConstruction);
		}

		if (this._security.isCustomerService()) {
			const menuCS = {
				title: "CS",
				icon: 'fa fa-volume-control-phone',
				active: true,
				submenu: [
					{ title: 'Khách hàng', icon: 'fa fa-male', url: '/cs/customer' },
					{ title: 'Tra cứu', icon: 'fa fa-search', url: '/cs/search' },
				]
			};
			this.menuArr.push(menuCS);
		}

		if (this._security.isBooker()) {
			const menuBooker = {
				title: "Booker",
				icon: 'fa fa-ticket',
				active: true,
				submenu: [
					{ title: 'Khách hàng', icon: 'fa fa-male', url: '/booker/customer' },
					{ title: 'D/S xuất vé', icon: 'fa fa-list-ul', url: '/booker/ticket' },
				]
			};
			this.menuArr.push(menuBooker);
		}

		if (this._security.isDataEntry()) {
			const menuDentry = {
				title: "Data Entry",
				icon: 'fa fa-keyboard-o',
				active: true,
				submenu: [
					{ title: 'Danh sách tour', icon: 'fa fa-list', url: '/data-entry/tour' },
					{ title: 'Extra tour', icon: 'fa fa-globe', url: '/data-entry/extra-tour' },
					{ title: 'Extra activity', icon: 'fa fa-ticket', url: '/data-entry/extra-activity' },

				]
			};
			this.menuArr.push(menuDentry);

		}

		if (this._security.isCashier()) {
			const menuCashier = {
				title: "Thu ngân",
				icon: 'fa fa-money',
				active: true,
				submenu: [
					{ title: 'Khách hàng', icon: 'fa fa-male', url: '/cashier/customer' },
					{ title: 'Phiếu thu', icon: 'fa fa-credit-card-alt', url: '/cashier/receipt' },
					{ title: 'Hàng bán trả', icon: 'fa fa-repeat', url: '/cashier/order-refund' },
				]
			}
			this.menuArr.push(menuCashier);
		}
	}

	// fn toggle menu
	toggleMenu = (state: string) => {
		if (this.url.indexOf(state) !== -1) {
			return true;
		}
		return false;
	};

	// fn active route
	activeRoute = (router: string = '') => {
		let custome = '#' + this.url;

		if (custome === router) {
			return true;
		}

		return false;
	};
}
