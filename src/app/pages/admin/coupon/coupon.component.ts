import { Component, ViewEncapsulation } from '@angular/core';
import { AppList } from '../../../app.list';
import { Router, ActivatedRoute } from '@angular/router';
import { Spinner, NotificationService, Error, Coupon } from '../../../common';
import { CouponRepo } from '../../../common/repositories/coupon.repository';

@Component({
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styleUrls: ['./coupon.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class DataEntryCouponComponent extends AppList {

    headers: any[];
    coupons: Coupon[] = new Array<Coupon>();
    
    constructor(private _router: Router,
        private _couponRepo: CouponRepo,
        private _spinner: Spinner,
        private _notification: NotificationService,
        private _activedRoute: ActivatedRoute) {
        super();
        this.request = this.getList;
    }

    ngOnInit() {
        this.headers = [
            {},
            { title: '#', field: 'no' },
            { title: 'Code', field: 'code', sortable: true },
            { title: 'Mô tả', field: 'summary', sortable: true },
            { title: 'Giá trị', field: 'value', sortable: true },
            { title: 'Số lượng mã', field: 'quantity', sortable: true },
            { title: 'Ngày bắt đầu', field: 'start', sortable: true },
            { title: 'Ngày kết thúc', field: 'end', sortable: true },
            { title: 'Trạng thái', field: 'enabled', sortable: true },
            { title: 'Chức năng', field: 'action' },

        ];
        this._activedRoute.queryParams.subscribe((params: any) => {
            this.page = !!params.page ? parseInt(params.page) : null;
            this.limit = !!params.size ? parseInt(params.size) : this.limit;
            this.sort = !!params.sort ? params.sort : null;
            this.order = !!params.asc ? (params.asc === 'true' ? true : false) : null;

            this.getList(this.sort, this.order);
        })
    }

    //get list coupon
    async getList(sortField?: string, order?: boolean) {
        this._spinner.show();
        const body = {
            keyword: this.keyword,
            sortField: sortField,
            ascending: order
        }
        try {
            const response: any = await this._couponRepo.getListCoupon((this.page - 1) * this.pageSize, this.limit, body);
            if (response.code === 'Success') {
                this.coupons = (response.data.data || []).map(item => new Coupon(item));
                this.total = response.data.total || 0;
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

    //fn goto create coupon page
    onCreateCoupon() {
        this._router.navigate(['admin/coupon/create']);
    }

    //fn handle error
    handleError(errors: any) {
        this._notification.pushToast('Lỗi', new Error(errors).value, 'error', 3000);
    }

    // fn page changed
    pageChanged(event: any): void {
        if (this.page !== event.page || this.pageSize !== event.itemsPerPage) {
            this.page = event.page;
            this.pageSize = event.itemsPerPage;
            this._router.navigate(['admin/coupon'], {
                queryParams: {
                    page: this.page,
                    size: this.limit,
                    sort: this.sort,
                    asc: this.order
                }
            });
        }
    };

    //on change limit
    onChangeLimitSize(number: number) {
        this.limit = number;
        this._router.navigate(['admin/coupon'], {
            queryParams: {
                page: this.page,
                size: this.limit,
                sort: this.sort,
                asc: this.order
            }
        });
    }

    //fn sort
    sortBy(sort: string): void {
        if (!!sort) {
            this.setSortBy(sort, this.sort !== sort ? true : !this.order);
            this._router.navigate(['admin/coupon'], {
                queryParams: {
                    page: this.page,
                    size: this.limit,
                    sort: this.sort,
                    asc: this.order
                }
            });
        }
    }

    //fn delete coupon
    onDeleteCoupon(coupon: Coupon) {
        this._notification.pushQuestion(`Bạn có chắc muốn xóa coupon`, `${coupon.code}`, true, 'Xóa', 'Hủy').then((value: any) => {
            if (value.value) {
                this.deleteCoupon(coupon);
            }
        });
    }

    async deleteCoupon(coupon: Coupon) {
        this._spinner.show();
        try {
            const response: any = await this._couponRepo.deleteCoupon(coupon.id);
            if (response.code === 'Success') {
                this._notification.pushAlert('Xóa coupon thành công', `coupon ${coupon.code} đã được xóa`, 'success');
                this.getList(this.sort, this.order);
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

    //hande checkbox enable/disable
    handleCheckboxEnableTCoupon(enable: boolean, coupon: Coupon) {
        this.enableCoupon(coupon.id, enable);
    }

    //fn ẩn, hiện tour
    async enableCoupon(id: string, enable: boolean) {
        this._spinner.show();
        try {
            const response: any = await this._couponRepo.enableCoupon(id, enable);
            if (response.code === 'Success') {
                if (enable) {
                    this._notification.pushAlert('Thành công', 'coupon đã được active', 'success');
                }
                if (!enable) {
                    this._notification.pushAlert('Thành công', 'coupon đã được ẩn', 'success');
                }
                this.getList(this.sort, this.order);
            }
            else {
                this.handleError(response.errors[0]);
            }
            this._spinner.hide();

        } catch (error) {
            this.handleError(error);
        }
    }

}
