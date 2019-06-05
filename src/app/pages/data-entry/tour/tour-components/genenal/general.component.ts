import { Component, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, AbstractControl, Validators, FormArray, FormControl } from "@angular/forms";
import { ActivatedRoute } from "../../../../../../../node_modules/@angular/router";

import { CINPUT, ACTION_TOUR, CSTORAGE } from "../../../../../app.constants";
import { AppForm } from "../../../../../app.form";
import { StorageService, NotificationService, Spinner } from "../../../../../common/services";
import { TourDepart, TourSupplier, TourTopic, TourService, TourArrival, TourGeneral, Error } from "../../../../../common/entities";
import { TourRepo, DateValidator, TourSuggestRepository } from "../../../../../common";
@Component({
    selector: 'tour-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.less'],
    encapsulation: ViewEncapsulation.None
})

export class TourGeneralComponent extends AppForm {
    action: any = 'create';
    tourId: string = '';
    days: number = 1;
    nights: number = 0;
    // config
    optionCurrencyMask: any = this.currencyMask;
    @Output() changeTab = new EventEmitter();
    tourGeneral: TourGeneral = null;
    // formBuilder
    formGeneral: FormGroup;
    tourName: AbstractControl; //tên tour
    tourCommissionRate: AbstractControl; //hoa hồng
    placeArrival: AbstractControl; //nơi đến
    tourType: AbstractControl;  //loại tour( trong nước/ quốc tế)
    numDay: AbstractControl;  //số ngày
    numNight: AbstractControl; //số đêm
    tourTopic: AbstractControl; //chủ đề tour
    journey: AbstractControl; //hành trình tour
    rewardPoints: AbstractControl;

    tourTypes: any[] = [];
    tourTypeSelected: any;

    //nhà cung cấp tour
    tourSuppliers: TourSupplier[] = new Array<TourSupplier>();
    tourSupplierSelected: TourSupplier = new TourSupplier();

    // suggest chủ đề, dịch vụ đi kèm, lợi ích
    tourTopics: TourTopic[] = new Array<TourTopic>();
    tourServices: TourService[] = new Array<TourService>();

    tourTopicsChecked: any[] = [];
    tourServicesChecked: any[] = [];

    departs: TourDepart[] = new Array<TourDepart>();
    arrivals: TourArrival[] = new Array<TourArrival>();
    catogories: TourDepart[] = new Array<TourArrival>();
    hightLightChoice: FormControl = new FormControl();

    highlights: any[] = [];
    highlightKeyword: string = '';

    selectedDepart: TourDepart = new TourDepart();
    selectedArrival: TourArrival = new TourArrival();
    selectedCategory: TourArrival[] = new Array<TourArrival>();

    nouisliderConfig: any = {
        connect: true,
        tooltips: true,
        format: {
            to: function (value) {
                return _.toInteger(value) + ' tuổi';
            },
            from: function (value) {
                return value.replace(',-', '');
            }
        }
    }
    nouisliderConfigAdult: any = {
        range: { min: 0, max: 85},
    };

    nouisliderConfigChild: any = {
        range: { min: 0, max: 18 },
    };

    nouisliderConfigInfant: any = {
        range: { min: 0, max: 18 },
    }
    adultRangeAge: number[] = [10, 80];
    childRangeAge: number[] = [2, 10];
    infantRangeAge: number[] = [0, 2];

    isearch: boolean = false;
    isSelectedArrival: boolean = false;
    isSelectedCategory: boolean = false;

    isMostPopular: boolean = false;
    constructor(private fb: FormBuilder,
        private _activeRouter: ActivatedRoute,
        private _tourRepo: TourRepo,
        private _localstorage: StorageService,
        private _alert: NotificationService,
        private _spinner: Spinner,
        private _tourSuggest: TourSuggestRepository) {

        super();
        //init loại tour và loai tour default
        this.tourTypes = [{ title: 'Tour trong nước', selected: true, IsInternational: false }, { title: 'Tour nước ngoài', selected: false, IsInternational: true }];
        this.tourTypeSelected = this.tourTypes[0].IsInternational;
    }

