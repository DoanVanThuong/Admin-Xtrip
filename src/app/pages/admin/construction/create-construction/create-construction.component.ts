import { Component } from '@angular/core';
import { AppBase } from '../../../../app.base';
import { TourSupplier, TourRepo, Spinner, Error, NotificationService, TourDepart, TourArrival, GlobalRepo } from '../../../../common';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import * as _ from 'lodash';
import swal from 'sweetalert2';

enum TYPE {
    FLIGHT = 1,
    HOTEL = 2,
    TOUR = 3,
    PRODUCT = 4,
    OTHER = 6
}

@Component({
    selector: 'create-construction',
    templateUrl: './create-construction.component.html',
    styleUrls: ['./create-construction.component.less']
})
export class CreateConstructionComponent extends AppBase {
    types: any[] = [];
    SelectedType: any = null;

    tourSuppliers: TourSupplier[] = new Array<TourSupplier>();
    tourSupplierSelected: any = null;

    tourTypes: any[] = [];
    tourTypeSelected: any = null;

    departs: TourDepart[] = new Array<TourDepart>();
    arrivals: TourArrival[] = new Array<TourArrival>();
    selectedDepart: TourDepart = new TourDepart();
    selectedArrival: TourArrival = new TourArrival();

    formTour: FormGroup;
    formService: FormGroup;
    formOther: FormGroup;
    placeDepart: AbstractControl;
    placeArrival: AbstractControl;
    name: AbstractControl;
    description: AbstractControl;
    tourType: AbstractControl;
    departDate: AbstractControl;
    serialCode: AbstractControl;

    isSearch: boolean = false;
    isSelectedDepart: boolean = false;
    isSelectedArrival: boolean = false;

    id: string = '';
    code: string = '';
    action: string = 'create';
    constructionDetail: IConstruction = null;

    constructor(private _tourRepo: TourRepo,
        private _spinner: Spinner,
        private _notificaiton: NotificationService,
        private fb: FormBuilder,
        private _globalRepo: GlobalRepo,
        private _activedRoute: ActivatedRoute,
        private _router: Router) {
        super();
    }

    ngOnInit(): void {

        this.types = [
            { title: 'Tour', value: TYPE.TOUR },
            { title: 'Máy bay', value: TYPE.FLIGHT },
            { title: 'Khách sạn', value: TYPE.HOTEL },
            { title: 'Vé vui chơi tham quan', value: TYPE.PRODUCT },
            { title: 'Dịch vụ khác', value: TYPE.OTHER },

        ];
        this.SelectedType = this.types[0];
        this.initFormTour();

        this.tourTypes = [{ title: 'Tour trong nước', selected: true, IsInternational: false }, { title: 'Tour nước ngoài', selected: false, IsInternational: true }];
        this.tourTypeSelected = this.tourTypes[0].IsInternational;

        this.getTourSuppliers();

        this._activedRoute.params.subscribe((params: any) => {
            if (params.id) {
                this.action = 'update';
                this.id = params.id;
                this.getDetail(this.id);
            }
        });
    }

    //fn get detail
    async getDetail(id: string = '') {
        this._spinner.show();
        try {
            const response: any = await this._globalRepo.getDetailConstructionCode(id);
            this.constructionDetail = response.data;
            this.code = this.constructionDetail.code;
            if (this.constructionDetail.type === TYPE.TOUR) {
                this.initFormTour();
            }
            if (this.constructionDetail.type === TYPE.OTHER) {
                this.initFormOther();
            }
            else {
                this.initFormSerice();
            }

            this.initFomUpdate();

        } catch (error) { }
    }

