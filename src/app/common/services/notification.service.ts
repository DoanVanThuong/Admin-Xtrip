import { Injectable } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertType } from 'sweetalert2';

@Injectable()
export class NotificationService {

	constructor() { }

	public swalConfig: SweetAlertOptions;
	public swalQuestionConfig: SweetAlertOptions;
	//SweetAlertType: success, error, warning
	pushToast(title: string, text: string, type: SweetAlertType, timer?: number, config?: SweetAlertOptions) {
		this.swalConfig = {
			title: title,
			text: text,
			type: type,
			position: 'top-right',
			toast: true,
			showConfirmButton: true,
			timer: timer
		};
		swal(Object.assign({}, this.swalConfig, config));
	}

	pushAlert(title: string, text: string, type: SweetAlertType, timer?: number, config?: SweetAlertOptions) {
		this.swalConfig = {
			title: title,
			text: text,
			type: type,
			timer: timer,
		}
		swal(Object.assign({}, this.swalConfig, config));
	}

	pushQuestion(title: string, text: string, showCancelButton: boolean, confirmButtonText: string, cancelButtonText: string, config?: SweetAlertOptions) {
		this.swalQuestionConfig = {
			title: title,
			html: text,
			type: 'warning',
			showCancelButton: showCancelButton,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: confirmButtonText,
			cancelButtonText: cancelButtonText,
			allowEnterKey: false
		};
		return new Promise((resolve, reject) => {
			resolve(swal(Object.assign({}, this.swalQuestionConfig)));
		});
	}

}
