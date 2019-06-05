import { Component } from "@angular/core";
import { AbstractControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";

import { AppBase } from "../../../../../app.base";
import { TourRepo, NotificationService, Spinner, Error } from "../../../../../common";
import { ACTION_TOUR } from "../../../../../app.constants";

import { takeUntil, catchError, finalize } from "rxjs/operators";

@Component({
    selector: 'create-flash-deal-tour',
    templateUrl: './create-flash-deal-tour.component.html',
    styleUrls: ['./create-flash-deal-tour.component.less']
})
export class CreateFlashDealTourComponent extends AppBase {

    action: string = ACTION_TOUR.CREATE;
    formGroup: FormGroup;
    code: AbstractControl;
    adultPrice: AbstractControl;
    childPrice: AbstractControl;
    infantPrice: AbstractControl;
    startDate: AbstractControl;
    endDate: AbstractControl;
    startTime: AbstractControl;
    endTime: AbstractControl;

    tourDetail: any = null;
    isSearch: boolean = false;
    isValidStartTime: boolean = true;
    isValidEndTime: boolean = true;

    id: string;
    params: IParam;
    constructor(private _tourRepo: TourRepo,
        private _notification: NotificationService,
        private fb: FormBuilder,
        private _spinner: Spinner,
        private _router: Router,
        private _activedRouter: ActivatedRoute
    ) {
        super();
    }

    initForm() {
        this.formGroup = this.fb.group({
            'code': [, Validators.compose([
                Validators.required
            ])],
            'adultPrice': [, Validators.compose([
                Validators.required
            ])],
            'childPrice': [0, Validators.compose([
                Validators.required
            ])],
            'infantPrice': [0, Validators.compose([
                Validators.required
            ])],
            'startDate': [moment()],
            'endDate': [moment().add(1, 'days')],
            'startTime': [new Date(moment()), Validators.compose([
                Validators.required
            ])],
            'endTime': [new Date(moment()), Validators.compose([
                Validators.required
            ])],
        })

        this.code = this.formGroup.controls['code'];
        this.adultPrice = this.formGroup.controls['adultPrice'];
        this.childPrice = this.formGroup.controls['childPrice'];
        this.infantPrice = this.formGroup.controls['infantPrice'];
        this.startDate = this.formGroup.controls['startDate'];
        this.endDate = this.formGroup.controls['endDate'];
        this.startTime = this.formGroup.controls['startTime'];
        this.endTime = this.formGroup.controls['endTime'];
    }

    ngOnInit(): void {
        this.initForm();
        this.getParam();
    }

    getParam() {
        this._activedRouter.queryParams.subscribe((params: IParam) => {
            this.params = params;
            if (params.id && params.code) {
                this.action = ACTION_TOUR.UPDATE;
                this.id = params.id;
                this.getDetailFlashDealTour(this.id);
            }
        });
    }

    getDetailFlashDealTour(id: string) {
        this._spinner.show();
        this._tourRepo.updateFlashDealTour(id)
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
                        this.isSearch = true;

                        this.getDetailTour(this.params.code);
                        this.tourDetail = Object.assign({}, this.tourDetail, res);
                        this.initFormUpdate();
                    }
                },
                () => { },
                () => { }
            )
    }

    initFormUpdate() {
        this.formGroup.setValue({
            adultPrice: this.tourDetail.adultPrice,
            childPrice: this.tourDetail.childPrice,
            infantPrice: this.tourDetail.infantPrice,
            code: this.tourDetail.code,
            startDate: moment(this.tourDetail.from, "YYYY-MM-DD").format("DD/MM/YYYY"),
            endDate: moment(this.tourDetail.to, "YYYY-MM-DD").format("DD/MM/YYYY"),
            startTime: new Date(moment(this.tourDetail.from, "YYYY-MM-DDTHH:mm")),
            endTime: new Date(moment(this.tourDetail.to, "YYYY-MM-DDTHH:mm")),
        })
    }

    //fn khi blur khỏi input mct
    onBlurSerialCode(code: string) {
        if (this.action !== ACTION_TOUR.UPDATE) {
            if (!!code && code.length >= 8) {
                this.getDetailTour(code);
            }
            else {
                this.code.setValue(null);
                this.tourDetail = null;
                this.isSearch = false;
            }
        }
    }

    onGetDetailTour(data: any) {
        if (!!data) {
            this.isSearch = true;
            if (this.tourDetail.adultPrice) {
                this.adultPrice.setValue(this.tourDetail.adultPrice);
            }
            if (this.tourDetail.childPrice) {
                this.childPrice.setValue(this.tourDetail.childPrice);
            }
            if (this.tourDetail.infantPrice >= 0) {
                this.infantPrice.setValue(this.tourDetail.infantPrice);
            }
        }
    }

    //get detail tour
    getDetailTour(code: string) {
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
                        this.isSearch = false;
                        this.tourDetail = null;
                    } else {
                        this.tourDetail = res;
                        if (this.action !== ACTION_TOUR.UPDATE) {
                            this.onGetDetailTour(res);
                        }
                    }
                },
                // error
                (errs: any) => {
                    this.handleErrors(errs);
                },
                // complete
                () => { })
    }

    onSubmit(data: any) {
        this._spinner.show();

        const dateDepartStart = moment(data.startDate, "DD/MM/YYYY").format("DD/MM/YYYY") + ' ' + moment(data.startTime).format("HH:mm");
        const dateDepartEnd = moment(data.endDate, "DD/MM/YYYY").format("DD/MM/YYYY") + ' ' + moment(data.endTime).format("HH:mm");
        const body = {
            code: data.code.trim(),
            adultPrice: data.adultPrice,
            childPrice: data.childPrice,
            infantPrice: data.infantPrice,
            from: moment(dateDepartStart, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD[T]HH:mm"),
            to: moment(dateDepartEnd, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD[T]HH:mm")
        }
        if (this.action === ACTION_TOUR.CREATE) {
            this.createFlashDealTour(body)
        } else {
            this.updateFlashDealTour(this.id, body);
        }

    }

    updateFlashDealTour(id: string, data: any) {
        this._tourRepo.updateFlashDealTour(id, data)
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
                        this._notification.pushAlert('Thành công', 'Tour giờ chót đã được cập nhật thành công', 'success', 3000);
                    }
                },
                (error: any) => { this.handleErrors(error) },
                () => { }
            )
    }

    createFlashDealTour(data: any) {
        this._tourRepo.createFlashDealTour(data)
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
                        this._notification.pushAlert('Thành công', 'Thêm tour giờ chót thành công', 'success', 3000);
                        this._router.navigate(['data-entry/extra-tour'], { queryParams: { tab: 'flash-deal-tour' } });
                    }
                },
                (error: any) => { this.handleErrors(error) },
                () => { }
            )
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


interface IParam {
    code: string;
    id: string;
}
