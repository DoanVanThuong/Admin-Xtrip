import { Component, ViewChild } from '@angular/core';
import { AppList } from '../../../app.list';
import { Receipt, CashierRepo, NotificationService, Spinner, Error } from '../../../common';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewReceiptPopupComponent } from '../../../components';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.less']
})
export class ReceiptComponent extends AppList {
    @ViewChild(PreviewReceiptPopupComponent) previewReceipt: PreviewReceiptPopupComponent;

    receipts: Receipt[] = [];
    receipt: Receipt = null;
    receiptDetail: Receipt = null;
    headers: any[] = [];

    constructor(private _router: Router,
        private _spinner: Spinner,
        private _notificaiton: NotificationService,
        private _cashierRepo: CashierRepo,
        private _activedRoute: ActivatedRoute,
        private _notification: NotificationService) {
        super();
        this.request = this.getListReceipt;
    }

    ngOnInit() {
        this._activedRoute.queryParams.subscribe((params: any) => {
            if (params.page) {
                this.page = parseInt(params.page);
            }
            if (params.size) {
                this.limit = parseInt(params.size);
            }
            this.getListReceipt();
        })
        this.headers = [
            { title: '#', field: 'stt' },
            { title: 'Chứng từ', field: 'code', sortable: true },
            { title: 'Loại', field: 'type', sortable: true },
            { title: 'Khách hàng', field: 'customerName', sortable: true },
            { title: 'Diễn giải', field: 'name', sortable: true },
            { title: 'Tổng tiền', field: 'total', sortable: true },
            { title: 'Ngày chứng từ', field: 'date', sortable: true },
            { title: 'Ngày tạo', field: 'createdDate', sortable: true },
            { title: 'Tình trạng', field: 'status', sortable: true },
            { title: 'Chức năng', field: 'action', },
        ]
    }

    onCreate() {
        this._router.navigate(['cashier/receipt/create']);
    }

    onPrint(id: string) {
        this.getDetailReceipt(id);
    }

    //fn get list receipt
    async getListReceipt(sortField?: string, order?: boolean) {
        this._spinner.show();
        const body = {
            searchValue: this.keyword,
            searchField: 'code',
            orderBy: !!sortField ? sortField : 'createdDate',
            sort: !!order ? 1 : -1
        }
        try {
            const dataFormServe: any = await this._cashierRepo.getListOrderReceipt((this.page - 1) * this.pageSize, this.limit, body);
            this.receipts = (dataFormServe.data.result || []).map((item: any) => new Receipt(item));

            this.total = dataFormServe.data.total = dataFormServe.data.filtered || 0;

        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    async onDetail(receipt: Receipt) {
        this._router.navigate([`cashier/receipt/detail/${receipt.id}`]);
    }


    // fn page changed
    pageChanged(event: any): void {
        if (this.page !== event.page || this.pageSize !== event.itemsPerPage) {
            this.page = event.page;
            this.pageSize = event.itemsPerPage;

            this.request(this.sort, this.order);
            this._router.navigate(['cashier/receipt'], {
                queryParams: {
                    page: this.page,
                    size: this.limit
                }
            });
        }
    };

    //on change limit
    onChangeLimitSize(number: number) {
        this.limit = number;
        this._router.navigate(['cashier/receipt'], {
            queryParams: {
                page: this.page,
                size: this.limit
            }
        });

    }

    //fn handle error
    handleError = (errors: Array<any>) => {
        let err: any;
        if (!!errors.length) {
            err = new Error(errors[0]);
        }

        switch (err.code) {
            case 2002: {
                this._notification.pushToast(err.value, '', 'error', 1000, { showConfirmButton: false });
                break;
            }
            default:
                this._notification.pushToast(err.value, '', 'error', 1000, { showConfirmButton: false });
                break;
        }
    }

    //fn get detail
    async getDetailReceipt(id) {
        this._spinner.show();
        try {
            const res: any = await this._cashierRepo.getDetailReceipt(id);
            this.receiptDetail = new Receipt(res.data);

            setTimeout(() => {
                this.print('printer');
            }, 1000);

        } catch (error) {
            this.handleError(error[0]);
        }
        finally {
            this._spinner.hide();
        }
    }
}
