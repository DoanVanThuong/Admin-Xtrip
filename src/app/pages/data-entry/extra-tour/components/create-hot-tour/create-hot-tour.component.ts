import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TourRepo, Error, NotificationService, Spinner } from '../../../../../common';
import { AppBase } from '../../../../../app.base';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'create-hot-tour',
    templateUrl: './create-hot-tour.component.html',
})
export class CreateHotTourComponent extends AppBase {

    type: string = 'hot';
    isInternational: boolean = false;
    formCreate: FormGroup;
    tourCode: AbstractControl;

    constructor(private _fb: FormBuilder,
        private _tourRepo: TourRepo,
        private _notificaiton: NotificationService,
        private _activedRouter: ActivatedRoute,
        private _spinner: Spinner, ) {
        super();
    }

    ngOnInit(): void {

        this.initForm();
        this.getParam();
        console.log(this.type, this.isInternational);
    }

    getParam() {
        this._activedRouter.queryParams.subscribe( (param: any) => {
            if(param.type) {
                this.type = param.type;
            }
            if(param.isInternational) {
                this.isInternational = param.isInternational
            }

        })
    }

    initForm() {
        this.formCreate = this._fb.group({
            'tourCode': [, Validators.compose([
                Validators.required,
            ])],
        })

        this.tourCode = this.formCreate.controls['tourCode'];
    }

    //fn submit
    async onSubmit(data: any) {
        this._spinner.show();
        const body = {
            tourCode: data.tourCode,
        }
        try {
            if (this.type === 'hot') {
                await this._tourRepo.createTourHot(body);
                this._notificaiton.pushToast('Thêm hot tour thành công', '', 'success', 2000);
            }
            else {
                await this._tourRepo.createTourPopular(Object.assign({}, body, { isInternational:  (this.isInternational === true ? true : false)}));
                this._notificaiton.pushToast('Thêm tour nổi bật thành công', '', 'success', 2000);
            }

        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

}
