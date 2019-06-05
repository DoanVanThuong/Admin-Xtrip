import { Component } from '@angular/core';
import { AuthRepository, NotificationService, Account, Error, Spinner } from '../../../../common';
import { AppList } from '../../../../app.list';
import { Router } from '@angular/router';

@Component({
    selector: 'account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.less']

})

export class InternalAccountListComponent extends AppList {

    accounts: Account[] = new Array<Account>();

    constructor(private _AuthRepo: AuthRepository, private _route: Router, private _notificaiton: NotificationService, private _spinner: Spinner) {
        super();
        this.request = this.getAccountList;
    }

    ngOnInit() {
        this.getAccountList();
    }

    async getAccountList() {
        this._spinner.show();

        const body = {
            searchField: null, // Search theo field name
            searchValue: null, // SearchValue giá trị muốn search, cho phép nhiều giá trị searchValue ngăn cách bằng dấu ,
            orderBy: "stt", //Sắp xếp theo field nào
            sort: 1 // Tăng dần (1) hay giảm dần (-1)
        }
        try {
            const dataFromServe: any = await this._AuthRepo.getListUser((this.page - 1) * this.pageSize, this.limit, body);
            this.total = dataFromServe.data.total || 0;
            this._spinner.hide();

            this.accounts = (dataFromServe.data.result || []).map(item => new Account(item));

        } catch (error) { }
    }

    createAccount() {
        this._route.navigate(['admin/internal/create']);
    }

    //fn delete account
    onDelete(account: Account) {
        this._notificaiton.pushQuestion(`Bạn có chắc muốn tài khoản `, `${account.userName}`, true, 'Xóa', 'Hủy').then((value: any) => {
            if (value.value) {
                this.deleteAccount(account);
            }
        })
    }

    //fn delete
    async deleteAccount(account: Account) {
        try {
            const dataFormServe: any = await this._AuthRepo.deleteAccount(account.id);
            if (dataFormServe.code === 'Success') {
                this._notificaiton.pushAlert('Xóa tài khoản thành công', `Tài khoản ${account.userName} đã được xóa`, 'success');
                this.getAccountList();
            }
            else {
                this._notificaiton.pushAlert('Có lỗi', 'Tài khoản xóa không được! Vui lòng kiểm tra lại', 'error');
            }

        } catch (error) { }
    }

    //fn 
    handleCheckboxEnableAccount(enable: boolean, account: Account) {
        this.enableAccount(account.id, enable);
    }

    //fn enable account
    async enableAccount(id: string, enable: boolean) {
        try {
            const dataFormServe: any = await this._AuthRepo.enableAccount(id);
            if (dataFormServe.code === 'Success') {
                if (enable) {
                    this._notificaiton.pushAlert('Thành công', 'Tài khoản đã được active', 'success');
                }
                if (!enable) {
                    this._notificaiton.pushAlert('Thành công', 'Tài khoản đã được tạm ngưng', 'success');
                }
            }
            else {
                const error = new Error(_.head(dataFormServe.errors))
                this._notificaiton.pushToast(`${error.value}`, 'Vui lòng kiểm tra lại', 'error');
            }
            this.getAccountList();

        } catch (error) { }
    }

    //fn edit Account
    onEdit(account: Account) {
        this._route.navigateByUrl(`admin/internal/edit/${account.id}`);
    }
}