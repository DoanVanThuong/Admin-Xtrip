import { Component } from '@angular/core';
import { NotificationService, Error, TransferFlight, FlightRepo, Spinner } from '../../../../common';
import { TYPE_TRANSFER } from '../../../../app.constants';

import swal from 'sweetalert2';
import { AppList } from '../../../../app.list';
@Component({
	selector: 'transfer-flight',
	templateUrl: './transfer-flight.component.html',
})

export class TransferFlightComponent extends AppList {
	transferFlights: TransferFlight[] = new Array<TransferFlight>();

	totalItemFlight: number;  //Tong so item tra ve

	transferFlightDetail: any = {};
	openSideBar: boolean = false;
	typeTransfer: TYPE_TRANSFER;

	constructor(private _flightRepo: FlightRepo, private _noti: NotificationService, private _spinner: Spinner) {

		super();
		this.request = this.getTransferFight;
	}

	ngOnInit() {
		this.getTransferFight();
	}

	//get ds chuyen khoan flight
	async getTransferFight() {
		this._spinner.show();
		const body = {
			Keyword: this.keyword,
			BookingDate: null
		}
		try {
			const respone: any = await this._flightRepo.getTransferFight((this.page - 1) * this.pageSize, this.limit, body);
			this.totalItemFlight = respone.data.total || 0;

			this.transferFlights = (respone.data.data || []).map(item => {
				const flight: TransferFlight = new TransferFlight(item);
				return flight;
			});
			this._spinner.hide();
		} catch (err) {
			const errs = new Error(err);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
		}

	}

	//xem chi tiet flight
	async showDetailFlight(id: string) {
		this._spinner.show();
		try {
			const response: any = await this._flightRepo.getDetailTransferFlight(id);
			this.transferFlightDetail = response.data.detail;

			if (this.openSideBar == false) {
				this.openSideBar = true;
				this.typeTransfer = TYPE_TRANSFER.FLIGHT;
				this._spinner.hide();
			}
		}
		catch (err) {
			const errs = new Error(err);
			this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);

		}
	}


	// confirm ck
	confirmTransferFlight(flight: TransferFlight) {
		this._noti.pushQuestion('Thông tin xác thực', `Tôi muốn xác thực, khách hàng <b>${flight.customerName}</b> đã chuyển khoản thành công`, true, 'OK', 'Hủy').then(async (result: any) => {
			if (result.value) {
				this._spinner.show();

				try {
					const data: any = await this._flightRepo.confirmTransferFlight(flight.id);
					this._spinner.hide();

					if (data.code == 'Success') {
						swal({ title: "Ok!", text: 'Xác thực chuyển khoản thành công', type: "success" }).then(() => {
							this.getTransferFight();
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
