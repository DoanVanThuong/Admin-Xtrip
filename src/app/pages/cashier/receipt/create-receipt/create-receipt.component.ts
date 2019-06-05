import { Component, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppBase } from '../../../../app.base';
import { CashierRepo, Spinner, NotificationService, AuthRepository, Error, Receipt } from '../../../../common';
import { PreviewReceiptPopupComponent } from '../../../../components';
import * as _ from 'lodash';
@Component({
    selector: 'create-receipt',
    templateUrl: './create-receipt.component.html',
    styleUrls: ['./create-receipt.component.less']
})
export class CreateReceiptComponent extends AppBase {

    @ViewChild(PreviewReceiptPopupComponent) previewReceipt: PreviewReceiptPopupComponent;
    form: FormGroup;
    orderCode: AbstractControl;
    serialCode: AbstractControl;
    customerName: AbstractControl;
    receiptDate: AbstractControl;
    createdDate: AbstractControl;
    remark: AbstractControl;

    typeServices: any[] = [];
    typeServicesSelected: any = null;

    order: IOrder = null;

    contentReceipts: ContentReceipt[] = [];

    params: any = {};
    action: string = 'create';

    receipt: Receipt = null;
    code: string = '';

    status: number = -1;

    constructor(private fb: FormBuilder,
        private _cashierRepo: CashierRepo,
        private _spinner: Spinner,
        private _notification: NotificationService,
        private _router: Router,
        private _auth: AuthRepository,
        private _location: Location,
        private _activedRoute: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.bsConfig = Object.assign(this.bsConfig, { minDate: null })

        this.initForm();
        this.initDataBinding();
        this.getParam();

        const content: ContentReceipt = new ContentReceipt({
            description: '',
            amount: 0,
            seller: '',
            quantity: 0,
            price: 0,
        })
        this.contentReceipts.push(content);
    }

    getParam() {
        this._activedRoute.params.subscribe((params: any) => {
            if (params.hasOwnProperty('id')) {
                this.params = params;
                this.action = 'update';
                this.getDetailReceipt(this.params.id);
            }
        })

        this._activedRoute.queryParams.subscribe((params: any) => {
            if (params.orderCode && params.type) {
                this.orderCode.setValue(params.orderCode);
                this.typeServicesSelected = this.typeServices.filter((service: any) => service.value === params.type)[0] || this.typeServices[0];
                this.getDetailOrder(params.orderCode, this.typeServicesSelected.value);
            }
        })
    }

