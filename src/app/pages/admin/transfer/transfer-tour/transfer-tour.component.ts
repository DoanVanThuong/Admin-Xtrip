import { Component } from '@angular/core';
import { TourRepo, NotificationService, Error, TransferTour, Spinner } from '../../../../common';

import swal from 'sweetalert2';
import { TYPE_TRANSFER } from '../../../../app.constants';
import { AppList } from '../../../../app.list';
@Component({
	selector: 'transfer-tour',
	templateUrl: './transfer-tour.component.html',
})
export class TransferTourComponent extends AppList {

	transferTours: TransferTour[] = new Array<TransferTour>();
	totalItemTour: number;  //Tong so item tra ve

	transferTourDetail: any = {};

	openSideBar: boolean = false;
	typeTransfer: TYPE_TRANSFER;

	constructor(private _tourRepo: TourRepo, private _noti: NotificationService, private _spinner: Spinner) {
		super();
		this.request = this.getTransferTour;
	}

	ngOnInit() {
		this.getTransferTour();
	}

	//get ds ck tour
	async getTransferTour() {
		this._spinner.show();
		const body = {
			Keyword: this.keyword,
			BookingDate: null
		}
		try {
			const respone: any = await this._tourRepo.getTransferTour((this.page - 1) * this.pageSize, this.limit, body);
			this.totalItemTour = respone.data.total || 0;

			this.transferTours = (respone.data.data || []).map(item => {
				const tour: TransferTour = new TransferTour(item);
				return tour;
			});
			this._spinner.hide();


		} catch (err) {
			const errs = new Error(err);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);

		}
	}

	//xem chi tiet kh
	async showDetailTour(id: string) {
		this._spinner.show();

		try {
			const response: any = await this._tourRepo.getDetailTransfer(id);
			this.transferTourDetail = response.data.detail;

			if (this.openSideBar == false) {
				this.openSideBar = true;
				this.typeTransfer = TYPE_TRANSFER.TOUR;
				this._spinner.hide();
			}
		}
		catch (err) {
			const errs = new Error(err);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);

		}
	}

	//confirm ck
	confirmTransferTour(tour: TransferTour) {
		this._noti.pushQuestion('Thông tin xác thực', `Tôi muốn xác thực, khách hàng <b>${tour.customerName}</b> đã chuyển khoản thành công`, true, 'OK', 'Hủy').then(async (result: any) => {
			if (result.value) {
				this._spinner.show();

				try {
					const data: any = await this._tourRepo.confirmTransferTour(tour.id);
					this._spinner.hide();

					if (data.code == 'Success') {
						swal({ title: "Ok!", text: 'Xác thực chuyển khoản thành công', type: "success" }).then(() => {
							this.getTransferTour();
						});
					}
					else {
						const errs = new Error(data.errors[0]);
						this._noti.pushToast(`${errs.code === 1014 ? 'Tour đã hết chổ trống' : errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000)
					}

				}
				catch (err) {
					const errs = new Error(err);
					this._noti.pushToast(`${errs.code === 1014 ? 'Tour đã hết chổ trống' : errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000)
				}
				//end catch
			}
		});

	}

}
