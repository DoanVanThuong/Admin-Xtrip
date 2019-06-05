import { Component } from '@angular/core';
import { UtilityHelper } from '../../../../common/helpers/utility.helper';
import { ApiService, HotelRepo, NotificationService, Error, TransferHotel, Spinner } from '../../../../common';

import swal from 'sweetalert2';
import { TYPE_TRANSFER } from '../../../../app.constants';
import { AppList } from '../../../../app.list';

@Component({
	selector: 'transfer-hotel',
	templateUrl: './transfer-hotel.component.html',
})
export class TransferHotelComponent extends AppList {

	utility = new UtilityHelper();

	transferHotels: TransferHotel[] = new Array<TransferHotel>();
	totalItem: number;  //Tong so item tra ve

	transferHotelDetail: any = {};
	openSideBar: boolean = false;
	typeTransfer: TYPE_TRANSFER;

	constructor(private _api: ApiService, private _hotelRepo: HotelRepo, private _noti: NotificationService, private _spinner: Spinner) {
		super();
		this.request = this.getTransferHotel;
	}

	ngOnInit() {
		this.getTransferHotel();

	}

	async getTransferHotel() {
		this._spinner.show();
		const body = {
			Keyword: this.keyword,
			bookingDate: null
		}
		try {
			const respone: any = await this._hotelRepo.getTransferHotel((this.page - 1) * this.pageSize, this.limit, body);
			this.totalItem = respone.data.total || 0;

			this.transferHotels = (respone.data.data || []).map(item => {
				const hotel: TransferHotel = new TransferHotel(item);
				return hotel;
			});
			this._spinner.hide();

		} catch (err) {
			const errs = new Error(err);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);

		}

	}

	async showDetailHotel(id: string) {
		this._spinner.show();

		try {
			const response: any = await this._hotelRepo.getDetailTransfer(id);
			this.transferHotelDetail = response.data.detail;

			this.typeTransfer = TYPE_TRANSFER.HOTEL;

			if (!this.openSideBar) {
				this.openSideBar = true;
				this._spinner.hide();
			}
		}
		catch (err) {
			const errs = new Error(err);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);

		}
	}

	confirmTransferHotel(hotel: TransferHotel) {
		this._noti.pushQuestion('Thông tin xác thực', `Tôi muốn xác thực, khách hàng <b>${hotel.customerName}</b> đã chuyển khoản thành công`, true, 'OK', 'Hủy').then(async (result: any) => {
			if (result.value) {
				this._spinner.show();

				try {
					const data: any = await this._hotelRepo.confirmTransferHotel(hotel.id);
					this._spinner.hide();

					if (data.code == 'Success') {
						swal({ title: "Ok!", text: 'Xác thực chuyển khoản thành công', type: "success" }).then(() => {
							this.getTransferHotel();
						});
					}
					else
						this._noti.pushAlert('Có lỗi!', 'Xác thực chuyển khoản không thành công, vui lòng kiểm tra lại', 'error', 2000);
				}
				catch (err) {
					const errs = new Error(err);
					this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
				}
				//end catch
			}
		});

	}


}
