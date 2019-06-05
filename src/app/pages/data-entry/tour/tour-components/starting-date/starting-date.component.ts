import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '../../../../../../../node_modules/@angular/router';

import { TourSuggestRepository, TourRepo, StorageService, DepartInfo, TourHotel, Transport, NotificationService, TourStartingDate, Image, Error, Spinner, DateValidator, PriceValidator } from '../../../../../common';
import { ALL_TRANSPORT, ALL_INPUT_TRANSPORT_TEXT, CSTORAGE, ACTION_TOUR } from '../../../../../app.constants';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Airline } from '../../../../../common/entities/flights/airline';
import { AppBase } from '../../../../../app.base';

@Component({
    selector: 'tour-starting-date',
    templateUrl: './starting-date.componen.html',
    styleUrls: ['./starting-date.less'],
    encapsulation: ViewEncapsulation.None,
})

export class TourStartTingDateComponent extends AppBase {
    action: string = ACTION_TOUR.CREATE;
    code: any = null;
    tourCode: any = null;
    tourId: string = '';
    tourGeneral: any = {}; //Thông  tin chung 
    tourDataStartingDate: TourStartingDate = new TourStartingDate(); //thông tin tour về ngày khởi hành
    tourDeparts: any[] = [];
    @Output() changeTab = new EventEmitter();

    // config server ảnh
    folderImage: any = {
        AIRLINE: 'airlines',
        TRANSPORT: 'transports'
    };
    pathTransport: string = '';

    formStartingDate: FormGroup;
    quantity: AbstractControl;
    originalPrice: AbstractControl;
    adultPrice: AbstractControl;
    childPrice: AbstractControl;
    infantPrice: AbstractControl;
    departAirline: AbstractControl;      //phương tiện chiều đi
    transportNumberDepart: AbstractControl;  //số hiệu chiều đi
    hourDepartStart: AbstractControl;    //giờ khởi hành ( chiều đi )
    hourDepartEnd: AbstractControl;     //giờ đến nơi ( chiều đi )
    returnAirline: AbstractControl;     //phương tiện chiều về
    hourReturnStart: AbstractControl;    //giờ khởi hành về ( chiều về )
    hourReturnEnd: AbstractControl;     //giờ đến mơi ( chiều về )
    transportNumberReturn: AbstractControl;     //số hiệu chiều về
    dateReturn: AbstractControl;            //Ngày về
    tourPriceCode: AbstractControl; //mã công trình

    departInfo: DepartInfo = new DepartInfo(); //thông tin chiều đi
    returnInfo: DepartInfo = new DepartInfo() //thông tin chiều về

    // Máy bay
    airlinesDepart: Airline[] = new Array<Airline>(); //suggest máy bay chiều đi 
    airlinesReturn: Airline[] = new Array<Airline>();//suggest máy bay chiều về
    selectedAirlineDepart: Airline = null;          //airline đang chọn ( chiều đi )
    selectedAirlineReturn: Airline = null;            //airline đang chọn ( chiều về )

    isSearchAirlineDepart: boolean = false;
    isSelectedAirlineDepart: boolean = false;

    isSearchAirlineReturn: boolean = false;
    isSelectedAirlineReturn: boolean = false;

    rangeDateApply: any[] = [];
    rangeDates: any[] = [];
    rangeMonth: any = [];

    currentWeek: number = 0;
    week: number = 0;
    dateWeeks: any[] = [];
    currentMonday: any = {};

    //ngày được chọn
    selectedDate: any = {};
    isShowStartingDateForm: boolean = false;

    airlines: Airline[] = new Array<Airline>();        //hãng hàng không
    transports: Transport[] = new Array<Transport>();  //phương tiện
    selectedTransportDepart: Transport = new Transport();
    selectedTransportReturn: Transport = new Transport();

    placeholderTransportNameDepart: string = '';  //placeholder transport name depart
    placeholderTransportNumberDepart: string = '';  //placeholder transport  number depart
    placeholderTransportTitleDepart: string = '' //placeholder transport  title depart

    placeholderTransportNameReturn: string = '';  //placeholder transport name return
    placeholderTransportNumberReturn: string = '';  //placeholder transport  number return
    placeholderTransportTitleReturn: string = '' //placeholder transport  title return

    applyType: any = {};
    selectedApplyType: any = {};
    isShowApplyOther: boolean = false;
    selectedOtherApplyType: any = {};
    dataApplyOtherDate: any = []; //data hứng mảng các tháng, ngày được chọn bên áp dụng cho ngày khác( 2wbinding) 
    applyOther: any = {}; //option áp dụng cho ngày khác
    isTourDaily: boolean = false;   //có phải tour hằng ngày ( nguyên tháng )
    multipleDays: boolean = false;  //tour theo ngày

    isCreated: boolean = false;
    isApplyOther: boolean = false;
    isShowrangeDateApply: boolean = false;
    isDepartPast: boolean = false;

