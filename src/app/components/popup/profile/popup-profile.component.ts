import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PopupBase } from '../popup.component';
import { AuthRepository, NotificationService, Error, Spinner } from '../../../common';

@Component({
    selector: 'profile-popup',
    templateUrl: './popup-profile.component.html',
})
export class ProfilePopupComponent extends PopupBase {

    @Input() data: any = null;
    @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();


    firstName: string = '';
    lastName: string = '';
    constructor(private _auth: AuthRepository,
        private _notification: NotificationService,
        private _spinner: Spinner,
    ) {
        super();
    }

    ngOnChanges() {
        if (!_.isNull(this.data)) {
            this.firstName = this.data.firstName;
            this.lastName = this.data.lastName;
        }
    }

    //fn update profile
    async updateProfile() {
        const body = {
            FirstName: this.firstName,
            LastName: this.lastName,
            PhoneNumber: ''
        }
        this._spinner.show();
        try {
            const dataFormServe: any = await this._auth.updateProfile(body);
            if (dataFormServe.code.toLowerCase() === 'success') {
                this._notification.pushAlert('Cập nhật tài khoản thành công', '', 'success', 3000);
                this.onUpdated.emit(true);
            }
            else {
                const err: Error = new Error(dataFormServe.errors[0])
                this._notification.pushToast(`${err.value}`, '', 'error', 5000);
            }

            this._spinner.hide();
            this.popup.hide();

        } catch (error) {
            this.popup.hide();
            const err: Error = new Error(error.errors[0])
            this._notification.pushToast(`${err.value}`, '', 'error', 5000);
            this._spinner.hide();
        }
    }

    //fn hide popup
    onPopupClose() {
        this.firstName = this.data.firstName;
        this.lastName = this.data.lastName;
    }
}