    ngOnInit() {
        // set config nouiSlider
        this.nouisliderConfigAdult = Object.assign({}, this.nouisliderConfig, this.nouisliderConfigAdult);
        this.nouisliderConfigChild = Object.assign({}, this.nouisliderConfig, this.nouisliderConfigChild);
        this.nouisliderConfigInfant = Object.assign({}, this.nouisliderConfig, this.nouisliderConfigInfant);

        this._activeRouter.queryParams.subscribe((params: any) => {
            if (!!params && params.id && params.action) {
                this.action = params.action;
                this.tourId = params.id;
                this.getTourInfo(this.tourId);
            }

        })
        this.getTourdeparture("");
        this.getTourSuppliers();
        this.getTourServices();
        this.getTourTopics();
        this.getCategories();

        //init form
        this.initForm();
    }

    //fn get thông tin chung của tour sau đó fill vào form
    async getTourInfo(id: string) {
        try {
            const data: any = await this._tourRepo.getTour(id);
            this.tourGeneral = new TourGeneral(data.data);
            console.log(this.tourGeneral);
            this.days = this.tourGeneral.days;
            this.nights = this.tourGeneral.nights;
            this.initForm();

            this.initFormUpdate();

        } catch (error) {
            const errs = new Error(error[0]);
            this._alert.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
    }

    //đổi nơi đến ( trong nước or quốc tế)
    onChangeTourType(tourType: any) {
        this.tourTypeSelected = tourType.IsInternational;
        this.placeArrival.setValue("");
    }

    //handle chackbox FomArray
    onHandleCheckBox(data: any, event: any, name: string) {
        if (name === 'topic') {
            if (event.target.checked)
                this.tourTopicsChecked.push(data.code);
            else {
                for (const item of this.tourTopicsChecked) {
                    if (item === data.code) {
                        this.tourTopicsChecked.splice(_.findIndex(this.tourTopicsChecked, i => i === data.code), 1);
                    }
                }
            }
        }


        if (name === 'service') {
            if (event.target.checked)
                this.tourServicesChecked.push(data.code);
            else {
                for (const item of this.tourServicesChecked) {
                    if (item === data.code) {
                        this.tourServicesChecked.splice(_.findIndex(this.tourServicesChecked, i => i === data.code), 1);
                    }
                }
            }
        }
    }

    initForm() {
        this.formGeneral = this.fb.group({
            'tourName': [, Validators.compose([
                Validators.required,
                Validators.maxLength(CINPUT.MAX_LENGTH),
                Validators.minLength(CINPUT.TOURNAME_MIN_LENGTH)
            ])],
            'journey': [, Validators.compose([
                Validators.required,
            ])],
            'tourCommissionRate': [, Validators.compose([
                Validators.required,
                Validators.min(0),
                Validators.max(100)
            ])],
            'rewardPoints': [, Validators.compose([
                Validators.required,
                Validators.min(0),
            ])],
            'placeArrival': [, Validators.compose([
                Validators.required
            ])],
            'tourType': [{ value: this.tourTypeSelected, disabled: this.action === 'update' ? true : false }],
            'numDay': [, Validators.compose([
                Validators.required,
                Validators.min(1),
            ])],
            'numNight': [, Validators.compose([
                Validators.required,
                Validators.min(1),
            ])],

        }, {
                validator: DateValidator.validateDaysNights
            });

        //init form control
        this.tourName = this.formGeneral.controls['tourName'];
        this.tourCommissionRate = this.formGeneral.controls['tourCommissionRate'];
        this.placeArrival = this.formGeneral.controls['placeArrival'];
        this.tourType = this.formGeneral.controls['tourType'];
        this.numDay = this.formGeneral.controls['numDay'];
        this.numNight = this.formGeneral.controls['numNight'];
        this.journey = this.formGeneral.controls['journey'];
        this.rewardPoints = this.formGeneral.controls['rewardPoints'];
    }

    //handle Form Update
    async initFormUpdate() {
        //lấy loại tour
        this.tourTypeSelected = this.tourGeneral.isInternational || false;

        // //lấy hết data điểm đến
        // const placeDeparts = await this.getTourdeparture("");
        const placeArrival = await this.getTourArrival(this.tourTypeSelected, "");

        // const departName = this.departs.filter((place: TourDepart) => place.code == this.tourGeneral.departureCode);
        const arrivalName = placeArrival.filter((place: TourDepart) => place.code == this.tourGeneral.arrivalCode);

        // //cập nhật giá trị đang chọn điểm đến, điểm khởi hành
        this.selectedDepart = this.departs.filter((place: TourDepart) => place.code == this.tourGeneral.departureCode)[0];
        this.selectedArrival = _.head(arrivalName);
        this.onHideSearch();
        this.isSelectedArrival = false;

        this.tourTopicsChecked = this.tourGeneral.topics
        this.tourServicesChecked = this.tourGeneral.services;
        this.selectedCategory = this.tourGeneral.categories;
        this.highlights = this.tourGeneral.highlights || [];

        //xử lý nhà cung cấp
        this.tourSupplierSelected = _.head(this.tourSuppliers.filter(item => item.code === this.tourGeneral.supplier.code) || []);

        this.adultRangeAge = _.values(this.tourGeneral.adultRangeAge);
        this.childRangeAge = _.values(this.tourGeneral.childRangeAge);
        this.infantRangeAge = _.values(this.tourGeneral.infantRangeAge);

        //set lại giá trị cho form
        this.formGeneral.setValue({
            journey: this.tourGeneral.journey,
            tourName: this.tourGeneral.name,
            tourCommissionRate: this.tourGeneral.commissionRate,
            numDay: this.days,
            numNight: this.nights,
            placeArrival: this.selectedArrival.name,
            tourType: this.tourTypeSelected,
            rewardPoints: !!this.tourGeneral.rewardPoints ? this.tourGeneral.rewardPoints : 0
        });

        this.numDay.disable();
        this.numNight.disable();
        // update vào field search thì deactive search
        this.isearch = false;
        this.isSelectedArrival = !this.isSelectedArrival;
    }

    //fn push item status  = true vào mảng quản lý checked
    handleDataChecked(item: any, type: string) {
        switch (type) {
            case 'topic':
                return _.includes(this.tourTopicsChecked, item);
            case 'service':
                return _.includes(this.tourServicesChecked, item);
            default:
                break;
        }
    }

    //btnOnSumit
    onSubmit(data: any) {
        const body = {
            name: data.tourName,
            journey: data.journey,
            commissionRate: data.tourCommissionRate,
            departureCode: this.selectedDepart.code,
            arrivalCode: this.selectedArrival.code,
            isinternational: this.tourTypeSelected,
            days: Number(data.numDay) || this.days,
            nights: Number(data.numNight) || this.nights,
            supplierCode: this.tourSupplierSelected.code,
            topics: this.tourTopicsChecked,
            services: this.tourServicesChecked,
            highlights: this.highlights,
            rewardPoints: data.rewardPoints,
            categories: (this.selectedCategory || []).map((category: any) => category.code),
            adultRangeAge: { from: _.parseInt(this.adultRangeAge[0].toString()), to: _.parseInt(this.adultRangeAge[1].toString()) },
            childRangeAge: { from: _.parseInt(this.childRangeAge[0].toString()), to: _.parseInt(this.childRangeAge[1].toString()) },
            infantRangeAge: { from: _.parseInt(this.infantRangeAge[0].toString()), to: _.parseInt(this.infantRangeAge[1].toString()) },
        }
        console.log(body);
        switch (this.action) {
            case ACTION_TOUR.UPDATE: {
                this.onUpdate(this.tourGeneral.id, body);
                break;
            }
            default: {
                this.onCreateTour(body);
                break;
            }
        }
    }

    //fn create tour
    async onCreateTour(body: any) {
        const dataFromServer: any = await this._tourRepo.inputGeneralInfo(body);
        if (dataFromServer.code === 'Success') {
            if (this.action === ACTION_TOUR.CLONE) {
                this._localstorage.setItem(CSTORAGE.CLONETOUR, dataFromServer.data, true);
            }
            else {
                this._localstorage.setItem(CSTORAGE.TOUR_GENERAL, dataFromServer.data, true);
            }
            this.changeTab.emit('starting-date');
        }
        else {
            if ((dataFromServer.errors[0].code) === 1014) {
                this._alert.pushAlert('Nơi khởi hành hoặc điểm đến không hợp lệ', 'Vui lòng kiểm tra lại!', 'error');
            }
        }
    }

    //fn update thông tin chung
    async onUpdate(id: string, body: any) {
        const dataFromServer: any = await this._tourRepo.updateGeneralInfo(id, body);
        if (dataFromServer.code === 'Success') {
            this._alert.pushAlert('Thành công', 'Thông tin chung đã được cập nhật', 'success');
            // this._localstorage.setItem(CSTORAGE.TOUR_GENERAL, dataFromServer.data, true);
        }
        else {
            this._alert.pushAlert('Có lỗi', 'Vui lòng kiểm tra lại!', 'error');
        }
    }

    /* fn get tour Suggest  */
    async getTourdeparture(keyword: string) {
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestDepart(keyword);
            this.departs = (dataFormServer.data || []).map((item: any) => new TourDepart(item));
            this.selectedDepart = this.departs[1];
        } catch (error) { }
    }

