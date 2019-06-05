import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { AppList } from '../../../../app.list';
import { ProductRepo, Spinner, ProductDestination, NotificationService, Product, Error, JsonResult } from '../../../../common';

import {  catchError, takeUntil, finalize } from 'rxjs/operators';
import { TYPE } from '../extra-activity.component';

@Component({
    selector: 'popular-daytour',
    templateUrl: './popular-daytour.component.html',
    styleUrls: ['./popular-daytour.component.less']
})

export class PopularDayTourComponent extends AppList {
    destinations: ProductDestination[] = [];
    selectedDestination: ProductDestination = null;

    products: Product[] = [];
    selectedProduct: Product = null;

    type: TYPE = TYPE.DAY_TOUR;
    limit: number = 10;
    pageSize: number = 5;
    selectedIndex: number = 0;

    constructor(private _productRepo: ProductRepo,
        private _spinner: Spinner,
        private _notification: NotificationService,
    ) {
        super();
        this.request = this.getListProductByTypeAndDestination;
    }

    ngOnInit() {
        this.getListDestination(this.type);
    }

    selectDestination(destination: any) {
        if (destination !== this.selectedDestination) {

            //reset offset
            this.page = 1;
            this.selectedDestination = destination;
            this.getListProductByTypeAndDestination(this.type, this.selectedDestination, this.page);
        }
    }

    selectProduct(product: Product) {
        this.selectedProduct = product;
    }

    //fn get list destination
    getListDestination(type: string) {
        this._spinner.show();
        this._productRepo.getDestination(type)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: JsonResult) => {
                    if (res.code !== 'Success') {
                        this.handleErrors(new Error(res.errors[0]));
                    }
                    else {
                        this.destinations = (res.data || []).map((item: any) => new ProductDestination(item));
                        this.selectedDestination = this.destinations[0];

                        //get list product
                        this.getListProductByTypeAndDestination(this.type, this.selectedDestination, this.page);
                    }
                },
                // error
                (errs: any) => {
                    this.handleErrors(errs)
                },
                // complete
                () => { })
    }

    //fn get list product by type and destination
    getListProductByTypeAndDestination(type: string, destination: ProductDestination, page: number = 1) {
        this._spinner.show();
        this._productRepo.getProductsByDestination(type, destination, (page - 1) * this.pageSize, this.limit)
            .pipe(
                catchError(this.catchError),
                finalize(() => { this._spinner.hide(); })
            )
            .subscribe(
                (res: JsonResult) => {
                    if (res.code !== 'Success') {
                        this.handleErrors(new Error(res.errors[0]));
                    }
                    else {
                        this.products = (res.data.results || []).map((item: any) => new Product(item));
                        this.total = res.data.total || 0;
                    }
                },
                (errs) => { this.handleErrors(errs) },
                () => { })
    }

    createPopularActivity(id: string) {
        this._spinner.show();
        this._productRepo.createPopularActivity(id)
            .pipe(
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() })
            )
            .subscribe(
                (res: JsonResult) => {
                    if (res.code !== 'Success') {
                        this.handleErrors(new Error(res.errors[0]));
                    }
                    else {
                        this.getListProductByTypeAndDestination(this.type, this.selectedDestination, this.page);
                    }
                },
                (errs: any) => { this.handleErrors(errs) },
                () => {
                    this._notification.pushToast('Thêm vé thành công', '', 'success', 2000);
                    this.keyword = '';
                })
    }

    deleteProduct(id: string) {
        this._spinner.show();
        this._productRepo.deletePopularActivity(id)
            .pipe(
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() })
            )
            .subscribe(
                (res: JsonResult) => {
                    if (res.code === 'Success') {
                        this._notification.pushAlert('Xóa vé thành công', '', 'success', 2000);

                        this.getListProductByTypeAndDestination(this.type, this.selectedDestination, this.page);
                    } else {
                        this.handleErrors(new Error(res.errors[0]));
                    }
                },
                (errs: any) => { this.handleErrors(errs) },
                () => { }
            )
    }

    updateProduct(id: string, data: any = {}) {
        this._spinner.show();
        this._productRepo.updatePopularActivity(id, data)
            .pipe(
                catchError((this.catchError)),
                finalize(() => { this._spinner.hide() })
            )
            .subscribe(
                (res: JsonResult) => {
                    if (res.code === 'Success') {
                        this.getListProductByTypeAndDestination(this.type, this.selectedDestination, this.page);
                    } else {
                        this.handleErrors(new Error(res.errors[0]));
                    }
                },
                (errs: any) => { this.handleErrors(errs) },
                () => { }
            )

    }

    onUpdateProduct(dropIndex: number = 0, product: Product) {
        const body = {
            weight: dropIndex + 1,
            destination: this.selectedDestination
        }
        this.updateProduct(product.id, body);
    }

    onCreate(id: string) {
        this.createPopularActivity(id);
    }

    onDeleteProduct(product: Product) {
        this._notification.pushQuestion(`${product.name}`, 'Bạn có chắc?', true, 'Xóa', 'Hủy').then((value: any) => {
            if (value.value) {
                this.deleteProduct(product.id);
            }
        })
    }

    pageChanged(event: any): void {
        if (this.page !== event.page || this.pageSize !== event.itemsPerPage) {
            this.page = event.page;
            this.pageSize = event.itemsPerPage;

            // this.request(this.sort, this.order);
            this.getListProductByTypeAndDestination(this.type, this.selectedDestination, this.page);

        }
    };

    onChangeLimitSize(number: number) {
        this.limit = number;
        this.getListProductByTypeAndDestination(this.type, this.selectedDestination, this.page);
    }

    onDropProduct($event: any) {
        if (this.selectedIndex !== $event.dropIndex) {
            this.onUpdateProduct($event.dropIndex, $event.value);
        }
    }

    onDragProduct(index: number) {
        this.selectedIndex = index;
    }

    //fn handle error
    handleErrors(error: any) {

        if (error instanceof HttpErrorResponse) {
            this._notification.pushToast(`${error.message}`, '', 'error', 3000, { showConfirmButton: false });
        }
        if (error instanceof Error) {
            this._notification.pushToast(`${!!error.value ? error.value : 'Có lỗi xảy ra, Vui lòng kiểm tra lại'}`, '', 'error', 3000, { showConfirmButton: false });
        }
        else {
            this._notification.pushToast(`Có lỗi xảy ra, Vui lòng kiểm tra lại`, '', 'error', 3000, { showConfirmButton: false });
        }
        this._spinner.hide();
    }

}
