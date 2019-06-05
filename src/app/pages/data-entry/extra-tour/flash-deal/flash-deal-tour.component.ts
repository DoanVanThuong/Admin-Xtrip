import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

import { AppList } from '../../../../app.list';
import { Spinner, TourRepo, NotificationService, Error, Image } from '../../../../common';

import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'flash-deal-tour',
    templateUrl: './flash-deal-tour.component.html',
    styleUrls: ['./flash-deal-tour.component.less']
})
export class FlashDealTourComponent extends AppList {
    tours: ITourFlashDeal[] = [];
    constructor(private _spinner: Spinner,
        private _tourRepo: TourRepo,
        private _notification: NotificationService,
        private _router: Router,
        private _title: Title
    ) {
        super();
        this.request = this.getListFlashDealTour;
    }

    ngOnInit() {
        this.getListFlashDealTour();
        this._title.setTitle("DataEntry - Tour giờ chót");
    }

    //fn get list destination
    getListFlashDealTour() {
        this._spinner.show();
        const body = {
            keyword: null,
            sortBy: "adultPrice",
            descending: false
        }
        this._tourRepo.getListFlashDealTour((this.page - 1) * this.pageSize, this.limit, body)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    }else {
                        this.tours = (res.data || []).map((item: ITourFlashDeal) => ({
                            code: item.code,
                            adultPrice: item.adultPrice,
                            infantPrice: item.infantPrice,
                            childPrice: item.childPrice,
                            id: item.id,
                            name: item.name,
                            from: item.from,
                            to: item.to,
                            photo: new Image(item.photo),
                            days: item.days,
                            night: item.night
                        }));
                        this.total = res.total
                    }
                },
                // error
                (errs: any) => {
                    this.handleErrors(errs)
                },
                // complete
                () => { })
    }

    addTourFlashDeal() {
        this._router.navigate(['data-entry/extra-tour/create-flash-deal']);
    }

    onDeleteTour(tour: ITourFlashDeal) {
        this._notification.pushQuestion(`Xóa tour ${tour.name}`, 'Bạn có chắc?', true, 'Xóa', 'Hủy').then((value: any) => {
            if (value.value) {
                this.deleteTour(tour.id);
            }
        })
    }

    deleteTour(id: string) {
        this._spinner.show();
        this._tourRepo.deleteFlashDealTour(id)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    }else {
                        this._notification.pushToast('Xóa thành công','','success',2000);
                        setTimeout(() => {
                            this.getListFlashDealTour()
                        }, 1000)
                    }
                },
                // error
                (errs: any) => {
                    this.handleErrors(errs)
                },
                // complete
                () => { }
            )
    }

    onEdit(tour: ITourFlashDeal) {
        this._router.navigate([`data-entry/extra-tour/create-flash-deal/${tour.id}`], { queryParams: { id: tour.id, code: tour.code } });
    }

    //fn handle error
    handleErrors(error: any) {
        if (error instanceof HttpErrorResponse) {
            this._notification.pushToast(`${error.message}`, '', 'error', 3000, { showConfirmButton: false });
        }
        else if (error instanceof Error) {
            this._notification.pushToast(`${!!error.value ? error.value : 'Có lỗi xảy ra, Vui lòng kiểm tra lại'}`, '', 'error', 3000, { showConfirmButton: false });
        }
        else {
            this._notification.pushToast(`Có lỗi xảy ra, Vui lòng kiểm tra lại`, '', 'error', 3000, { showConfirmButton: false });
        }
        this._spinner.hide();
    }

    //fn copy clipboard
    onClipboardSuccess(e: any) {
        this._notification.pushToast('Đã copy mã', `${e.content}`, 'success', 1000, { showConfirmButton: false });
    }
}

interface ITourFlashDeal {
    id: string;
    code: string;
    name: string;
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    from: string;
    to: string;
    photo: Image;
    days: number;
    night: number;
}