    constructor(private fb: FormBuilder,
        private _repoSuggest: TourSuggestRepository,
        private _tourRepo: TourRepo,
        private _localstorage: StorageService,
        private _notifi: NotificationService,
        private _activedRoute: ActivatedRoute,
        private _spinner: Spinner) {
        super();
        moment.updateLocale('en', {
            week: {
                dow: 1,
                doy: 4
            },
        })
    }
    ngOnInit() {
        const isHaveAirlines = this._localstorage.checkInLocalStorage(CSTORAGE.TOUR_AIRLINES);
        if (isHaveAirlines) {
            this.airlines = this._localstorage.getItem(CSTORAGE.TOUR_AIRLINES, true);
        }
        else {
            this.getAirline("").then((airlines: Airline[]) => {
                this.airlines = airlines;
                this.airlines = this._localstorage.setItem(CSTORAGE.TOUR_AIRLINES, this.airlines);
            });
        }
        this.initForm();

        this._activedRoute.queryParams.subscribe((params: any) => {
            if (!!params && params.id && params.action) {
                this.action = params.action;
                this.isShowrangeDateApply = true;
                this.tourId = params.id;
            }
        })

        switch (this.action) {
            case ACTION_TOUR.UPDATE: {
                this.getTourInfo(this.tourId);
                this.getAllTourDepart(this.tourId);
                break;
            }
            case ACTION_TOUR.CLONE: {
                this.tourGeneral = this._localstorage.getItem(CSTORAGE.CLONETOUR, true);
                this.tourId = this.tourGeneral.id;
                this.tourCode = this.tourGeneral.code;
                this.pathTransport = `tour/${this.tourGeneral.supplier.code}/transport`;
                break;
            }
            default: {
                this.tourGeneral = this._localstorage.getItem(CSTORAGE.TOUR_GENERAL, true);
                this.tourId = this.tourGeneral.id;
                this.pathTransport = `tour/${this.tourGeneral.supplier.code}/transport`;
                this.tourCode = this.tourGeneral.code;
                break;
            }

        }

        //init tuần hiện tại, thứ hai trong tuần hiện tại
        this.currentWeek = this.week = moment().week();
        this.currentMonday = moment().day(1).week(this.currentWeek).format("DD/MM/YYYY"); // lấy thứ 2 của tuần hiện tại

        //init các ngày trong tuần hiện tại và ngày đang chọn hiện tại
        this.dateWeeks = this.getDaysInWeek(this.currentMonday);

        this.selectedDate = _.head(this.dateWeeks.filter(d => d.dateNumber.format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")));

        //init áp dụng cho nâng cao và áp dụng cho ngày này (default)
        this.applyType = [
            { title: 'Chỉ tạo ngày này', selected: true, type: 'current', },
            { title: 'Áp dụng cho những ngày khác', selected: false, type: 'other', }
        ];
        this.selectedApplyType = this.applyType[0];

        //init áp dụng cho ngày khác và giá trị mặc định là chọn tour hằng ngày (default )
        this.applyOther = [
            // { title: 'Hằng ngày', value: '', selected: false, type: 'daily' },
            { title: 'Ngày khác', value: '', selected: false, type: 'day', }
        ]
        this.selectedOtherApplyType = this.applyOther[0];
        this.selectedOtherApplyType.selected = true;

        this.getTransports();

    }

    //init form or update
    initForm() {
        this.formStartingDate = this.fb.group({
            'quantity': ['', Validators.compose([
                Validators.required,
                Validators.max(10000)
            ])],
            'tourPriceCode': ['', Validators.compose([
            ])],
            'originalPrice': [, Validators.compose([
                Validators.required,
                Validators.max(1000000000)
            ])],
            'adultPrice': [, Validators.compose([
                Validators.required,
                Validators.max(1000000000)
            ])],
            'childPrice': [, Validators.compose([
                Validators.min(0),
                Validators.required,
                Validators.max(1000000000)
            ])],
            'infantPrice': [, Validators.compose([
                Validators.min(0),
                Validators.required,
                Validators.max(1000000000)
            ])],
          
            'departAirline': [, Validators.compose([
                Validators.required
            ])],
            'transportNumberDepart': [],
            'hourDepartStart': [new Date()],
            'hourDepartEnd': [new Date()],
            'returnAirline': [, Validators.compose([
                Validators.required
            ])],
            'hourReturnStart': [new Date()],
            'hourReturnEnd': [new Date()],
            'transportNumberReturn': [],
            'dateReturn': [new Date(), Validators.compose([
                Validators.required
            ])],
        }, {
                validator: Validators.compose([PriceValidator.validateOriginalPrice])
            });
        //init form control
        this.quantity = this.formStartingDate.controls['quantity'];
        this.tourPriceCode = this.formStartingDate.controls['tourPriceCode'];
        this.originalPrice = this.formStartingDate.controls['originalPrice'];
        this.adultPrice = this.formStartingDate.controls['adultPrice'];
        this.childPrice = this.formStartingDate.controls['childPrice'];
        this.infantPrice = this.formStartingDate.controls['infantPrice'];
        this.departAirline = this.formStartingDate.controls['departAirline'];
        this.transportNumberDepart = this.formStartingDate.controls['transportNumberDepart'];
        this.hourDepartStart = this.formStartingDate.controls['hourDepartStart'];
        this.hourDepartEnd = this.formStartingDate.controls['hourDepartEnd'];
        this.returnAirline = this.formStartingDate.controls['returnAirline'];
        this.hourReturnStart = this.formStartingDate.controls['hourReturnStart'];
        this.hourReturnEnd = this.formStartingDate.controls['hourReturnEnd'];
        this.transportNumberReturn = this.formStartingDate.controls['transportNumberReturn'];
        this.dateReturn = this.formStartingDate.controls['dateReturn'];

        //option set giá trị default cho field giờ đến nơi 
        const date = new Date();
        date.setHours(moment(this.hourDepartStart.value).hour() + 3)
        this.hourDepartEnd.setValue(date);
        this.hourReturnEnd.setValue(date);
    }

    // get date in week
    getDaysInWeek(date: any) {
        let dateWeeks: any[] = [];
        const monday = moment(date, "DD/MM/YYYY").startOf('weeks');

        //get 7 day from monday
        let i = 0;
        while (i < 7) {
            let date = moment(monday).add(i, 'd');
            dateWeeks.push({
                dateString: date.day() == 0 ? 'Chủ nhật' : `Thứ ${date.day() + 1}`,
                dateNumber: date,
                date: date.format("DD/MM/YYYY")
            });
            i++;
        }
        return dateWeeks;
    }

    //get date in datepicker
    getNewDateFromPicker(dateFromPicker: any) {
        this.currentWeek = this.utilityHelper.getWeek(dateFromPicker);
        this.dateWeeks = this.getDaysInWeek(dateFromPicker);
        this.selectedDate = _.head(this.dateWeeks.filter(d => d.dateNumber.format("DD/MM/YYYY") == moment(dateFromPicker).format("DD/MM/YYYY")));

        //cập nhật lại thứ 2
        const monday = moment().day('Monday').week(this.currentWeek).format("DD/MM/YYYY");
        this.currentMonday = moment(monday, "DD/MM/YYYY");
        this.checkDateIsApply(this.selectedDate.date, this.tourId);
    }

    //fn tới/lui một tuần
    goToWeek(option: string) {
        if (this.isShowStartingDateForm) {
            this.isShowStartingDateForm = !this.isShowStartingDateForm;
        }
        if (option === 'prev') {
            if (this.week == this.currentWeek) {
                return;
            }
            this.currentWeek--;
        }
        if (option === 'next') {
            this.currentWeek++;
        }
        const monday = moment().day('Monday').week(this.currentWeek).format("DD/MM/YYYY");
        this.dateWeeks = this.getDaysInWeek(monday);

        this.currentMonday = moment(monday, "DD/MM/YYYY");

        if (this.week === this.currentWeek) {
            this.selectedDate = _.head(this.dateWeeks.filter(d => d.dateNumber.format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")));
        }
    }

    /* select funcion group*/
    selectDateOfWeek(date: any) {
        // kiểm tra ngày click khác ngày trong quá khứ
        if (this.utilityHelper.checkDateInPast(date.dateNumber)) {
            return;
        }
        this.selectedDate = date;
        this.checkDateIsApply(this.selectedDate.date, this.tourId);

        // cập nhật lại ngày mặc định trong datepicker
        const y = (this.selectedDate.dateNumber).year();
        const m = (this.selectedDate.dateNumber).month();
        const d = (this.selectedDate.dateNumber).date();
        (this.bsConfig.bsValue).setFullYear(y, m, d);
    }

    //fn select depart date
    selectDateDepart(date: any) {
        // kiểm tra ngày click khác ngày trong quá khứ
        if (this.utilityHelper.checkDateInPast(date)) {
            this.isDepartPast = true;
        }
        else {
            this.isDepartPast = false;
        }

        //cap nhat lai tuan hien tai
        this.currentWeek = this.utilityHelper.getWeek(date);
        this.dateWeeks = this.getDaysInWeek(date);
        this.selectedDate = _.head(this.dateWeeks.filter(d => d.date === date));

        //cập nhật lại thứ 2
        const monday = moment(date, "DD/MM/YYYY").startOf('weeks');
        this.currentMonday = moment(monday, "DD/MM/YYYY");

        //load data
        this.checkDateIsApply(date, this.tourId);
    }

    //chọn phương tiện // set placeholder tương ứng
    selectTransport(transport: Transport, type: string) {
       
        
        if (type === 'depart') {
            this.selectedTransportDepart = transport;
            
            //nếu là tự túc
            if (transport.code === ALL_TRANSPORT.SELF) {
                this.departAirline.clearValidators();
                this.departAirline.setValue("");
            }
            else {
                this.getPlaceholderTransport(this.selectedTransportDepart, 'depart');
                this.departAirline.setValue("");

                // set lai validator cho ten phuong tien neu như đổi từ tự túc qua
                this.departAirline.setValidators([, Validators.compose([
                    Validators.required,
                ])])
                this.isSelectedAirlineDepart = false;
                this.selectedAirlineDepart = null;
                this.isSearchAirlineDepart = true;

                this.departInfo = new DepartInfo();
                // this.departInfo.transportSupplier = null;
                this.transportNumberDepart.setValue("");
            }
        }
        else {
            this.selectedTransportReturn = transport;
            //nếu là tự túc
            if (transport.code === ALL_TRANSPORT.SELF) {
                this.returnAirline.clearValidators();
                this.returnAirline.setValue("");
                this.dateReturn.clearValidators();
                this.dateReturn.setValue("");
            } else {
                this.getPlaceholderTransport(this.selectedTransportReturn, 'return');
                this.returnAirline.setValue("");

                // set lai validator cho ten phuong tien neu như đổi từ tự túc qua
                this.returnAirline.setValidators([, Validators.compose([
                    Validators.required,
                ])])

                this.dateReturn.setValidators([, Validators.compose([
                    Validators.required,
                ])])

                this.isSelectedAirlineReturn = false;
                this.selectedAirlineReturn = null;
                this.isSearchAirlineReturn = true;

                this.returnInfo = new DepartInfo();
                // this.returnInfo.transportSupplier = null;
                this.transportNumberReturn.setValue("");
            }
        }
    }

    //mở calendar nếu chọn áp dụng cho ngày khác
    selecteApplyType(type: any) {
        this.selectedApplyType = type;
        if (this.selectedApplyType.type !== 'other') {
            this.isShowApplyOther = false;
            this.isApplyOther = false;
        }
        else {
            this.dataApplyOtherDate = [];
            this.isApplyOther = true;
        }
    }

    //fn lấy data từ lịch chọn nhiều ngày hoặc nhiều tháng
    getSelectedDataMultiplePicker(data: any, type: string) {
        if (type === 'date' || type == 'month')
            this.dataApplyOtherDate = data;
    }

    //fn btn chọn => ẩn component lịch 
    btnCloseCalendar() {
        this.isShowApplyOther = false;
        this.isApplyOther = false;
    }

    // check group fn
    onShowApplyOther() {
        if (this.selectedOtherApplyType.type === 'day') {
            if (this.dataApplyOtherDate.length === 0) {
                this.dataApplyOtherDate.push(this.selectedDate.date);
            }
            this.selectedOtherApplyType = this.applyOther[0];
            this.selectedOtherApplyType.selected = true;
        }

        this.isShowApplyOther = true;
    }

    //kiểm tra ngày trong tuần đó có trong khoảng ngày áp dụng ( sau khi tạo thành công áp dụng cho ngày này hoặc nhiều ngày )
    checkDateInRange(date: any): boolean {
        return _.includes(this.rangeDateApply, date.format("DD/MM/YYYY"));
    }

    /* show function group */
    onShowCreateStartingDate() {
        this.action = ACTION_TOUR.CREATE;
        if (this.action === ACTION_TOUR.CREATE) {

            //cập nhật lại giá trị ngày về tính từ ngày đang chọn
            const y = (this.selectedDate.dateNumber).year();
            const m = (this.selectedDate.dateNumber).month();
            const d = (this.selectedDate.dateNumber).date();

            //hiện form ra
            this.isShowStartingDateForm = true;

            if (this.isSelectedAirlineDepart) {
                this.isSelectedAirlineDepart = !this.isSelectedAirlineDepart;
            }
            if (this.isSelectedAirlineReturn) {
                this.isSelectedAirlineReturn = !this.isSelectedAirlineReturn;
            }

            this.initForm();
            if (this.tourGeneral.days >= this.tourGeneral.nights) {
                this.dateReturn.setValue(moment([y, m, d]).add(this.tourGeneral.days - 1, 'days'));
            }
            else {
                this.dateReturn.setValue(moment([y, m, d]).add(this.tourGeneral.nights - 1, 'days'));
            }
            //các giá trị phuong tien
            this.selectedTransportDepart = this.transports[0];
            this.selectedTransportReturn = this.transports[0];

            this.getPlaceholderTransport(this.selectedTransportDepart, 'depart');
            this.getPlaceholderTransport(this.selectedTransportReturn, 'return');
            
            // this.departAirline.clearValidators();
            // this.returnAirline.clearValidators();

            if (this.selectedTransportDepart.code === ALL_TRANSPORT.FLIGHT) {
                this.selectedAirlineDepart = null;
            }
            if (this.selectedTransportReturn.code === ALL_TRANSPORT.FLIGHT) {
                this.selectedAirlineReturn = null;
            }

            this.selectedApplyType = this.applyType[0];
        }
    }

    async initformUpdate() {

        //nếu có thông tin phương tiện, chiều đi - chiều về
        if (!!this.tourDataStartingDate.departInfo) {
            // handle phương tiện chiều đi, chiều về
            const transportsDepartType = this.transports.filter(transport => transport.code === this.tourDataStartingDate.departInfo.transportType);

            this.selectedTransportDepart = _.head(transportsDepartType);
            this.getPlaceholderTransport(this.selectedTransportDepart, 'depart');

            if (this.selectedTransportDepart.code === ALL_TRANSPORT.FLIGHT) {
                const transportDepart = this.airlines.filter(airline => airline.code === this.tourDataStartingDate.departInfo.transportSupplier.code);
                this.selectedAirlineDepart = _.head(transportDepart);
            }
            else {
                this.selectedAirlineDepart = new Airline();
                this.selectedAirlineDepart.photo = this.tourDataStartingDate.departInfo.transportSupplier.logo;
            }

            this.departInfo = this.tourDataStartingDate.departInfo;
            this.isSelectedAirlineDepart = true;
        } else {
            this.selectedTransportDepart = this.transports[this.transports.length - 1];
            this.departInfo = null;
        }


        if (!!this.tourDataStartingDate.returnInfo) {
            const transportsReturnType = this.transports.filter(transport => transport.code === this.tourDataStartingDate.returnInfo.transportType);
            this.selectedTransportReturn = _.head(transportsReturnType);
            this.getPlaceholderTransport(this.selectedTransportReturn, 'return');

            if (this.selectedTransportReturn.code === ALL_TRANSPORT.FLIGHT) {
                const transportReturn = this.airlines.filter(airline => airline.code === this.tourDataStartingDate.returnInfo.transportSupplier.code);
                this.selectedAirlineReturn = _.head(transportReturn);
            }
            else {
                this.selectedAirlineReturn = new Airline();
                this.selectedAirlineReturn.photo = this.tourDataStartingDate.returnInfo.transportSupplier.logo;
            }

            this.returnInfo = this.tourDataStartingDate.returnInfo;
            this.isSelectedAirlineReturn = true;
        } else {
            this.selectedTransportReturn = this.transports[this.transports.length - 1];
            this.returnInfo = null;
        }

        this.isTourDaily = this.tourDataStartingDate.isTourDaily;
        this.multipleDays = this.tourDataStartingDate.multipleDays;
        this.tourCode = this.tourDataStartingDate.tourCode;
        this.code = this.tourDataStartingDate.code;
        this.rangeDates = [];

        //set lại giá trị cho form
        this.formStartingDate.setValue({
            quantity: this.tourDataStartingDate.quantity,
            tourPriceCode: this.tourDataStartingDate.code,
            adultPrice: this.tourDataStartingDate.adultPrice,
            childPrice: this.tourDataStartingDate.childPrice,
            infantPrice: this.tourDataStartingDate.infantPrice,
            originalPrice: this.tourDataStartingDate.originalPrice,
            departAirline: !!this.tourDataStartingDate.departInfo ? this.tourDataStartingDate.departInfo.transportSupplier.name : "",
            transportNumberDepart: !!this.tourDataStartingDate.departInfo ? this.tourDataStartingDate.departInfo.transportNumber : null,
            hourDepartStart: !!this.tourDataStartingDate.departInfo ? new Date(this.tourDataStartingDate.departInfo.departTime) : new Date(),
            hourDepartEnd: !!this.tourDataStartingDate.departInfo ? new Date(this.tourDataStartingDate.departInfo.arrivalTime) : new Date(),
            returnAirline: !!this.tourDataStartingDate.returnInfo ? this.tourDataStartingDate.returnInfo.transportSupplier.name : "",
            hourReturnStart: !!this.tourDataStartingDate.returnInfo ? new Date(this.tourDataStartingDate.returnInfo.departTime) : new Date(),
            hourReturnEnd: !!this.tourDataStartingDate.returnInfo ? new Date(this.tourDataStartingDate.returnInfo.arrivalTime) : new Date(),
            transportNumberReturn: !!this.tourDataStartingDate.returnInfo ? this.tourDataStartingDate.returnInfo.transportNumber : null,
            dateReturn: !!this.tourDataStartingDate.returnInfo ? moment(this.tourDataStartingDate.returnInfo.departTime) : moment(),
        });

        // stop search airline
        [this.isSearchAirlineDepart, this.isSelectedAirlineDepart] = [false, true];
        [this.isSearchAirlineReturn, this.isSelectedAirlineReturn] = [false, true];

        if (!this.departInfo) {
            this.departAirline.clearValidators();
        }
        if (!this.returnInfo) {
            this.dateReturn.clearValidators();
            this.returnAirline.clearValidators();
        }
    }

    /* Get suggest  */
    async getTransports() {
        const dataFromServe: any = await this._repoSuggest.getSuggestTransports();
        this.transports = (dataFromServe.data || []).map((item: any) => new Transport(item));

        // phương tiện mặc định là Flight
        this.selectedTransportDepart = this.transports[0];
        this.selectedTransportReturn = this.transports[0];

        // this.departAirline.clearValidators();
        // this.returnAirline.clearValidators();
    }

    //fn xử ký label, placeholder nhập thông tin chiều đi, chiều về
    getPlaceholderTransport(typeTransport: Transport, type: string) {
        if (type === 'depart') {
            if (typeTransport.code === ALL_TRANSPORT.FLIGHT) {
                this.placeholderTransportNameDepart = ALL_INPUT_TRANSPORT_TEXT.FLIGHT.PLACEHOLDER_FLIGHT_NAME;
                this.placeholderTransportNumberDepart = ALL_INPUT_TRANSPORT_TEXT.FLIGHT.PLACEHOLDER_FLIGHT_NUMBER;
                this.placeholderTransportTitleDepart = ALL_INPUT_TRANSPORT_TEXT.FLIGHT.PLACEHOLDER_FLIGHT_TITLE;
            }
            if (typeTransport.code === ALL_TRANSPORT.CAR) {
                this.placeholderTransportNameDepart = ALL_INPUT_TRANSPORT_TEXT.CAR.PLACEHOLDER_CAR_NAME;
                this.placeholderTransportNumberDepart = ALL_INPUT_TRANSPORT_TEXT.CAR.PLACEHOLDER_CAR_NUMBER;
                this.placeholderTransportTitleDepart = ALL_INPUT_TRANSPORT_TEXT.CAR.PLACEHOLDER_CAR_TITLE;
            }
            if (typeTransport.code === ALL_TRANSPORT.TRAIN) {
                this.placeholderTransportNameDepart = ALL_INPUT_TRANSPORT_TEXT.TRAIN.PLACEHOLDER_TRAIN_NAME;
                this.placeholderTransportNumberDepart = ALL_INPUT_TRANSPORT_TEXT.TRAIN.PLACEHOLDER_TRAIN_NUMBER;
                this.placeholderTransportTitleDepart = ALL_INPUT_TRANSPORT_TEXT.TRAIN.PLACEHOLDER_TRAIN_TITLE;

            }
            if (typeTransport.code === ALL_TRANSPORT.YACHT) {
                this.placeholderTransportNameDepart = ALL_INPUT_TRANSPORT_TEXT.YACHT.PLACEHOLDER_YACHT_NAME;
                this.placeholderTransportNumberDepart = ALL_INPUT_TRANSPORT_TEXT.YACHT.PLACEHOLDER_YACHT_NUMBER;
                this.placeholderTransportTitleDepart = ALL_INPUT_TRANSPORT_TEXT.YACHT.PLACEHOLDER_YACHT_TITLE;
            }
        }
        else {
            if (typeTransport.code === ALL_TRANSPORT.FLIGHT) {
                this.placeholderTransportNameReturn = ALL_INPUT_TRANSPORT_TEXT.FLIGHT.PLACEHOLDER_FLIGHT_NAME;
                this.placeholderTransportNumberReturn = ALL_INPUT_TRANSPORT_TEXT.FLIGHT.PLACEHOLDER_FLIGHT_NUMBER;
                this.placeholderTransportTitleReturn = ALL_INPUT_TRANSPORT_TEXT.FLIGHT.PLACEHOLDER_FLIGHT_TITLE;
            }
            if (typeTransport.code === ALL_TRANSPORT.CAR) {
                this.placeholderTransportNameReturn = ALL_INPUT_TRANSPORT_TEXT.CAR.PLACEHOLDER_CAR_NAME;
                this.placeholderTransportNumberReturn = ALL_INPUT_TRANSPORT_TEXT.CAR.PLACEHOLDER_CAR_NUMBER;
                this.placeholderTransportTitleReturn = ALL_INPUT_TRANSPORT_TEXT.CAR.PLACEHOLDER_CAR_TITLE;
            }
            if (typeTransport.code === ALL_TRANSPORT.TRAIN) {
                this.placeholderTransportNameReturn = ALL_INPUT_TRANSPORT_TEXT.TRAIN.PLACEHOLDER_TRAIN_NAME;
                this.placeholderTransportNumberReturn = ALL_INPUT_TRANSPORT_TEXT.TRAIN.PLACEHOLDER_TRAIN_NUMBER;
                this.placeholderTransportTitleReturn = ALL_INPUT_TRANSPORT_TEXT.TRAIN.PLACEHOLDER_TRAIN_TITLE;

            }
            if (typeTransport.code === ALL_TRANSPORT.YACHT) {
                this.placeholderTransportNameReturn = ALL_INPUT_TRANSPORT_TEXT.YACHT.PLACEHOLDER_YACHT_NAME;
                this.placeholderTransportNumberReturn = ALL_INPUT_TRANSPORT_TEXT.YACHT.PLACEHOLDER_YACHT_NUMBER;
                this.placeholderTransportTitleReturn = ALL_INPUT_TRANSPORT_TEXT.YACHT.PLACEHOLDER_YACHT_TITLE;
            }
        }
    }

    //fn click show suggest airline
    onShowListDataSuggest(type: string) {
        if (type === 'depart' || type === 'return') {
            if (this.selectedTransportDepart.code === ALL_TRANSPORT.FLIGHT || this.selectedTransportReturn.code === ALL_TRANSPORT.FLIGHT) {
                this.searchAirline(" ", type);
            }
        }
        return;
    }

    //fn search hãng hàng không
    async searchAirline(keyword: string, type: string) {
        if (keyword.length > 0) {
            // search chiều đi
            if (type === 'depart') {
                [this.isSearchAirlineDepart, this.isSelectedAirlineDepart] = [true, false];
                this.airlinesDepart = await this.getAirline(keyword);
            }
            // search chiều về
            if (type === 'return') {
                [this.isSearchAirlineReturn, this.isSelectedAirlineReturn] = [true, false];
                this.airlinesReturn = await this.getAirline(keyword);
            }
        }
        else if (keyword.length == 0) {
            if (type === 'depart') {
                this.isSearchAirlineDepart = false;
                this.onHideSearch('depart');
            }
            else {
                this.isSearchAirlineReturn = false;
                this.onHideSearch('return');
            }
        }
    }

    //fn chọn hãng máy bay
    selectAirline(airline: Airline, type: string) {
        if (type === 'depart') {
            this.selectedAirlineDepart = airline;

            this.departAirline.setValue(this.selectedAirlineDepart.name);
            [this.isSearchAirlineDepart, this.isSelectedAirlineDepart] = [false, true];
            if (!this.departInfo) {
                this.departInfo = new DepartInfo();
            }
            this.departInfo.transportSupplier = {
                address: null,
                code: this.selectedAirlineDepart.code,
                logo: this.selectedAirlineDepart.photo,
                name: this.selectedAirlineDepart.name
            };
            this.departInfo.transportClass = this.selectedAirlineDepart.code;
            this.departInfo.transportType = this.selectedTransportDepart.code;
            this.onHideSearch('depart');
        }
        if (type === 'return') {
            this.selectedAirlineReturn = airline;

            this.returnAirline.setValue(this.selectedAirlineReturn.name);
            [this.isSearchAirlineReturn, this.isSelectedAirlineReturn] = [false, true];
            if (!this.returnInfo) {
                this.returnInfo = new DepartInfo();
            }

            this.returnInfo.transportSupplier = {
                address: null,
                code: this.selectedAirlineReturn.code,
                logo: this.selectedAirlineReturn.photo,
                name: this.selectedAirlineReturn.name
            };
            this.returnInfo.transportClass = this.selectedAirlineReturn.code;
            this.returnInfo.transportType = this.selectedTransportReturn.code;
            this.onHideSearch('return');
        }
    }

    //fn get hãng hàng không
    async getAirline(keyword: string) {
        const dataFromServe: any = await this._repoSuggest.getSuggestAirlines(keyword);
        const airlines = (dataFromServe.data || []).map(item => {
            const airline: Airline = new Airline(item);
            return airline;
        });
        return airlines;
    }

    //chack ngày đang chọn trong tuần đã được tạo hay chưa?
    async checkDateIsApply(date: string, id: string) {
        this._spinner.show();

        const d = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm");

        const dataFromServe: any = await this._tourRepo.checkDateIsApplied(d, id);

        //nếu k có data thì hiện form ra 
        if (_.isNull(dataFromServe.data)) {
            this.isShowStartingDateForm = false;

            this.getPlaceholderTransport(this.selectedTransportDepart, 'depart');
            this.getPlaceholderTransport(this.selectedTransportReturn, 'return');
        }
        else {
            //nếu có thì lấy data
            this.action = ACTION_TOUR.UPDATE;
            this.tourDataStartingDate = new TourStartingDate(dataFromServe.data);

            //update xong mới show form ra
            await this.initformUpdate();
            this.isShowStartingDateForm = true;
            this._spinner.hide();
        }
    }

    //fn ẩn search autocomplete
    onHideSearch(type: string) {
        if (type === 'depart') {
            this.airlinesDepart = [];
            this.isSearchAirlineDepart = false;
        }
        if (type === 'return') {
            this.airlinesReturn = [];
            this.isSearchAirlineReturn = false;
        }
    }

    //fn tạo ngày khởi hành
    async onSubmit(form: any) {

        this.btnCloseCalendar();
        if (this.selectedTransportDepart.code !== ALL_TRANSPORT.SELF) {
            if (!!this.departInfo) {
                this.departInfo.transportType = this.selectedTransportDepart.code;
                this.departInfo.transportNumber = form.transportNumberDepart;

                this.departInfo.transportClass = null;

                const dateDepartStart = moment(this.selectedDate.dateNumber).format("DD/MM/YYYY") + ' ' + moment(form.hourDepartStart).format("HH:mm");
                const dateDepartEnd = moment(this.selectedDate.dateNumber).format("DD/MM/YYYY") + ' ' + moment(form.hourDepartEnd).format("HH:mm");

                this.departInfo.departTime = moment(dateDepartStart, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD[T]HH:mm");
                this.departInfo.arrivalTime = moment(dateDepartEnd, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD[T]HH:mm");

                //kiểm tra thông tin phương tiện
                if (!!this.departInfo.transportSupplier) {
                    this.departInfo.transportSupplier.name = this.departAirline.value;
                }
                else {
                    this.departInfo.transportSupplier = Object.assign({}, this.departInfo.transportSupplier, {
                        address: null,
                        code: null,
                        logo: new Image(),
                        name: this.departAirline.value
                    });
                }
            }
        }

        if (this.selectedTransportReturn.code !== ALL_TRANSPORT.SELF) {
            if (!!this.returnInfo) {
                this.returnInfo.transportType = this.selectedTransportReturn.code;
                this.returnInfo.transportNumber = form.transportNumberReturn;

                this.returnInfo.transportClass = null;

                const dateReturnStart = moment(form.dateReturn).format("DD/MM/YYYY") + ' ' + moment(form.hourReturnStart).format("HH:mm");
                const dateReturnEnd = moment(form.dateReturn).format("DD/MM/YYYY") + ' ' + moment(form.hourReturnEnd).format("HH:mm");

                this.returnInfo.departTime = moment(dateReturnStart, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD[T]HH:mm");
                this.returnInfo.arrivalTime = moment(dateReturnEnd, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD[T]HH:mm");

                if (!!this.returnInfo.transportSupplier) {
                    this.returnInfo.transportSupplier.name = this.returnAirline.value;
                }
                else {
                    this.returnInfo.transportSupplier = Object.assign({}, this.returnInfo.transportSupplier, {
                        address: null,
                        code: null,
                        logo: new Image(),
                        name: this.returnAirline.value
                    });
                }
            }
        }

        //nếu đang update
        if (this.action === ACTION_TOUR.UPDATE) {
            this.isTourDaily = this.tourDataStartingDate.isTourDaily;
            this.multipleDays = this.tourDataStartingDate.multipleDays;
            this.rangeDates = [];
        }
        else {
            //áp dụng cho ngày đang chọn
            if (this.selectedApplyType.type === 'current') {
                this.rangeDates = [] || null;
                //push vao mang cac ngay dc apply
                this.rangeDateApply.push(this.selectedDate.date);
            }
            //áp dụng nâng cao 
            if (this.selectedApplyType.type === 'other' && this.selectedOtherApplyType.type === 'day') {
                this.rangeDates = this.dataApplyOtherDate;
                this.isTourDaily = false;
                this.multipleDays = true;
                this.rangeDateApply = [];
                //push vao mang cac ngay dc apply
                this.rangeDateApply.push(...this.dataApplyOtherDate);
            }
        }

        const body = {
            departDate: this.selectedTransportDepart.code !== ALL_TRANSPORT.SELF ? this.departInfo.departTime : moment(this.selectedDate.dateNumber).format("YYYY-MM-DD"),
            tourCode: this.tourCode,
            code: this.code,
            quantity: form.quantity,
            adultPrice: form.adultPrice,
            originalPrice: form.originalPrice,
            usePercentage: false,
            percentChildPrice: null,
            childPrice: form.childPrice,
            percentInfantPrice: null,
            infantPrice: form.infantPrice,
            // transportType: this.selectedTransportDepart.code,
            departInfo: this.selectedTransportDepart.code !== ALL_TRANSPORT.SELF ? this.departInfo : null,
            returnInfo: this.selectedTransportReturn.code !== ALL_TRANSPORT.SELF ? this.returnInfo : null,
            hotels: [],
            rangeDate: this.rangeDates.map(d => moment(d, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm")) || [],

            multipleDays: this.multipleDays,
            isTourDaily: this.isTourDaily
        }
        console.log(body);

        switch (this.action) {
            case ACTION_TOUR.UPDATE: {
                this.onUpdate(this.tourGeneral.id, body, this.selectedDate.date);
                this.isShowrangeDateApply = true;
                break;
            }
            default: {
                this.onCreate(this.tourGeneral.id, body);
                break;
            }
        }
    }

    //fn update dữ liệu ngày khởi hành
    async onUpdate(id: string, body: any, date: any) {
        this._spinner.show();
        try {
            const dataFromServe: any = await this._tourRepo.updateStartingDate(id, body);
            if (dataFromServe.code === 'Success') {
                this._notifi.pushAlert('Thành công', `Dữ liệu ngày khởi hành ${date} đã được cập nhật`, 'success');
            }
            else {
                const errs = new Error(dataFromServe.errors[0]);
                this._notifi.pushToast(`${errs.value || 'Có lỗi xảy ra'}`, 'vui lòng kiểm tra lại', 'error', 2000);
            }

        } catch (error) {
            const errs = new Error(error[0]);
            this._notifi.pushToast(`${errs.value || 'Có lỗi xảy ra'}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn tạo ngày khởi hành
    async onCreate(id: string, body: any) {
        this._spinner.show();
        try {
            const dataFromServe: any = await this._tourRepo.createApplyDate(id, body);
            if (dataFromServe.code === 'Success') {
                this._notifi.pushAlert('Tạo ngày khởi hành thành công', '', 'success');
                this.isShowStartingDateForm = false;
                this.isCreated = true;
            }
            else {
                const errs = new Error(dataFromServe.errors[0]);
                this._notifi.pushToast(`${errs.value || 'Có lỗi xảy ra'}`, 'vui lòng kiểm tra lại', 'error', 2000);
            }
        } catch (error) {
            const errs = new Error(error.errors[0]);
            this._notifi.pushToast(`${errs.value || 'Có lỗi xảy ra'}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn upload image transport
    uploadImageTransport(src: string, type: string) {
        if (type == 'depart') {
            const image: Image = new Image();
            image.src = src;
            image.name = this.departAirline.value;
            if (!this.departInfo) {
                this.departInfo = new DepartInfo();
            }
            this.departInfo.transportSupplier = {
                address: null,
                code: null,
                logo: image,
                name: this.departAirline.value
            };
            this.departInfo.transportClass = null;
        }

        if (type === 'return') {
            const image: Image = new Image();
            image.src = src;
            image.name = this.returnAirline.value;

            if (!this.returnInfo) {
                this.returnInfo = new DepartInfo();
            }
            this.returnInfo.transportSupplier = {
                address: null,
                code: null,
                logo: image,
                name: this.returnAirline.value
            };
            this.returnInfo.transportClass = null;
        }
    }


    //fn hủy tạo tour
    btnCancel() {
        this.isShowStartingDateForm = false;
    }

    //fn button tiếp tục
    btnNextTab() {
        this.changeTab.emit('image');
    }

    //fn get tất cả ngày khởi hành
    async getAllTourDepart(id: string) {
        this._spinner.show();

        try {
            const dataFromServe: any = await this._tourRepo.getAllTourDepart(id);
            this.tourDeparts = dataFromServe.data || [];
            this.tourDeparts.map(item => {
                this.rangeDateApply.push(moment(item.departDate, "YYYY-MM-DD[T]HH:mm").format("DD/MM/YYYY"));
            });
        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    //fn get thong tin cua tour (luồng update)
    async getTourInfo(id: string) {
        this._spinner.show();
        try {
            const dataFromServe: any = await this._tourRepo.getTour(id);
            this.tourGeneral = dataFromServe.data;
            this.tourCode = this.tourGeneral.code;
            this.pathTransport = `tour/${this.tourGeneral.supplier.code}/transport`;
        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    //fn xóa ngày khởi hành
    deleteStartingDate(selectedDate: any) {
        this._notifi.pushQuestion('Bạn có muốn xóa dữ liệu tour ngày', `<strong>${selectedDate.date}</strong>`, true, 'Xóa', 'Hủy').then(async (value: any) => {
            if (value.value) {
                this._spinner.show();
                try {
                    const dataFromServe: any = await this._tourRepo.deleteApplyDate(selectedDate.dateNumber.format("YYYY-MM-DD[T]HH:mm"), this.tourGeneral.id);

                    if (dataFromServe.code === 'Success') {
                        this._notifi.pushAlert('Thành công', `Dữ liệu ngày khởi hành ${selectedDate.date} đã được xóa`, 'success');
                        this.isShowStartingDateForm = !this.isShowStartingDateForm;

                        //remove date apply
                        this.rangeDateApply.splice(this.rangeDateApply.findIndex(date => date === selectedDate.date), 1);
                    }
                    else {
                        const error = new Error(_.head(dataFromServe.errors))
                        this._notifi.pushToast(`${error.value}`, 'Vui lòng kiểm tra lại', 'error');
                    }

                } catch (errors) {
                    const error = new Error(_.head(errors.errors))
                    this._notifi.pushToast(`${error.value}`, 'Vui lòng kiểm tra lại', 'error');
                }
                finally {
                    this._spinner.hide();
                }
            }
        });

    }
}