    //fn get detail
    async getDetailReceipt(id) {
        this._spinner.show();
        try {
            const res: any = await this._cashierRepo.getDetailReceipt(id);
            this.receipt = new Receipt(res.data);

            this.initFormUpdate();

        } catch (error) {
            this.handleError(error);
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn initFormUpdate
    initFormUpdate() {
        this.typeServicesSelected = this.typeServices.filter((service: any) => service.type === this.receipt.type)[0] || this.typeServices[0];

        this.form.setValue({
            orderCode: this.receipt.orderCode,
            serialCode: this.receipt.serialCode,
            customerName: this.receipt.customerName,
            receiptDate: this.receipt.receiptDate,
            createdDate: this.receipt.createdDate,
            remark: this.receipt.remark,
        });

        this.contentReceipts = this.receipt.details;
        // số chứng từ
        this.code = this.receipt.code;
        // status
        this.status = this.receipt.status;
        console.log(this.status);

    }

    //fn init data binding
    initDataBinding() {
        this.typeServices = [
            { title: 'Chọn loại', value: 'null', type: 0 },
            { title: 'Máy bay', value: 'flight', type: 1 },
            { title: 'Khách sạn', value: 'hotel', type: 2 },
            { title: 'Tour', value: 'tour', type: 3 },
            { title: 'Vé vui chơi tham quan', value: 'product', type: 4 },

        ];
        this.typeServicesSelected = this.typeServices[0];
    }

    //init form services
    initForm() {
        this.form = this.fb.group({
            'orderCode': [, Validators.compose([
                Validators.required
            ])],
            'serialCode': [, Validators.compose([
                Validators.required
            ])],
            'customerName': [, Validators.compose([
                Validators.required
            ])],
            'receiptDate': [, Validators.compose([
                Validators.required
            ])],
            'createdDate': [, Validators.compose([
            ])],
            'remark': [, Validators.compose([
                Validators.required
            ])],
        });

        this.orderCode = this.form.controls['orderCode'];
        this.serialCode = this.form.controls['serialCode'];
        this.customerName = this.form.controls['customerName'];
        this.receiptDate = this.form.controls['receiptDate'];
        this.createdDate = this.form.controls['createdDate'];
        this.remark = this.form.controls['remark'];

    }

    onGetDetailOrder(code: string) {
        if (this.action !== 'update') {
            if (!!code && code.length === 8 && this.typeServicesSelected.type !== 0) {
                this.getDetailOrder(code, this.typeServicesSelected.value);
            }
            else {
                this.serialCode.setValue(null);
                this.customerName.setValue(null);
            }
        }

    }

    async getDetailOrder(code: string, type: string) {
        this._spinner.show();
        try {
            const res: any = await this._cashierRepo.getDetailOrder(code, type);
            this.order = res.data || {};

            this.serialCode.setValue(this.order.serialCode);
            this.customerName.setValue(this.order.customerName);

            this.setDescriptionForFirstDetail();
            this.contentReceipts[0].setAmount(this.order.total);

        } catch (error) {
            console.log(error);

            this.handleError(error);
            this.serialCode.setValue(null);
            this.customerName.setValue(null);
            this.contentReceipts[0].setDescription("");
        }
        finally {
            this._spinner.hide();
        }
    }

    setDescriptionForFirstDetail(content?: string) {
        const newDes = (!!this.remark.value ? this.remark.value + ' -' : '') + ` ${'mã đơn hàng #' + (!!this.orderCode.value ? this.orderCode.value : '') + ' - ' +
            (!!this.customerName.value ? this.customerName.value : '')} ` + `${!!content ? content : ''}`
        this.contentReceipts[0].setDescription(newDes);
    }

    onChangeOrderCode(orderCode: string) {
        if (orderCode.length != 8) {
            this.serialCode.setValue(null);
            this.customerName.setValue(null);
            this.contentReceipts[0].setDescription("");
        }
    }

    onChangeService(service: any) {
        if (service.type !== 0 && !!this.orderCode.value && this.orderCode.value.length === 8) {
            this.getDetailOrder(this.orderCode.value, this.typeServicesSelected.value);
        }
        else {
            this.serialCode.setValue(null);
            this.customerName.setValue(null);
            this.contentReceipts[0].setDescription("");
        }
    }

    onBlurRemark() {
        if (this.action !== 'update') {
            this.setDescriptionForFirstDetail();
        }
    }

    onChangeReason(data: any) {
        if (!!data) {
            this.setDescriptionForFirstDetail();
        }
    }

    addNewContent() {
        const content: ContentReceipt = new ContentReceipt();
        content.setSeller(this.contentReceipts[0].seller);
        this.contentReceipts.push(content);
    }

    deleteConent(index: number) {
        this.contentReceipts.splice(index, 1);
    }


    onSubmit(status: number) {
        this.onCreate(status);
    }

    onCancel() {

    }

    //fn create receipt
    async onCreate(status: number) {
        this._spinner.show();
        const body = {
            code: (this.action !== 'update' ? null : this.receipt.code),
            id: (this.action !== 'update' ? null : this.receipt.id),
            name: (this.action !== 'update' ? null : this.receipt.name),
            description: (this.action !== 'update' ? this.contentReceipts[0].description || '' : this.receipt.description),
            orderCode: (this.action !== 'update' ? this.order.orderCode || '' : this.receipt.orderCode),
            serialId: (this.action !== 'update' ? this.order.serialId || '' : this.receipt.orderCode),
            serialCode: (this.action !== 'update' ? this.order.serialCode || '' : this.receipt.orderCode),
            customerId: (this.action !== 'update' ? this.order.customerId || '' : this.receipt.customerId),
            customerName: (this.action !== 'update' ? this.order.customerName || '' : this.receipt.customerName),
            transactionId: (this.action !== 'update' ? null : this.receipt.transactionId),
            receiptDate: (this.action !== 'update' ? moment(this.receiptDate.value || moment()).format("YYYY-MM-DD") : this.receipt.receiptDate),
            status: status,
            type: (this.action !== 'update' ? this.typeServicesSelected.type : this.receipt.type),
            details: this.contentReceipts || [],
            total: (this.action !== 'update' ? 0 : this.receipt.total),
            remark: (this.action !== 'update' ? this.remark.value : this.receipt.remark || ''),
        }

        try {
            if (this.action !== 'update') {
                await this._cashierRepo.createReceipt(body);
                swal({
                    title: "Tạo phiếu thu thành công",
                    type: "success",
                }).then(() => {
                    this._router.navigate(['cashier/receipt']);
                });
            }
            else {
                await this._cashierRepo.updateReceipt(this.params.id, body);
                swal({
                    title: "Cập nhật thành công",
                    type: "success",
                }).then(async () => {
                    await this.getDetailReceipt(this.params.id);
                });
            }

        } catch (error) { }

        finally {
            this._spinner.hide();
        }
    }

    detectDisabled() {
        return !this.orderCode.valid || !this.customerName.valid || !this.serialCode.valid || !this.receiptDate.valid || this.validateData(this.contentReceipts);
    }

    //fn handle error
    handleError = (errors: Array<any>) => {
        let err: any;

        if (errors.length) {
            err = new Error(errors[0]);
        }

        switch (err.code) {
            case 2002: {
                this._notification.pushToast(err.value, '', 'error', 1000, { showConfirmButton: false });
                break;
            }
            default:
                this._notification.pushToast('Có lỗi xảy ra', 'Vui lòng kiểm tra lại thông tin', 'error', 1000, { showConfirmButton: false });
                break;
        }
    }

    //fn validate data
    validateData(data: Array<any>) {
        let isError: boolean = false;
        for (const iterator of data) {
            if (!iterator.description || iterator.amount <= 0) {
                isError = true;
            }
        }

        return isError;
    }

    onPrint() {
        setTimeout(() => {
            this.print('printer');
        }, 1000);
    }

    back() {
        this._location.back();
    }
}

interface IOrder {
    customerId: string;
    customerName: string;
    orderCode: string;
    serialCode: string;
    serialId: string;
    total: number;
}

class ContentReceipt {
    description: string = '';
    amount: number = 0;     //giá (receipt)
    seller: string = '';    //nv bán hàng

    constructor(data?: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }

    setDescription(des: string) {
        this.description = des;
    }

    setAmount(amount: number) {
        this.amount = amount;
    }

    setSeller(sellerName: string) {
        this.seller = sellerName;
    }
}
