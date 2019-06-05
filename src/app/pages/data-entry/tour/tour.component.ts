import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourRepo, Error, NotificationService, Spinner, Tour } from '../../../common';
import { AppList } from '../../../app.list';
import * as moment from 'moment';
import { DepartDateTourPopupComponent } from '../../../components';
@Component({
	selector: 'data-entry-tour',
	templateUrl: './tour.component.html',
	styleUrls: ['./tour.less'],
	encapsulation: ViewEncapsulation.None
})

export class DataEntryTourComponent extends AppList {
	@ViewChild(DepartDateTourPopupComponent) departDatePopup: DepartDateTourPopupComponent;

	tours: Tour[] = new Array<Tour>();
	enable: boolean = false;
	showNumberOther: number = 2;
	showItemPriceCode: number = 3;
	departDates: any[] = [];

	selectedTour: Tour = null;

	constructor(private _router: Router,
		private _tourRepo: TourRepo,
		private _notificaiton: NotificationService,
		private _spinner: Spinner,
		private _noti: NotificationService,
		private _activedRoute: ActivatedRoute) {
		super();

		this.request = this.getListTour;
	}

	ngOnInit() {
		this._activedRoute.queryParams.subscribe((params: any) => {
			if (params.page) {
				this.page = parseInt(params.page);
			}
			if (params.size) {
				this.limit = parseInt(params.size);
			}
			this.getListTour();
		})
	}

	showTourTab() {
		this._router.navigate(['data-entry/tour/create']);
	}

	async getListTour() {
		this._spinner.show();
		const body = {
			keyword: this.keyword,
			sortBy: "",
			descending: false
		}
		try {
			const dataFormServe: any = await this._tourRepo.getListTour((this.page - 1) * this.pageSize, this.limit, body);
			this.total = dataFormServe.data.total || 0;
			this.tours = (dataFormServe.data.data || []).map((item: Tour) => {
				const tour: Partial<Tour> = {
					id: item.id,
					name: item.name,
					days: item.days,
					nights: item.nights,
					arrivalName: item.arrivalName,
					supplierName: item.supplierName,
					departureName: item.departureName,
					photo: item.photo,
					status: item.status,
					enabled: item.enabled,
					code: item.code,
					tourHot: item.tourHot,
					tourPopular: item.tourPopular,
					pricesCode: item.pricesCode,
					departDates: (item.departDates || []).map((date: string) => moment(date).format("DD/MM/YYYY")),
					categories: item.categories,
					showItemDepart: this.showNumberOther,
					showItemPriceCode: this.showItemPriceCode
				}
				return new Tour(tour);
			});
			this._spinner.hide();
		} catch (error) {
			const errs = new Error(error);
			this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
			this._spinner.hide();
		}
	}

	//hande checkbox enable/disable
	handleCheckboxEnableTour(enable, tour: Tour) {
		this.enableTour(tour.id, enable);
	}

	//fn ẩn, hiện tour
	async enableTour(id: string, enable: boolean) {
		this._spinner.show();
		try {
			const dataFormServe: any = await this._tourRepo.enableTour(id, enable);
			if (dataFormServe.code === 'Success') {
				if (enable) {
					this._notificaiton.pushAlert('Thành công', 'Tour đã được active', 'success');
				}
				if (!enable) {
					this._notificaiton.pushAlert('Thành công', 'Tour đã được ẩn', 'success');
				}
				this.getListTour();
			}
			else {
				if ((dataFormServe.errors[0].code) === 1000) {
					this._notificaiton.pushAlert('Tour không đủ dữ liệu để active', 'Vui lòng cập nhật thêm dữ liệu', 'error');
					this.getListTour();
				}
				else
					this._notificaiton.pushAlert('Có lỗi', 'Tour xóa không được! Vui lòng kiểm tra lại', 'error');
			}
		} catch (error) {
		}
		finally {
			this._spinner.hide();
		}
	}

	//fn on button delete tour
	onDeleteTour(tour: Tour) {
		this._notificaiton.pushQuestion(`Bạn có chắc muốn xóa tour? `, `${tour.name}`, true, 'Xóa', 'Hủy').then((value: any) => {
			if (value.value) {
				this.deleteTour(tour);
			}
		});
	}

	//fn clone tour
	onCloneTour(tour: Tour) {
		this._notificaiton.pushQuestion(`Bạn có chắc muốn copy tour? `, `${tour.name}`, true, 'Copy', 'Hủy').then((value: any) => {
			if (value.value) {
				this.copy(tour);
			}
		});
	}

	//fn delete tour
	async deleteTour(tour: Tour) {
		this._spinner.show();
		try {
			const dataFormServe: any = await this._tourRepo.deleteTour(tour.id);
			if (dataFormServe.code === 'Success') {
				this._notificaiton.pushAlert('Xóa tour thành công', `Tour ${tour.name} đã được xóa`, 'success');
				this.getListTour();
			}
			else {
				const errs = new Error(dataFormServe.errors[0]);
				this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
			}

		} catch (error) {
			const errs = new Error(error);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
		}
		finally{
			this._spinner.hide();
		}

	}

	//fn delete tour
	async copy(tour: Tour) {
		this._spinner.show();
		try {
			const dataFormServe: any = await this._tourRepo.copyTour(tour.id);
			if (dataFormServe.code === 'Success') {
				this._notificaiton.pushAlert('Copy tour thành công', `Tour ${tour.name} đã được thêm`, 'success');
				this.getListTour();
			}
			else {
				const errs = new Error(dataFormServe.errors[0]);
				this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
			}
		} catch (error) {
			const errs = new Error(error);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
		}
		finally {
			this._spinner.hide();
		}
	}

	// fn page changed
	pageChanged(event: any): void {
		if (this.page !== event.page || this.pageSize !== event.itemsPerPage) {
			this.page = event.page;
			this.pageSize = event.itemsPerPage;

			this.request(this.sort, this.order);
			this._router.navigate(['data-entry/tour'], {
				queryParams: {
					page: this.page,
					size: this.limit
				}
			});
		}
	};

	//on change limit
	onChangeLimitSize(number: number) {
		this.limit = number;
		this._router.navigate(['data-entry/tour'], {
			queryParams: {
				page: this.page,
				size: this.limit
			}
		});

	}

	showMoreItems(item: Tour) {
		this.selectedTour = item;
		this.departDates = this.selectedTour.departDates;
		if (this.departDates.length > this.showNumberOther ) {
			setTimeout(() => {
				this.departDatePopup.show();
			}, 100);
		} 
		
	}

	//fn copy clipboard
	onClipboardSuccess(e: any) {
		this._notificaiton.pushToast('Đã copy mã', `${e.content}`, 'success', 1000);
	}
}