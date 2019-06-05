import { Component } from '@angular/core';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '../../../../../../node_modules/@angular/forms';

import { CPATTERN } from '../../../../app.constants';
import { AppBase } from '../../../../app.base';
import { Account, AuthRepository, NotificationService, Error, EqualPasswordsValidator, Spinner } from '../../../../common';
import { Location } from '@angular/common';

import * as _ from 'lodash';
@Component({
    selector: './edit-account.component.ts',
    templateUrl: './edit-account.component.html'
})

export class EditAccountComponent extends AppBase {

    accountId: string = '';
    account: Account;
    roles: any[] = [];

    roleChecked: any[] = [];

    formUpdate: FormGroup;
    userName: AbstractControl;
    name: AbstractControl;
    password: AbstractControl;
    rePassword: AbstractControl;

    dataChangePassword: any;
    isChangePassword: boolean = false;


    constructor(private _activedRouter: ActivatedRoute,
        private _authRepo: AuthRepository,
        private _formBuilder: FormBuilder,
        private _notification: NotificationService,
        private _spinner: Spinner,
        private _location: Location
    ) {
        super();

    }

    ngOnInit() {

        this.getRole();

        //init isChange password
        this.dataChangePassword = [
            { title: 'Giữ nguyên mật khẩu', actived: true, value: false },
            { title: 'Cập nhật lại mật khẩu mới', actived: false, value: true },
        ]

        //init form
        this.initForm();
        this._activedRouter.params.subscribe((param: any) => {
            if (param.id) {
                this.accountId = param.id;
                this.getInfo(this.accountId);
            }
        });
    }

    //fn get account info
    async getInfo(id: string) {
        try {
            const dataFromServe: any = await this._authRepo.getInfo(id);
            this.account = new Account(dataFromServe.data);

            this.roleChecked = this.account.roles;
            this.initFormUpdate();

            this.formUpdate.controls['password'].clearValidators();
            this.formUpdate.controls['rePassword'].clearValidators();

        } catch (error) { }
    }

    checkisChecked(item: any) {
        return _.includes(this.roleChecked, item);
    }

    //init form update
    initFormUpdate() {
        this.formUpdate.setValue({
            name: this.account.fullName,
            userName: this.account.userName,
            password: "",
            rePassword: ""
        })
    }

    //fn init form
    initForm() {
        this.formUpdate = this._formBuilder.group({
            'name': [, Validators.compose([
                Validators.required,
                Validators.minLength(3)

            ])],
            'userName': [, Validators.compose([
                Validators.required,
                Validators.pattern(CPATTERN.EMAIL)
            ])],
            'password': [],
            'rePassword': [],
        });

        this.name = this.formUpdate.controls['name'];
        this.userName = this.formUpdate.controls['userName'];
        this.password = this.formUpdate.controls['password'];
        this.rePassword = this.formUpdate.controls['rePassword'];

    }

    //fn check is change password on radio button
    changePassword(item: any) {
        if (item.value) {
            this.isChangePassword = true;
            this.formUpdate.controls['password'].setValidators(Validators.compose([
                Validators.required,
                Validators.minLength(6)
            ]));
            this.formUpdate.controls['rePassword'].setValidators(Validators.compose([
                Validators.required,
                Validators.minLength(6),
                EqualPasswordsValidator.equalPassword('password')
            ]));
        }
        else {
            this.isChangePassword = false;
            this.formUpdate.controls['password'].clearValidators();
            this.formUpdate.controls['rePassword'].clearValidators();
            this.password.setValue("");
            this.rePassword.setValue("");
        }
    }

    //fn submit
    async onSubmit(data: any) {
        const body = {
            fullName: data.name,
            userName: data.userName,
            password: data.password || null,
            confirmPassword: data.rePassword || null,
            email: data.userName,
            roles: this.roleChecked
        }
        if (this.roleChecked.length === 0) {
            this._notification.pushToast('Chức vụ không được để trống', 'Vui lòng chọn chức vụ !', 'error', 2000);
            return;
        }

        try {
            this._spinner.show();

            const dataFromServe: any = await this._authRepo.update(this.accountId, body);
            this._spinner.hide();

            if (dataFromServe.code === 'Success') {
                this._notification.pushAlert('Cập nhật tài khoản thành công', '', 'success');
            }
            else {
                const error = new Error(_.head(dataFromServe.errors))
                this._notification.pushToast(`${error.value}`, 'Vui lòng kiểm tra lại', 'error');
            }

        } catch (error) { }
    }

    //fn ger roles
    async getRole() {
        try {
            const dataFromServe: any = await this._authRepo.getRole();
            this.roles = (dataFromServe.data || []);

        } catch (error) { }
    }

    //fn handle checkbox
    onHandleCheckBox(role: any, event: any) {
        if (event.target.checked)
            this.roleChecked.push(role);
        else {
            for (const item of this.roleChecked) {
                if (item === role) {
                    this.roleChecked.splice(_.findIndex(this.roleChecked, i => i === role), 1);
                }
            }
        }
    }

    //fn back
    back() {
        this._location.back();
    }

}