import { Component, Input } from '@angular/core';
import { AppList } from '../../../app.list';
import { Spinner, NotificationService, ProductRepo, ProductBooking, Error, ProductBookingDetail } from '../../../common';
import { TYPE_TRANSFER } from '../../../app.constants';
import { Router } from '@angular/router';

@Component({
    selector: 'customer-product',
    templateUrl: './customer-product.component.html',
})
export class CustomerProductComponent extends AppList {

    productBooking: ProductBooking[] = new Array<ProductBooking>();

    productBookingDetail: any = {};

    @Input() role: string = null;

    isOpenSideBar: boolean = false;

    typeBooking: string = '';
    selectedProduct: ProductBooking;
    constructor(
        private _spinner: Spinner,
        private _noti: NotificationService,
        private _productRepo: ProductRepo,
        private _router: Router
    ) {
        super();
        this.request = this.getBookingProduct;
    }

    ngOnChanges() {
        if (!!this.role) {
            switch (this.role.toLowerCase()) {
                case 'admin': {
                    this.isAdmin = true;
                    break;
                }
                case 'booker': {
                    this.isBooker = true;
                    break;
                }
                case 'cashier': {
                    this.isCashier = true;
                    break;
                }
                default: {
                    [this.isAdmin, this.isCS, this.isBooker, this.isCashier] = [false, false, false, false];
                    break;
                }
            }
        }
    }

    ngOnInit(): void {
        this.getBookingProduct()
    }

    //get booking product 
    async getBookingProduct() {
        this._spinner.show();
        const body = {
            Keyword: this.keyword,
            BookingDate: null
        }
        try {
            const dataFormServe: any = await this._productRepo.getBookingProduct((this.page - 1) * this.pageSize, this.limit, body);
            this.total = dataFormServe.data.total || 0;

            this.productBooking = (dataFormServe.data.data || []).map(item => {
                return new ProductBooking(item);
            });

            this._spinner.hide();

        } catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
            this._spinner.hide();
        }
    }

    //fn confirm paid booking
    onConfirmBooking(product: ProductBooking) {
        this._noti.pushQuestion('Xác thực thanh toán', `<strong>${product.productName} - ${product.contactName}</strong>`, true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();

                try {
                    const response: any = await this._productRepo.confirmBooking(product.id);
                    this._spinner.hide();

                    if (response.code.toLowerCase() === 'success') {
                        this._noti.pushAlert('OK', 'Xác thực thánh toán thành công', 'success', 2000);
                        this.getBookingProduct();
                    }
                    else {
                        const errs = new Error(response.errors[0]);
                        this._noti.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }

                    this._spinner.hide();
                }
                catch (err) {
                    const errs = new Error(err.errors[0]);
                    this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
                    this._spinner.hide();
                }
                //end catch
            }
        });
    }

    //fn cancel boooking
    onCancelBooking(product: ProductBooking) {
        this._noti.pushQuestion('Thông tin hủy vé', `<p>Tôi muốn hủy vé</p> <strong>${product.productName} - ${product.contactName}</strong>`, true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();

                try {
                    const response: any = await this._productRepo.cancelBooking(product.id);
                    this._spinner.hide();

                    if (response.code.toLowerCase() === 'success') {
                        this._noti.pushAlert('OK', 'đã hủy vé thành công', 'success', 3000);
                        this.getBookingProduct();
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
                    this._spinner.hide();
                }
            }
        });
    }

    //fn get detail product booking
    async onGetDetail(product: ProductBooking) {
        this._spinner.show();
        this.selectedProduct = product;
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

    onReceipt(product: ProductBooking) {
        this._router.navigate([`cashier/receipt/create`], { queryParams: { orderCode: product.code, type: 'product' } });
    }
}
