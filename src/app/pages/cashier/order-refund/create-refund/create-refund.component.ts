import { Component } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppBase } from '../../../../app.base';
import { CashierRepo, Spinner, NotificationService, AuthRepository, Error, Receipt } from '../../../../common';
@Component({
    selector: 'create-refund',
    templateUrl: './create-refund.component.html',
    styleUrls: ['./create-refund.component.less']
})
export class CreateOrderRefundComponent extends AppBase {

    form: FormGroup;
    orderCode: AbstractControl;
    serialCode: AbstractControl;
    customerName: AbstractControl;
    refundDate: AbstractControl;
    modifiedDate: AbstractControl;
    createdDate: AbstractControl;
    remark: AbstractControl;

    typeServices: any = [];
    typeServicesSelected: any = null;

    order: IOrder = null;

    contentReceipts: ContentReceiptRefund[] = [];

    params: any = {};
    action: string = 'create';

    receipt: Receipt = null;
    code: string = '';

    status: number = -1;
    bsConfig: any = {};

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
        this.bsConfig = Object.assign(this.bsConfig, { minDate: null})
        this.getParam();
        this.initDataBinding();

        const content: ContentReceiptRefund = new ContentReceiptRefund({
            description: '',
            quantity: 0,
            price: 0,
        })
        this.contentReceipts.push(content);
        this.initForm();
    }

    getParam() {
        this._activedRoute.params.subscribe((params: any) => {
            if (params.hasOwnProperty('id')) {
                this.params = params;
                this.action = 'update';
                this.getDetailReceipt(this.params.id);
            }
        })
    }

    //fn get detail
    async getDetailReceipt(id) {
        this._spinner.show();
        try {
            const res: any = await this._cashierRepo.getDetailRefundOrder(id);
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
            refundDate: this.receipt.refundDate,
            createdDate: this.receipt.createdDate,
            remark: this.receipt.remark,

        });

        this.contentReceipts = this.receipt.details;
        // số chứng từ
        this.code = this.receipt.code;
        // status
        this.status = this.receipt.status;
    }

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

    async getCurrenUser() {
        this._spinner.show();
        try {
            return await this._auth.auth();
        } catch (error) {
        }
        finally {
            this._spinner.hide();
        }
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
            'refundDate': [, Validators.compose([
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
        this.refundDate = this.form.controls['refundDate'];
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
                this.setDescription();

        } catch (error) {
            this.handleError(error);
            this.serialCode.setValue(null);
            this.customerName.setValue(null);
            this.contentReceipts[0].setDescription("");

        }
        finally {
            this._spinner.hide();
        }
    }

    setDescription() {
        const newDes = (!!this.remark.value ? this.remark.value + ' -' : '') + ` ${'mã đơn hàng #' + (!!this.orderCode.value ? this.orderCode.value : '') + ' - ' +
            (!!this.customerName.value ? this.customerName.value : '')}`;

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
        if (!!this.orderCode.value && this.orderCode.value.length === 8) {
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
            this.setDescription();
        }
    }

    onChangeReason(data: any) {
        if (!!data) {
            this.setDescription();
        }
    }

    addNewContent() {
        this.contentReceipts.push(new ContentReceiptRefund());
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
            refundDate: (this.action !== 'update' ? moment(this.refundDate.value || moment()).format("YYYY-MM-DD") : this.receipt.refundDate),
            status: status,
            type: (this.action !== 'update' ? this.typeServicesSelected.type : this.receipt.type),
            details: this.contentReceipts || [],
            total: (this.action !== 'update' ? 0 : this.receipt.total),
            remark: (this.action !== 'update' ? this.remark.value : this.receipt.remark || ''),

        }
        try {
            if (this.action !== 'update') {
                await this._cashierRepo.createRefundOrder(body);
                swal({
                    title: "Tạo phiếu thu thành công",
                    type: "success",
                }).then(() => {
                    this._router.navigate(['cashier/order-refund']);
                });
            }
            else {
                await this._cashierRepo.updateRefundOrder(this.params.id, body);
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
        return !this.orderCode.valid || !this.customerName.valid || !this.serialCode.valid || !this.refundDate.valid || this.validateData(this.contentReceipts);
    }

    //fn handle error
    handleError = (errors: Array<any>) => {
        let err: any;
        if (!!errors.length) {
            err = new Error(errors[0]);
        }

        switch (err.code) {
            case 2002: {
                this._notification.pushToast(err.value, '', 'error', 3000, { showConfirmButton: false });
                break;
            }
            default:
                this._notification.pushToast('Có lỗi xảy ra', 'Vui lòng kiểm tra lại thông tin', 'error', 3000, { showConfirmButton: false });
                break;
        }
    }

    //fn validate data
    validateData(data: Array<any>) {
        let isError: boolean = false;
        for (const iterator of data) {
            if (!iterator.description || iterator.quantity <= 0 || iterator.price <= 0) {
                isError = true;
            }
        }
        return isError;
    }

    back() {
        this._location.back();
    }

    onPrint(){
        setTimeout(() => {
            this.print("printer");
        },1000)
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

class ContentReceiptRefund {
    description: string = '';
    quantity: number = 0;  //số lượng
    price: number = 0;  //đơn giá (refund)

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

}
