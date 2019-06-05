import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

import { AppList } from '../../../../app.list';
import { Spinner, TourRepo, NotificationService, Error, Image } from '../../../../common';

import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'recommend-tour',
    templateUrl: './recommend-tour.component.html',
    styleUrls: ['./recommend-tour.component.less']
})
export class RecommendTourComponent extends AppList {

    categories: ICategoryRecommend[] = [];

    constructor(private _spinner: Spinner,
        private _tourRepo: TourRepo,
        private _title: Title,
        private _notification: NotificationService,
        private _router: Router
    ) {
        super();
        this.request = this.getListRecommendTour;
        this._title.setTitle("DataEntry - Tour đề xuất");
    }

    ngOnInit(): void {
        this.getListRecommendTour();
    }

    getListRecommendTour() {
        this._spinner.show();
        const body = {
            keyword: null,
            sortBy: "name",
            descending: false
        }
        this._tourRepo.getListRecommendTour((this.page - 1) * this.pageSize, this.limit, body)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => { this._spinner.hide() }),
                catchError((error) => this.catchError(error))
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    } else {
                        this.total = res.total;
                        this.categories = [];
                        Observable.from(res.data)
                            .map((item: ICategoryRecommend) => {
                                return {
                                    id: item.id,
                                    code: item.code,
                                    type: item.type,
                                    name: item.name,
                                    priceFrom: item.priceFrom,
                                    photo: item.photo,
                                    photoDesktop: item.photoDesktop,
                                    listTour: item.listTour,
                                    weight: item.weight
                                }
                            })
                            .subscribe((data: ICategoryRecommend) => {
                                this.categories.push(data);
                            })
                    }
                },
                (errr) => {
                    this.handleErrors(errr);
                },
                () => { }
            )
    }

    onDeleteCategory(category: ICategoryRecommend) {
        this._notification.pushQuestion(`Xóa ${category.name}`, 'Bạn có chắc?', true, 'Xóa', 'Hủy').then((value: any) => {
            if (value.value) {
                this.deleteCategory(category.id);
            }
        })
    }

    deleteCategory(id: string) {
        this._spinner.show();
        this._tourRepo.deleteRecommendTour(id)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    } else {
                        this._notification.pushToast('Xóa thành công', '', 'success', 2000);
                        setTimeout(() => {
                            this.getListRecommendTour();
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

    onEdit(category: ICategoryRecommend) {
        this._router.navigate([`data-entry/extra-tour/create-recommend-tour/${category.id}`]);
    }

    addCategory() {
        this._router.navigate(['data-entry/extra-tour/create-recommend-tour']);

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
}

export interface ICategoryRecommend {
    id: string;
    type: string;
    code: string;
    name: string;
    priceFrom: string;
    photo: Image;
    photoDesktop: Image;
    listTour: String[];
    weight: number;

}
