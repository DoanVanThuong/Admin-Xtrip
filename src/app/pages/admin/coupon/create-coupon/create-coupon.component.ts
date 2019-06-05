import { AppBase } from '../../../../app.base';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService, Spinner, Error, Coupon } from '../../../../common';
import { CouponRepo } from '../../../../common/repositories/coupon.repository';
import { CouponSuggestRepo } from '../../../../common/repositories/coupon-suggest.respository';

import * as _ from 'lodash';

@Component({
    selector: 'create-coupon',
    templateUrl: './create-coupon.component.html',
    styleUrls: ['./create-coupon.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class CreateCouponComponent extends AppBase {

    action: string = 'create';
    couponId: string = '';
    couponDetail: Coupon = null;

    services: any = [];
    selectedServices: any = [];

    objects: any[] = [];
    selectedObject: any;

    devices: any[] = [];
    deviceChecked: any[] = [];

    applyObjects: any[] = [];
    selectedApplyObject: any;

    discountOptions: any[] = [];
    selectedDiscountOption: any;

    typeCoupon: number = 1;

    startDate: string = '';
    endDate: string = '';

    formCoupon: FormGroup;
    code: AbstractControl; //code
    name: AbstractControl; //tên
    terms: AbstractControl; //điều khoản
    description: AbstractControl; //mô tả
    rangeValue: AbstractControl; //thời gian sd
    maxTimesUsed: AbstractControl; //số lượng
    minOrderAmount: AbstractControl; //đơn hàng tối thiểu
    maxDiscount: AbstractControl; //giảm tối đá
    discountAmount: AbstractControl; //giá trị giảm
    discountPercentage: AbstractControl;
    limitationValue: AbstractControl; //số lần sd trên một người

    hotels: any[] = [];
    tours: any = [];
    accounts: any[] = [];
    flights: any[] = [];
    acounts: any = [];
    products: any[] = [];

    messageError: string = 'coupon code này đã tồn tại trong hệ thống';
    isShowMessageError: boolean = false;
    isShowSuccess: boolean = false;

    constructor(private _router: Router,
        private _form: FormBuilder,
        private _couponRepo: CouponRepo,
        private _notification: NotificationService,
        private _suggestCoupon: CouponSuggestRepo,
        private _spinner: Spinner,
        private _activeRouter: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.initBaseData();
        this.initForm();

        this._activeRouter.params.subscribe((params) => {
            if (params.id) {
                this.action = 'update';
                this.couponId = params.id;

                this.getCouponInfo(this.couponId);
            }
        });
    }

    //fn get coupon info
    async getCouponInfo(id: string) {
        this._spinner.show();
        try {
            const response: any = await this._couponRepo.getCouponInfo(id);
            if (response.code === 'Success') {
                this.couponDetail = new Coupon(response.data);
                this.initFormUpdate();
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
    //fn init form
    initForm() {
        this.formCoupon = this._form.group({
            'code': [, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(8)
            ])],
            'name': [, Validators.compose([
                Validators.required,
                Validators.maxLength(50)
            ])],
            'terms': [, Validators.compose([
                Validators.required,
            ])],
            'description': ['', Validators.compose([
                Validators.required,
            ])],
            'rangeValue': [new Date(), new Date()],
            'maxTimesUsed': ['', Validators.compose([
                Validators.required,
                Validators.min(0)

            ])],
            'minOrderAmount': [, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])],
            'maxDiscount': [, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])],
            'discountAmount': [, Validators.compose([
                // Validators.required,
                Validators.min(0),
            ])],
            'discountPercentage': ['', Validators.compose([
                Validators.required,
                Validators.max(100),
                Validators.min(0)
            ])],
            'limitationValue': [1, Validators.compose([
                Validators.required,
                Validators.min(0)

            ])],
        });

        this.code = this.formCoupon.controls['code'];
        this.name = this.formCoupon.controls['name'];
        this.description = this.formCoupon.controls['description'];
        this.terms = this.formCoupon.controls['terms'];
        this.rangeValue = this.formCoupon.controls['rangeValue'];
        this.maxDiscount = this.formCoupon.controls['maxDiscount'];
        this.minOrderAmount = this.formCoupon.controls['minOrderAmount'];
        this.maxTimesUsed = this.formCoupon.controls['maxTimesUsed'];
        this.limitationValue = this.formCoupon.controls['limitationValue'];
        this.discountAmount = this.formCoupon.controls['discountAmount'];
        this.discountPercentage = this.formCoupon.controls['discountPercentage'];
    }

    //fn initFormUpdate
    initFormUpdate() {
        this.selectedServices = this.services.filter(service => _.includes(this.couponDetail.services, service.value));
        this.selectedApplyObject = _.head(this.applyObjects.filter(option => option.customApply === this.couponDetail.customApply));
        this.detectTypeCoupon();

        this.tours = this.couponDetail.tours;
        this.hotels = this.couponDetail.hotels;
        this.accounts = this.couponDetail.apply4Accounts.map((account: any) => {
            return {
                email: account.email,
                userName: account.userName,
                userId: account.userId,
                subCode: account.subCode,
                quantity: account.quantity,
                isSelected: true,
                isShow: false
            }
        });

        this.flights = this.couponDetail.flights;
        this.products = this.couponDetail.products;

        this.selectedObject = _.head(this.objects.filter(object => object.value === this.couponDetail.applyToCustomer));
        this.selectedDiscountOption = _.head(this.discountOptions.filter(option => option.usePercentage === this.couponDetail.usePercentage));

        this.deviceChecked = this.couponDetail.devices;
        this.formCoupon.setValue({
            discountPercentage: this.selectedDiscountOption.usePercentage ? this.couponDetail.discountPercentage : null,
            discountAmount: !this.selectedDiscountOption.usePercentage ? this.couponDetail.discountAmount : null,
            maxDiscount: this.couponDetail.maxDiscount,
            minOrderAmount: this.couponDetail.minOrderAmount,
            maxTimesUsed: this.couponDetail.maxTimesUsed,
            limitationValue: this.couponDetail.limitationValue,
            rangeValue: [new Date(this.couponDetail.startDate), new Date(this.couponDetail.endDate)],
            code: this.couponDetail.code,
            name: this.couponDetail.name,
            description: this.couponDetail.description,
            terms: this.couponDetail.terms
        });

        if (this.selectedDiscountOption.usePercentage === false) {
            this.maxDiscount.clearValidators();
            this.discountPercentage.clearValidators();
            this.maxDiscount.setValue(null);
            this.discountPercentage.setValue(null);
        }
        else {
            this.discountAmount.clearValidators();
            this.discountAmount.setValue(null);
        }
    }

    //fn init base data
    initBaseData() {
        // dịch vụ
        this.services = [
            { title: 'Vé máy bay', icon: 'fa fa-plane fa-lg', code: 'flight', value: 1 },
            { title: 'Khách sạn', icon: 'fa fa-building-o fa-lg', code: 'hotel', value: 2 },
            { title: 'Tour', icon: 'fa fa-road fa-lg', code: 'tour', value: 3 },
            { title: 'Product', icon: 'fa fa-product-hunt', code: 'product', value: 4 },

        ];
        this.selectedServices.push(this.services[0]);

        //đối tượng
        this.objects = [
            { title: 'Khách hàng chưa tài khoản', type: 'public', value: 1 },
            { title: 'Khách hàng có tài khoản', type: 'account', value: 2 },
            { title: 'Chỉ áp dụng cho vài tài khoản', type: 'user', value: 3 },
        ]
        this.selectedObject = this.objects[0];

        //áp dụng cho dich vụ
        this.applyObjects = [
            { title: 'Tất cả dịch vụ đã chọn', type: 'all', customApply: false },
            { title: 'tùy chọn', type: 'option', customApply: true }
        ]
        this.selectedApplyObject = this.applyObjects[0];

        //giảm giá theo
        this.discountOptions = [
            { title: 'Theo %', type: 'percent', usePercentage: true },
            { title: 'Theo số tiền', type: 'money', usePercentage: false },
        ]
        this.selectedDiscountOption = this.discountOptions[0];

        //thiết bị
        this.devices = [
            { title: 'App', value: 'App' },
            { title: 'Web', value: 'Web' },
        ]
    }

    //fn select item service
    selectService(item: any) {
        if (_.includes(this.selectedServices, item)) {
            const index = _.findIndex(this.selectedServices, item);
            if (index != -1 && this.selectedServices.length > 1) {
                this.selectedServices.splice(index, 1);
                switch (item.value) {
                    case 1:
                        this.flights = [];
                        break;
                    case 2:
                        this.hotels = [];
                        break;
                    case 3:
                        this.tours = [];
                        break;
                    case 4:
                        this.products = [];
                        break;
                    default:
                        this.flights = [];
                        this.hotels = [];
                        this.tours = [];
                        this.products = []
                        break;
                }
                this.detectTypeCoupon();
            }
            else
                return;
        } else {
            this.selectedServices.push(item);
            this.detectTypeCoupon();
        }
    }

    //fn detect type coupon
    detectTypeCoupon() {
        if (this.selectedServices.length === this.services.length && this.selectedApplyObject.type === 'all') {
            this.typeCoupon = 0;
        }
        else if (this.selectedServices.length < this.services.length && this.selectedApplyObject.type === 'all') {
            this.typeCoupon = 1;
        }
        else {
            this.typeCoupon = 2;
        }
    }

    //fn detect service selected
    detectActiveService(item: any): Boolean {
        if (typeof (item) === 'object') {
            return _.includes(this.selectedServices, item);
        }
        else {
            for (const i of this.selectedServices) {
                if (i.code === item) {
                    return true
                }
            }
        }
    }

    //fn onchange object
    onChangeObject(event: Event, object: any) {
        this.selectedObject = object;
        if (this.selectedObject.value !== 3) {
            this.accounts = [];
        }
    }

    //fn onchange supplier
    onChangeSupplyObject(event: Event, supplyObject: any) {
        this.selectedApplyObject = supplyObject;
        this.detectTypeCoupon();
    }

    //fn on change discount percent
    onChangediscountPercentage($event: string) {
        this.discountAmount.clearValidators();
    }

    //fn on change discount option
    selectDiscountOption(event: Event) {
        if (this.selectedDiscountOption.type === 'percent') {
            this.discountAmount.clearValidators();
            this.discountAmount.setValue(null);

            this.discountPercentage.setValidators(Validators.compose([
                Validators.required,
                Validators.min(0),
                Validators.max(100)
            ]));
            this.formCoupon.controls['maxDiscount'].setValidators(Validators.compose([
                Validators.required,
                Validators.min(0)
            ]));
        }
        else {
            this.discountPercentage.clearValidators();
            this.discountPercentage.setValue(null);

            this.discountAmount.setValidators(Validators.compose([
                Validators.required,
                Validators.min(0)
            ]))

            this.maxDiscount.clearValidators();
            this.maxDiscount.setValue(null);
        }
    }

    //fn on change range value
    onChangeRangeValue(value: any) {
        if (!!value) {
            this.startDate = moment(value[0]).format("YYYY-MM-DD");
            this.endDate = moment(value[1]).format("YYYY-MM-DD");
        }
    }

    //fn oncreate coupon
    onSubmit(formCoupon: any) {
        const body = {
            code: formCoupon.code,
            name: formCoupon.name,
            summary: formCoupon.name,
            description: formCoupon.description,
            minOrderAmount: formCoupon.minOrderAmount,
            terms: formCoupon.terms,
            usePercentage: this.selectedDiscountOption.usePercentage,
            discountPercentage: formCoupon.discountPercentage,
            discountAmount: formCoupon.discountAmount,
            maxDiscount: formCoupon.maxDiscount,
            startDate: moment(formCoupon.rangeValue[0]).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
            endDate: moment(formCoupon.rangeValue[1]).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
            limitationValue: formCoupon.limitationValue,
            maxTimesUsed: formCoupon.maxTimesUsed,
            services: this.selectedServices.map(item => item.value),
            customApply: (this.selectedApplyObject.type === 'option' ? true : false),
            applyToCustomer: this.selectedObject.value,
            flights: this.flights,
            hotels: this.hotels,
            tours: this.tours,
            products: this.products,
            apply4Accounts: this.accounts,
            devices: this.deviceChecked
        }

        if (this.action === 'update') {
            this.onUpdate(this.couponId, body);
        }
        else {
            this.onCreate(body);
        }
    }

    //fn create coupon
    async onCreate(body: any) {
        this._spinner.show();
        try {
            const response: any = await this._couponRepo.createCoupon(body);
            if (response.code === 'Success') {
                this._notification.pushAlert('Thành công', `Coupon ${body.code} đã được tạo thành công`, 'success', 2000);

                this.formCoupon.reset();
                this.resetData();
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

    //fn update coupon
    async onUpdate(id: string, body) {
        this._spinner.show();
        try {
            const response: any = await this._couponRepo.updateCoupon(id, body);
            if (response.code === 'Success') {
                this._notification.pushAlert('Thành công', `Coupon ${body.code} đã được cập nhật thành công`, 'success', 2000);
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

    //fn reset data
    resetData() {
        this.accounts = [];
        this.hotels = [];
        this.flights = [];
        this.tours = [];
        this.products = [];
        this.selectedServices = [];
        this.initBaseData();
        this.initForm();
    }

    //fn cancel create coupon
    cancel() {
        this._router.navigate(['data-entry/coupon'])
    }

    //fn get data suggests
    getDataSuggest(data: any[], type: string) {
        switch (type) {
            case 'hotel':
                this.hotels = data;
                break;
            case 'tour':
                this.tours = data;
                break;
            case 'account':
                this.accounts = data;
                break;
            case 'flight':
                this.flights = data;
                break;
            case 'product':
                this.products = data;
                break;
            default:
                this.accounts = [];
                this.hotels = [];
                this.tours = [];
                this.products = [];
                break;
        }
    }

    //fn random code
    async genCode() {
        this._spinner.show();
        try {
            const response: any = await this._suggestCoupon.genCouponCode();
            if (response.code === 'Success') {
                this.code.setValue(response.data || '');
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

    //fn handle error
    handleError(errors: any) {
        this._notification.pushToast('Lỗi', new Error(errors).value, 'error', 3000);
    }

    //fn onchange code
    onChangeCode(code: string) {
        this.isShowSuccess = false;
        this.isShowMessageError = false;
    }

    //fn check code isExist
    async onCheckCode() {
        this._spinner.show();
        try {
            if (!this.code.errors) {
                const response: any = await this._suggestCoupon.checkexist(this.code.value);
                if (response.code === 'Success') {
                    this.isShowSuccess = true;
                    this.isShowMessageError = false;
                }
                else {
                    this.isShowSuccess = false;
                    this.isShowMessageError = true;
                }
            }
            this._spinner.hide();
        } catch (error) {
            this.handleError(error);
            this.isShowSuccess = false;
            this.isShowMessageError = false;
            this._spinner.hide();
        }
    }

    onSelectDevice(event: any, data: any) {
        if (event.target.checked)
            this.deviceChecked.push(data.value);
        else {
            for (const item of this.deviceChecked) {
                if (item === data.value) {
                    this.deviceChecked.splice(_.findIndex(this.deviceChecked, i => i === data.value), 1);
                }
            }
        }
    }

    checkIsChecked(item: any) {
        return _.includes(this.deviceChecked, item.value);
    }
}