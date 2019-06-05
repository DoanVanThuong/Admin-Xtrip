import { Component } from '@angular/core';
import { PopupBase } from '../popup.component';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthRepository } from '../../../common/repositories';
import { NotificationService, Spinner } from '../../../common/services';
import { Error } from '../../../common';

@Component({
    selector: 'change-password-popup',
    templateUrl: './popup-change-password.component.html',
})

export class ChangePasswordPopupComponent extends PopupBase {

    form: FormGroup;
    currentPassword: AbstractControl;
    newPassword: AbstractControl;

    constructor(private _formBuilder: FormBuilder,
        private _auth: AuthRepository,
        private _notification: NotificationService,
        private _spinner: Spinner) {
        super()

        this.form = this._formBuilder.group({
            currentPassword: [, Validators.compose([
                Validators.required,
                Validators.minLength(6)
            ])],
            newPassword: [, Validators.compose([
                Validators.required,
                Validators.minLength(6)
            ])]

        })

        this.currentPassword = this.form.controls.currentPassword;
        this.newPassword = this.form.controls.newPassword;

        this.form.valueChanges.subscribe((form) => {
            if ((!!form.newPassword && form.newPassword.length >= 6) && !!form.currentPassword) {
                this.newPassword.setErrors(form.currentPassword === form.newPassword ? { equalPassword: true } : null);
            }
        })
    }


    ngOnInit() { }

    //fn submit
    async submit(form: any) {
        this._spinner.show();
        try {
            const body = {
                CurrentPassword: form.currentPassword,
                NewPassword: form.newPassword,
            }
            const dataFormServe: any = await this._auth.change(body);
            if (dataFormServe.status) {
                this.popup.hide();
                this._notification.pushAlert('Cập nhật mật khẩu thành công', '', 'success', 3000);
            }
            else {
                this.popup.hide();

                const err: Error = new Error(dataFormServe.errors[0])
                this._notification.pushToast(`${err.value}`, '', 'error', 5000);
            }
            this._spinner.hide();

        } catch (error) {
            this.popup.hide();
            const err: Error = new Error(error.errors[0])
            this._notification.pushToast(`${err.value}`, '', 'error', 5000);
            this._spinner.hide();
        }

        this.form.reset();
    }

    //fn hide popup
    onPopupClose() {
        this.form.reset();

    }
}