    //fn initForm update
    async initFomUpdate() {
        this.SelectedType = this.types.filter((item: any) => item.value === this.constructionDetail.type)[0];
        // detect loại để update form
        if (this.SelectedType.value !== TYPE.TOUR) {
            if (this.SelectedType.value === TYPE.OTHER) {
                this.formOther.setValue({
                    serialCode: this.constructionDetail.code,
                    name: this.constructionDetail.name,
                    description: this.constructionDetail.description
                });
            }
            else {
                this.formService.setValue({
                    departDate: this.constructionDetail.departDate,
                    name: this.constructionDetail.name,
                    description: this.constructionDetail.description
                });
            }
        }
        else {
            const departs = await this.getTourdeparture("");
            const arrivals = await this.getTourArrival(this.constructionDetail.isInternational, "");

            this.selectedDepart = _.head(departs.filter((depart: TourDepart) => depart.id === this.constructionDetail.departureId));
            this.selectedArrival = _.head(arrivals.filter((arrival: TourArrival) => arrival.id === this.constructionDetail.arrivalId));
            this.tourSupplierSelected = this.tourSuppliers.filter((supplier: TourSupplier) => supplier.id === this.constructionDetail.supplierId)[0];
            this.formTour.setValue({
                departDate: this.constructionDetail.departDate,
                name: this.constructionDetail.name,
                description: this.constructionDetail.description,
                placeDepart: this.selectedDepart.name,
                placeArrival: this.selectedArrival.name,
                tourType: this.constructionDetail.isInternational
            });
        }
    }

    //init form tour
    initFormTour() {
        this.formTour = this.fb.group({
            'placeDepart': [, Validators.compose([
                Validators.required
            ])],
            'placeArrival': [, Validators.compose([
                Validators.required
            ])],
            'name': [, Validators.compose([
                Validators.required
            ])],
            'description': [, Validators.compose([
                Validators.required
            ])],
            'tourType': [{ value: this.tourTypeSelected, disabled: this.action === 'update' ? true : false }],
            'departDate': [moment()],
        });

        this.placeDepart = this.formTour.controls['placeDepart'];
        this.placeArrival = this.formTour.controls['placeArrival'];
        this.name = this.formTour.controls['name'];
        this.description = this.formTour.controls['description'];
        this.tourType = this.formTour.controls['tourType'];
        this.departDate = this.formTour.controls['departDate'];

    }

    //init form services
    initFormSerice() {
        this.formService = this.fb.group({
            'name': [, Validators.compose([
                Validators.required
            ])],
            'description': [, Validators.compose([
                Validators.required
            ])],
            'departDate': [moment()],
        });

        this.name = this.formService.controls['name'];
        this.description = this.formService.controls['description'];
        this.departDate = this.formService.controls['departDate'];
    }

    //init form for other
    initFormOther() {
        this.formOther = this.fb.group({
            'name': [, Validators.compose([
                Validators.required
            ])],
            'description': [, Validators.compose([
                Validators.required
            ])],
            'serialCode': [, Validators.compose([
                Validators.required
            ])],
        });

        this.name = this.formOther.controls['name'];
        this.description = this.formOther.controls['description'];
        this.serialCode = this.formOther.controls['serialCode'];
    }

    selectType(type: any) {
        this.SelectedType = type;
        if (this.SelectedType.value === TYPE.TOUR) {
            this.initFormTour();

            this.selectedDepart = new TourDepart();
            this.selectedArrival = new TourArrival(); 
        }
        if (this.SelectedType.value === TYPE.OTHER) {
            this.initFormOther();
        }
        else {
            this.initFormSerice();
        }
    }


