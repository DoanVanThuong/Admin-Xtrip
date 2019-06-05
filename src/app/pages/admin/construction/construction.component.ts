import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstructionCode, Spinner, NotificationService, Error, GlobalRepo } from '../../../common';
import { AppList } from '../../../app.list';

@Component({
    selector: 'app-contruction',
    templateUrl: './construction.component.html',
    styleUrls: ['./construction.component.less']
})
export class ConstructionComponent extends AppList{

    codes: ConstructionCode[] = [];
    headers:any[] = [];

    constructor(private _router: Router,
        private _spinner: Spinner,
        private _notificaiton: NotificationService,
        private _globalRepo: GlobalRepo,
        private _activedRoute: ActivatedRoute) { 
        super();
        this.request = this.getList;
    }

    ngOnInit(): void {
        this._activedRoute.queryParams.subscribe((params: any) => {
            if (params.page) {
                this.page = parseInt(params.page);
            }
            if (params.size) {
                this.limit = parseInt(params.size);
            }
            this.getList();
        })

        this.getList();

        this.headers = [
            { title: '#', field: 'stt'},
            { title: 'Mã công trình', field: 'code', sortable: true },
            { title: 'Tên', field: 'name', sortable: true },
            { title: 'Loại', field: 'type', sortable: true },
            { title: 'Ngày khởi hành', field: 'departDate', sortable: true },
            { title: 'Ngày tạo', field: 'createdDate', sortable: true },
            { title: 'Chức năng', field: 'action', },
        ]
     }

    onCreate(){
        this._router.navigate(['admin/construction/create']);
    }

    onEdit(code: ConstructionCode) {
        this._router.navigate([`admin/construction/detail/${code.id}`]);
    }

    //fn get list tour hot
    async getList(sortField?: string, order?: boolean) {
        this._spinner.show();
        const body = {
            searchValue: this.keyword,
            searchField: 'code',
            orderBy: !!sortField ? sortField : 'createdDate',
            sort: !!order ? 1 : -1
        }
        try {
            const dataFormServe: any = await this._globalRepo.getListConstructionCode((this.page - 1) * this.pageSize, this.limit, body);
            this.codes = (dataFormServe.data.result || []).map((item: any) => new ConstructionCode(item));
            this.total = dataFormServe.data.total = dataFormServe.data.filtered || 0;
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    pageChanged(event: any): void {
        if (this.page !== event.page || this.pageSize !== event.itemsPerPage) {
            this.page = event.page;
            this.pageSize = event.itemsPerPage;

            this.request(this.sort, this.order);
            this._router.navigate(['admin/construction'], {
                queryParams: {
                    page: this.page,
                    size: this.limit
                }
            });
        }
    };

    onChangeLimitSize(number: number) {
        this.limit = number;
        this._router.navigate(['admin/construction'], {
            queryParams: {
                page: this.page,
                size: this.limit
            }
        });

    }
}
