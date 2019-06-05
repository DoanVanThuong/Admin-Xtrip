import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppBase } from '../../../../app.base';
import { AuthRepository, StorageService, NotificationService, Error, Role, Spinner } from '../../../../common';
import { CSTORAGE, CPATTERN } from '../../../../app.constants';

@Component({
    selector: 'add-acount',
    templateUrl: './add-acount.component.html',
    styleUrls: ['./add-acount.less']
})

export class AddAccountComponent extends AppBase {
    roles: any[] = [];

    formCreate: FormGroup;
    name: AbstractControl;
    userName: AbstractControl;
    password: AbstractControl;

    selectedRole: any = null;
    roleChecked: string[] = [];

    constructor(private _authRepo: AuthRepository, private _formBuilder: FormBuilder, private _notification: NotificationService, private _location: Location, private _spinner: Spinner) {
        super();
    }

    ngOnInit() {
        this.getRole();
        this.initForm();
    }

    //fn init form
    initForm() {
        this.formCreate = this._formBuilder.group({
            'name': [, Validators.compose([
                Validators.required,
                Validators.minLength(3)

            ])],
            'userName': [, Validators.compose([
                Validators.required,
                Validators.pattern(CPATTERN.EMAIL)
            ])],
            'password': [, Validators.compose([
                Validators.required,
                Validators.minLength(6)
            ])],
        });

        this.name = this.formCreate.controls['name'];
        this.userName = this.formCreate.controls['userName'];
        this.password = this.formCreate.controls['password'];
    }

    //fn ger roles
    async getRole() {
        try {
            const dataFromServe: any = await this._authRepo.getRole();
            this.roles = dataFromServe.data || [];
            this.selectedRole = this.roles[0];

        } catch (error) { }
    }

    //fn submit
    async onSubmit(data: any) {
        const body = {
            fullName: data.name,
            userName: data.userName,
            password: data.password,
            confirmPassword: data.password,
            email: data.userName,
            roles: this.roleChecked
        }

        try {
            this._spinner.show();
            const dataFromServe: any = await this._authRepo.createAccount(body);
            this._spinner.hide();

            if (dataFromServe.code === 'Success') {
                this._notification.pushAlert('Thêm tài khoản thành công', '', 'success');
            }
            else {
                const error = new Error(_.head(dataFromServe.errors))
                this._notification.pushToast(`${error.value}`, 'Vui lòng kiểm tra lại', 'error');
            }

        } catch (error) { }
    }


    //handle checkBox
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

    //fn back to list account
    back() {
        this._location.back();
    }
}