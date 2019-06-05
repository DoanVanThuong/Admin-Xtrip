import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { AppBase } from '../../../../../app.base';
import { TourRepo, NotificationService, Spinner, Error, Image } from '../../../../../common';
import { ICategoryRecommend } from '../../recommend-tour/recommend-tour.component';
import { ACTION_TOUR } from '../../../../../app.constants';

import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';

enum TYPE_PHOTO {
    DESKTOP = 'desktop',
    MOBILE = 'mobile'
}
@Component({
    selector: 'create-recommend-tour',
    templateUrl: './create-recommend-tour.component.html',
    styleUrls: ['./create-recommend-tour.component.less']
})
export class CreateRecommendTourComponent extends AppBase {
    action: string = ACTION_TOUR.CREATE;
    id: string;
    param: any;

    categories: ICategories;
    selectedCategory: ICategory;

    tourList: String[] = [];

    formRecommedTour: FormGroup;
    name: AbstractControl;
    code: string;
    weight: AbstractControl;

    imgDefault: string = 'assets/images/img-inputfile.png';
    path: string = 'Recommend';
    photoMobile: Image = new Image({ src: this.imgDefault, name: '' });
    photoDesktop: Image = new Image({ src: this.imgDefault, name: '' });

    typePhotos: ITypePhoto[] = [];
    selectedTypePhoto: ITypePhoto;

    categoryRecommend: ICategoryRecommend;
    constructor(
        private _spinner: Spinner,
        private _tourRepo: TourRepo,
        private _notification: NotificationService,
        private _title: Title,
        private _router: Router,
        private _formbuilder: FormBuilder,
        private _activedRouter: ActivatedRoute
    ) {
        super();
        this._title.setTitle("DataEntry - Thêm tour đề xuất");
    }

    ngOnInit(): void {
        this.typePhotos = [
            { type: TYPE_PHOTO.DESKTOP, icon: 'fa fa-desktop fa-3x' },
            { type: TYPE_PHOTO.MOBILE, icon: 'fa fa-mobile fa-4x' },
        ]
        this.selectedTypePhoto = this.typePhotos[0];

        this.getListCategory();
        this.initForm();

    }

    getParam() {
        this._activedRouter.params.subscribe((param: any) => {
            if (param.id) {
                this.id = param.id;
                this.action = ACTION_TOUR.UPDATE;
                this.getDetailRecommendTour(this.id);
            }
        })
    }

    initForm() {
        this.formRecommedTour = this._formbuilder.group({
            'name': [, Validators.compose([
                Validators.required
            ])],
            'weight': [1, Validators.compose([
                Validators.required
            ])],
        })

        this.name = this.formRecommedTour.controls['name'];
        this.weight = this.formRecommedTour.controls['weight'];
    }

    initFormUpdate() {
        const categorry = [...this.categories.domestic, ...this.categories.international];
        this.selectedCategory = categorry.filter((category: ICategory) => category.code === this.categoryRecommend.code)[0];

        this.formRecommedTour.setValue({
            name: this.categoryRecommend.name,
            weight: this.categoryRecommend.weight
        });

        this.photoDesktop = this.categoryRecommend.photoDesktop;
        this.photoMobile = this.categoryRecommend.photo;
        this.tourList = this.categoryRecommend.listTour;
    }

    getListCategory() {
        this._spinner.show();
        forkJoin(
            this._tourRepo.getTourCategories({ isInternational: true, keyword: '' }),
            this._tourRepo.getTourCategories({ isInternational: false, keyword: '' })
        ).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError(this.catchError),
            finalize(() => { this._spinner.hide() }),
        )
            .subscribe(
                ([international, domestic]: any) => {
                    this.categories = { ...{ international }, ...{ domestic } };
                    this.selectedCategory = this.categories.international[0];

                    this.getParam();
                },
                // error
                (err: any) => { this.handleErrors(err) },
                // complete
                () => { }
            )
    }

    getDetailRecommendTour(id: string) {
        this._spinner.show();
        this._tourRepo.getDetailRecommedTour(id)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    }
                    // thêm thành công
                    else {
                        this.categoryRecommend = res;
                        this.initFormUpdate();
                    }
                },
                (error: any) => { this.handleErrors(error) },
                () => { }
            )
    }
    onChangeCategory(category: any) {
        if (!!category) {
            this.selectedCategory = category;
        }
    }

    onAddtourCode(code: string) {
        if (!!code) {
            for (let index = 0; index < this.tourList.length; index++) {
                if (code === this.tourList[index])
                    return;
            }
            this.checkCodeTour(code);
        } else return;
    }

    deleteTourItemCode(index: number) {
        this.tourList.splice(index, 1);
    }

    checkCodeTour(code: string) {
        this._spinner.show();
        this._tourRepo.getTourByCode(code)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    }
                    // thêm thành công
                    else {
                        this.tourList.push(code);
                        this.code = '';
                    }
                },
                (error: any) => { this.handleErrors(error); return; },
                () => { }
            )
    }
    submit(data: any) {
        const body = {
            code: this.selectedCategory.code,
            name: data.name,
            type: this.findTypeTour(this.selectedCategory),
            listTour: this.tourList,
            photoDesktop: this.photoDesktop,
            photo: this.photoMobile,
            weight: 1
        }
        if (this.action === ACTION_TOUR.CREATE) {
            this.onCreate(body);
        } else this.onUpdate(this.id, body);
    }


    onUpdate(id: string, data: any) {
        this._tourRepo.updateRecommendTour(id, data)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    }
                    // thêm thành công
                    else {
                        this._notification.pushAlert('Thành công', 'Tour đề xuất đã được cập nhật thành công', 'success', 3000);
                    }
                },
                (error: any) => { this.handleErrors(error) },
                () => { }
            )
    }

    onCreate(data: any) {
        this._tourRepo.createRecommendTour(data)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(this.catchError),
                finalize(() => { this._spinner.hide() }),
            )
            .subscribe(
                (res: any) => {
                    if (res instanceof Error) {
                        this.handleErrors(new Error(res));
                    }
                    else {
                        this._notification.pushAlert('Thành công', 'Thêm tour đề xuất thành công', 'success', 3000);
                        setTimeout(() => {
                            this._router.navigate(['data-entry/extra-tour'], { queryParams: { tab: 'recommend-tour' } });
                        }, 1000)
                    }
                },
                (error: any) => { this.handleErrors(error) },
                () => { }
            )
    }


    selectTypePhoto(type: any) {
        this.selectedTypePhoto = type;
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

    findTypeTour(object: any = {}) {
        let kq = '';
        for (const item of this.categories.domestic) {
            if (item === object) {
                kq = 'domestic';
            }
        }
        for (const item of this.categories.international) {
            if (item === object) {
                kq = 'international'
            }
        }
        return kq;
    }

    upLoadImage($event: any, type: TYPE_PHOTO) {
        switch (type) {
            case TYPE_PHOTO.DESKTOP:
                this.photoDesktop.src = $event;
                break;
            case TYPE_PHOTO.MOBILE:
                this.photoMobile.src = $event;
                break;
            default:
                break;
        }
    }

}

interface ICategories {
    domestic: ICategory[],
    international: ICategory[],
}
interface ICategory {
    id: string;
    code: string;
    name: string;
    selected: boolean;
}
interface ITypePhoto {
    type: TYPE_PHOTO;
    icon: string;
}
