import { Component, EventEmitter, Output, ViewEncapsulation, Input } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { CouponSuggestRepo } from '../../../../../common/repositories/coupon-suggest.respository';
import { NotificationService, Spinner, Error } from '../../../../../common';
import * as _ from 'lodash';

@Component({
    selector: 'select-account',
    templateUrl: './select-account.component.html',
    styleUrls: ['./select-account.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class SelectAccountComponent extends AppBase {

    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    @Input() selectedAccounts: IAccount[] = [];
    accounts: IAccount[] = [];

    timeout: any = null;

    constructor(private _couponRepo: CouponSuggestRepo,
        private _notification: NotificationService,
        private _spinner: Spinner) {
        super();
    }

    ngOnInit() {
    }

    //fn select get suggest
    selectSuggest(account, keyword: string) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
            if (keyword.length > 0) {
                await this.getAccount(keyword);
                account.isShow = true;
            }
            else
                account.isShow = false;
        }, 500);
    }

    async getAccount(keyword: string) {
        this._spinner.show();
        try {
            const body = {
                keyword: keyword
            }
            const response: any = await this._couponRepo.getSuggestAccount(this.offset, this.limit, body);
            if (response.code === 'Success') {
                this.accounts = (response.data || []).map((account: IAccount) => {
                    return {
                        name: account.email,
                        userId: account.userId,
                        userName: account.userName,
                        email: account.email,
                        isSelected: false
                    }
                });

                //xóa trùng
                this.accounts = _.differenceBy(this.accounts, this.selectedAccounts, 'userId');
            }
            else {
                this.handleError(response.errors[0]);
            }
            this._spinner.hide();
        } catch (error) {
            this.handleError(error);
            this._spinner.hide();
        }
    }

    //fn select account
    selectAccount(account: IAccount, data: IAccount) {

        account.email = data.email;
        account.userId = data.userId;
        account.userName = data.userName;
        account.quantity = 1;
        account.subCode = data.subCode;
        account.isSelected = true;
        account.isShow = false;

        // this.selectedAccounts.push(account);
        this.onSelect.emit(this.selectedAccounts);

        //reset value
        this.accounts = [];
    }

    onAddAccount() {
        this.selectedAccounts.push(
            { email: '', subCode: '', quantity: 1, isSelected: true, userId: '', userName: '', isShow: false }
        )
    }
    //fn delete tour
    onDeleteAccount(index: number) {
        this.selectedAccounts.splice(index, 1);
    }

    //fn handle error
    handleError(errors: any) {
        this._notification.pushToast('Lỗi', new Error(errors).value, 'error', 3000);
    }
}

interface IAccount {
    email: string;
    quantity: number;
    subCode: string;
    userId: string;
    userName: string;
    isSelected?: boolean;
    isShow?: boolean;
}
