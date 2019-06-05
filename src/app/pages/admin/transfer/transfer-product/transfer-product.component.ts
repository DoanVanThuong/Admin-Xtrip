import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { TransferProduct, NotificationService, ProductRepo, Spinner, Error, ProductBookingDetail } from '../../../../common';
import { TYPE_TRANSFER } from '../../../../app.constants';

@Component({
    selector: 'transfer-product',
    templateUrl: './transfer-product.component.html',
})

export class TransferProductComponent extends AppList {

    productsTransfer: TransferProduct[] = new Array<TransferProduct>();
    productBookingDetail: any = {};

    isOpenSideBar: boolean = false;

    typeBooking: string = '';

    constructor(private _noti: NotificationService,
        private _productRepo: ProductRepo,
        private _spinner: Spinner) {
        super();
        this.request = this.getPaymentTransfer;
    }

    ngOnInit() {
        this.getPaymentTransfer();
    }

    //get ds chuyen khoan flight
    async getPaymentTransfer() {
        this._spinner.show();
        const body = {
            Keyword: this.keyword,
            BookingDate: null
        }
        try {
            const respone: any = await this._productRepo.getListPaymentTransfer((this.page - 1) * this.pageSize, this.limit, body);
            this.total = respone.data.total || 0;

            if (respone.code.toLowerCase() === 'success') {
                this.productsTransfer = (respone.data.data || []).map(item => {
                    return new TransferProduct(item);
                });
            }
            else {
                const errs = new Error(respone.errors[0]);
                this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                this._spinner.hide();
            }
            this._spinner.hide();

        } catch (err) {
            const errs = new Error(err.errors[0]);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
            this._spinner.hide();
        }
    }

    //fn confirm paid
    onConfirm(product: TransferProduct) {
        this._noti.pushQuestion('Thông tin xác thực', `Tôi muốn xác thực, khách hàng <b>${product.customerName}</b> đã chuyển khoản thành công`, true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();
                try {
                    const response: any = await this._productRepo.confirmPaymentTransfer(product.id);
                    if (response.code.toLowerCase() == 'success') {
                        this._noti.pushAlert('Ok!', 'Xác thực chuyển khoản thành công', 'success', 3000);
                        this.getPaymentTransfer();
                    }
                    else {
                        const errs = new Error(response.errors[0]);
                        this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }

                    this._spinner.hide();
                }
                catch (err) {
                    const errs = new Error(err);
                    this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
                }
            }
        });
    }

    //fn get detail product booking
    async onGetDetail(product: TransferProduct) {
        this._spinner.show()
        try {
            const response: any = await this._productRepo.getDetailBooking(product.id);
            if (response.code.toLowerCase() === 'success') {
                this.productBookingDetail = new ProductBookingDetail(response.data);
                if (!this.isOpenSideBar) {
                    this.isOpenSideBar = true;
                    this.typeBooking = TYPE_TRANSFER.PRODUCT;
                }
            }
            this._spinner.hide();
        }
        catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
            this._spinner.hide();
        }
    }
}