    //fn get thông tin nhà cung cấp
    async getTourSuppliers() {
        this._spinner.show();
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestSupplier();
            this.tourSuppliers = (dataFormServer.data || []).map((item: any) => new TourSupplier(item));
            this.tourSupplierSelected = this.tourSuppliers[0];

        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    /* fn get tour Suggest  */
    async getTourdeparture(keyword: string) {
        this._spinner.show();
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestDepart(keyword);

            const data = (dataFormServer.data || []).map((item: any) => new TourDepart(item));
            return data;
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn get điểm đến
    async getTourArrival(type: boolean, keyword: string) {
        this._spinner.show();
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestArival(type, keyword);
            return (dataFormServer.data || []).map((item: any) => new TourArrival(item));
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    // fn search depart auto complete
    async searchDepart(keyword: string) {
        if (this.action !== 'update') {
            if (keyword.length > 0) {

                [this.isSearch, this.isSelectedDepart] = [true, false];
                this.departs = await this.getTourdeparture(keyword);
            }
            else if (keyword.length == 0) {
                this.onHideSearch();
                this.isSelectedDepart = false;
            }
        }
        else
            return;

    }

    // fn search Arrival auto complete
    async searchArrival(keyword: string) {
        if (this.action !== 'update') {
            if (keyword.length > 0) {
                [this.isSearch, this.isSelectedArrival] = [true, false];
                this.arrivals = await this.getTourArrival(this.tourTypeSelected, keyword);
            }
            else if (keyword.length == 0) {
                this.onHideSearch();
                this.isSelectedArrival = false;
            }
        }
        else
            return;
    }

    //chọn nơi khởi hành sau khi search autocomplete
    selectDepart(depart: TourDepart) {
        this.isSearch = false;
        if (this.selectedDepart.code != depart.code) {
            this.selectedDepart = depart;
            this.placeDepart.setValue(this.selectedDepart.name);
            this.isSelectedDepart = true;
            this.onHideSearch();
        }
        else {
            this.isSelectedDepart = true;
            this.onHideSearch();
            return;
        }

    }

    //chọn mơi đến sau khi search autocomplete
    selectArrival(arrival: TourDepart) {
        this.isSearch = false;
        if (this.selectedArrival.code != arrival.code) {
            this.selectedArrival = arrival;
            this.placeArrival.setValue(this.selectedArrival.name);
            this.isSelectedArrival = true;
            this.onHideSearch();
        }
        else {
            this.isSelectedArrival = true;
            this.onHideSearch();
            return;
        }
    }

    //fn hide search autocomplete
    onHideSearch() {
        this.isSearch = false;
        this.departs = [];
        this.arrivals = [];
    }

    //đổi nơi đến ( trong nước or quốc tế)
    onChangeTourType(tourType: any) {
        this.tourTypeSelected = tourType.IsInternational;
        this.placeArrival.setValue("");
        this.departDate.setValue(moment());
    }

    //fn submit form
    onSubmit(form: any) {
        const tour = {
            code: (this.action !== 'update' ? null : this.constructionDetail.code),
            id: (this.action !== 'update' ? null : this.constructionDetail.id),
            name: form.name,
            description: form.description,
            isInternational: this.tourTypeSelected,
            departureId: this.selectedDepart.id,
            arrivalId: this.selectedArrival.id,
            supplierId: this.tourSupplierSelected.id,
            departDate: moment(form.departDate).format("YYYY-MM-DD"),
            type: this.SelectedType.value
        }
        const service = {
            code: (this.action !== 'update' ? null : this.constructionDetail.code),
            id: (this.action !== 'update' ? null : this.constructionDetail.id),
            name: form.name,
            description: form.description,
            departDate: moment(form.departDate).format("YYYY-MM-DD"),
            type: this.SelectedType.value
        }

        const other = {
            id: (this.action !== 'update' ? null : this.constructionDetail.id),
            code: (this.action !== 'update' ? form.serialCode : this.constructionDetail.code),
            name: form.name,
            description: form.description,
            type: this.SelectedType.value
        }

        switch (this.SelectedType.value) {
            case TYPE.TOUR: {
                if (this.action !== 'update') {
                    this.onCreate(tour);
                }
                else {
                    this.onUpdate(tour, this.id);
                }
                break;
            }
            case TYPE.OTHER: {
                if (this.action !== 'update') {
                    this.onCreate(other);
                }
                else {
                    this.onUpdate(other, this.id);
                }
                break;
            }

            default: {
                if (this.action !== 'update') {
                    this.onCreate(service);
                }
                else {
                    this.onUpdate(service, this.id);
                }
                break;
            }
        }
    }

    //fn create
    async onCreate(data: any = {}) {
        this._spinner.show();
        try {
            await this._globalRepo.createConstructionCode(data);
            this._notificaiton.pushAlert(`Thành công`, 'Mã công trình đã được tạo', 'success', 2000);
            swal({
                title: "Mã công trình đã được tạo",
                type: "success",
            }).then(() => {
                this._router.navigate(['admin/construction']);
            });
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    async onUpdate(data: any = {}, id: string = '') {
        this._spinner.show();
        try {
            await this._globalRepo.updateConstructionCode(data, id);
            this._notificaiton.pushAlert(`Update thành công`, `Mã công trình ${data.code} đã được update`, 'success', 2000);

        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }
}

interface IConstruction {
    arrivalId: string;
    code: string;
    departDate: string;
    departureId: string;
    description: string;
    id: string;
    isInternational: boolean;
    name: string;
    supplierId: string;
    type: number;
}