    //fn get điểm đến
    async getTourArrival(type: boolean, keyword: string) {
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestArival(type, keyword);
            const data = (dataFormServer.data || []).map(item => {
                const arrival: TourArrival = new TourArrival(item);
                return arrival;
            });
            return data;
        } catch (error) { }
    }

    //fn get thông tin nhà cung cấp
    async getTourSuppliers() {
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestSupplier();
            this.tourSuppliers = (dataFormServer.data || []).map(item => {
                const supplier: TourSupplier = new TourSupplier(item);
                return supplier;
            });

            this.tourSupplierSelected = this.tourSuppliers[0];

        } catch (error) { }
    }

    //fn get chủ đề tour
    async getTourTopics() {
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestTopic();
            this.tourTopics = (dataFormServer.data || []).map(item => {
                const topic: TourTopic = new TourTopic(item);
                return topic;
            });
        } catch (error) { }
    }

    //fn get dịch vụ tour
    async getTourServices() {
        try {
            const dataFormServer: any = await this._tourRepo.getSuggestService();
            this.tourServices = (dataFormServer.data || []).map(item => {
                const service: TourService = new TourService(item);
                return service;
            });

        } catch (error) { }
    }

    //fn get điểm nổi bật tour
    // async getTourBenefits() {
    //     try {
    //         const dataFormServer: any = await this._tourRepo.getSuggestBenefit();
    //         this.tourBenefits = (dataFormServer.data || []).map(item => {
    //             const benefit: TourBenefit = new TourBenefit(item);
    //             return benefit;
    //         });
    //     } catch (error) { }
    // }

    //fn get category
    async getCategories(isInternational: boolean = false, keyword: string = '') {
        this._spinner.show();
        try {
            const response: any = await this._tourSuggest.getSuggestCategories(isInternational, keyword);
            return (response.data || []).map((item: any) => new TourArrival(item));

        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    // fn search Arrival auto complete
    async searchArrival(keyword: string) {
        if (this.action !== 'update') {
            if (keyword.length > 0) {
                [this.isearch, this.isSelectedArrival] = [true, false];
                this.arrivals = await this.getTourArrival(this.tourTypeSelected, keyword.trim());
            }
            else if (keyword.length == 0) {
                this.onHideSearch();
                this.isSelectedArrival = false;
            }
        }
        else {
            return;
        }

    }

    //fn search category
    async searchCategory(keyword: string) {
        [this.isearch, this.isSelectedCategory] = [true, false];
        this.catogories = await this.getCategories(this.tourTypeSelected, keyword);

        //xóa trùng
        this.catogories = _.differenceBy(this.catogories, this.selectedCategory, 'code');
    }

    //chọn mơi đến sau khi search autocomplete
    selectArrival(arrival: TourDepart) {
        this.selectedArrival = arrival;
        this.placeArrival.setValue(this.selectedArrival.name);
        this.isSelectedArrival = true;
        this.onHideSearch();
    }

    //fn select category
    selectCategory(category: TourArrival) {
        this.selectedCategory.push(category);
        this.isSelectedCategory = true;
        this.onHideSearch();
    }

    //fn hide search autocomplete
    onHideSearch() {
        this.isearch = false;
        this.arrivals = [];
        this.catogories = [];
    }

    onChangeTourPopular($event: any) {
        this.isMostPopular = true ? $event.target.checked : false;
    }

    //fn delete category
    deleteCategory(category: TourArrival) {
        this.selectedCategory.splice(_.findIndex(this.selectedCategory, item => item.code == category.code), 1);
    }

    addHightlight() {
        this.highlights.push(this.highlightKeyword);
        this.highlightKeyword = null;
    }

    onDeleteHightlight(index: number) {
        this.highlights.splice(index, 1);
    }
}