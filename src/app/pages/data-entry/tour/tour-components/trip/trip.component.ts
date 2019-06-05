import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivityTour, ScheduleTour, TourGeneral, ScheduleOption, } from '../../../../../common/entities';
import { StorageService, TourRepo, NotificationService, Spinner } from '../../../../../common';
import { CSTORAGE, ACTION_TOUR, OPTION_MEAL } from '../../../../../app.constants';
import { ActivatedRoute } from '@angular/router';
import { PreviewJourneyPopupComponent } from '../../../../../components';

import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'tour-trip',
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.less']
})

export class TourTripComponent {
    @Output() changeTab = new EventEmitter();
    @ViewChild(PreviewJourneyPopupComponent) previewPopup: PreviewJourneyPopupComponent;

    tourId: string = '';
    action: string = ACTION_TOUR.CREATE;
    tourGeneral: TourGeneral = new TourGeneral();
    days: number = 0;

    //khởi tạo chuyến đi
    journey: Partial<IJourney> = null;
    summary: string = '';

    //init lịch trình đang xét
    selectedSchedule: Partial<ScheduleTour> = {};

    //init hành trình đang xét
    selectedActivitiy: ActivityTour = null;

    optionEditor: any = {
        htmlExecuteScripts: false,
        placeholderText: 'Nhập hành trình...',
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertTable', '|', 'emoticons', 'fontAwesome', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
        quickInsertButtons: ['table', 'ul', 'ol', 'hr']
    };

    //config server ảnh
    folderImage: string = 'tour'; // thư mục image trên server
    indexSchedule: number = 0;
    path: string = '';

    options: any[] = [OPTION_MEAL.BREAKFAST, OPTION_MEAL.LUNCH, OPTION_MEAL.DINNER, OPTION_MEAL.SNACK, OPTION_MEAL.RELAX];
    optionValues: any[] = [];

    constructor(
        private _localstorage: StorageService,
        private _tourRepo: TourRepo,
        private notification: NotificationService,
        private _activedRoute: ActivatedRoute,
        private _spinner: Spinner,
        private _http: HttpClient) {
      
    }

    ngOnInit() {
        this.getOption().toPromise().then((data: any[]) => {
            this.optionValues = data;
        });

        this._activedRoute.queryParams.subscribe((params: any) => {
            if (!!params && params.id && params.action) {
                this.action = params.action;
                this.tourId = params.id;
                this.getJourneyTour(this.tourId);
            }
        });

        switch (this.action) {
            case ACTION_TOUR.CREATE: {
                this.initJourney();

                this.tourGeneral = this._localstorage.getItem(CSTORAGE.TOUR_GENERAL, true) || {};

                for (let index = 0; index < this.tourGeneral.days - 1; index++) {
                    this.onAddMoreSchedule();
                }

                //cập nhật lịch trình, hoạt động mặc định đang chọn
                this.selectedSchedule = this.journey.details[0];
                this.selectedActivitiy = this.selectedSchedule.items[0];
                break;
            }
            case ACTION_TOUR.CLONE: {
                this.tourGeneral = this._localstorage.getItem(CSTORAGE.CLONETOUR, true) || {};
                break;
            }
            default:
                this.getTourInfo(this.tourId);
                break;
        }

        this.days = this.tourGeneral.days;
        this.path = "/" + this.tourGeneral.supplier.code + "/" + this.tourGeneral.arrivalCode
    }

    //fn get thong tin cua tour
    async getTourInfo(id: string) {
        try {
            const data: any = await this._tourRepo.getTour(id);
            this.tourGeneral = new TourGeneral(data.data);
            this.days = this.tourGeneral.days;
            this.path = "/" + this.tourGeneral.supplier.code + "/" + this.tourGeneral.arrivalCode;

        } catch (error) { }
    }

    //fn init journey
    initJourney() {
        //init lịch trình
        const options = this.initOption(this.options);
        const schedule = new ScheduleTour({
            items: [new ActivityTour()],
            options: options
        });

        //init chuyến đi
        this.journey = { details: [schedule] };
        schedule.setId(this.indexSchedule);
        this.indexSchedule++;
    }

    //thêm 1 ngày lịch trình
    onAddMoreSchedule() {

        //thêm tối đa bằng số ngày
        if (this.journey.details.length === this.tourGeneral.days) {
            return;
        }
        const options = this.initOption(this.options);
        const schedule: ScheduleTour = new ScheduleTour({
            items: [new ActivityTour()],
            options: options,
        });

        schedule.setId(this.indexSchedule);
        this.indexSchedule++;

        this.journey.details.push(schedule);
        this.selectedSchedule = schedule;
    }

    //thêm hành trình ( hoạt động trong ngày)
    onAddMoreActivities() {
        this.selectedSchedule.items.push(new ActivityTour());
    }

    //lịch trình đang được chọn
    onSelectSchedule(schedule: ScheduleTour) {
        this.selectedSchedule = schedule;
    }

    //xóa ngày lịch trình
    onDeleteItemSchedule(schedule: ScheduleTour) {
        if (this.journey.details.length === 1) {
            return false;
        }
        const index = _.findIndex(this.journey.details, item => item === schedule);

        this.selectedSchedule = schedule;
        this.journey.details.splice(index, 1);
        this.selectedSchedule = null;

        if (index === this.journey.details.length) {
            this.indexSchedule = this.journey.details.length;
        }

        this.selectedSchedule = this.journey.details[0];
    }

    //xóa 1 hành trình
    onDeleteActivity(activity: ActivityTour) {
        if (this.selectedSchedule.items.length === 1) {
            return;
        }
        this.selectedSchedule.items.splice(_.findIndex(this.selectedSchedule.items, item => item == activity), 1);
    }

    //btn tiếp tục
    btnCreateJourney(e) {
        this.createJorurney(this.journey);
    }

    //btn preview
    onPreviewJourney() {
        this.previewPopup.show();
    }

    onUploadImage(src: string, activity: ActivityTour) {
        this.selectedActivitiy = activity;
        this.selectedActivitiy.image.src = src;
    }

    //fn tạo/udpate chuyến đi
    async createJorurney(journey: any) {
        if (this.journey.details.length < this.days) {
            this.notification.pushToast('Lịch trình chưa đủ ngày', 'Vui lòng kiểm tra lại', 'error', 2000);
            return;
        }

        if (this.action === ACTION_TOUR.UPDATE) {
            this.onUpdateJourney(this.journey, this.tourId, 'update');
        }
        else {
            this.onUpdateJourney(this.journey, this.tourGeneral.id, 'create');
        }
    }

    //fn update chuyến đi
    async onUpdateJourney(journey: any, id: string, type: string) {
        try {
            const dataFromServer: any = await this._tourRepo.createJourney(journey, id);
            if (dataFromServer.code == 'Success') {
                if (type === ACTION_TOUR.UPDATE) {
                    this.notification.pushAlert('Thành công', 'Lịch trình đã được cập nhật', 'success');
                }
                else {
                    this.changeTab.emit('policy');
                }
            }
        } catch (error) {
        }
    }

    //fn get thông tin journey
    async getJourneyTour(id: string) {
        this._spinner.show();
        try {
            const dataFromServer: any = await this._tourRepo.getJourney(id);

            if (_.isNull(dataFromServer.data) || _.isNull(dataFromServer.data.summary) && _.isNull(dataFromServer.data.details)) {
                this.initJourney();
            }
            else {
                this.journey = dataFromServer.data;

                //thêm value vào value default nếu tour cũ trước đó có value được nhập thay vì chọn trong default
                let valuesInOption = [];
                for (const item of this.journey.details) {
                    if (!!item && !!item.options && !!item.options.length) {
                        valuesInOption = [...valuesInOption, ...item.options.map((option: ScheduleOption) => {
                            return { title: option.value, value: option.value }
                        }).filter(data => !!data.title && !!data.value)]
                    }
                }

                // xóa trùng theo _key = value
                this.optionValues = _.uniqBy([...this.optionValues, ...valuesInOption], 'value');
            }

            this.selectedSchedule = this.journey.details[0];
            this.selectedActivitiy = this.selectedSchedule.items[0];
            this.indexSchedule = this.journey.details.length;

            this._spinner.hide();

            for (let index = 0; index < this.tourGeneral.days - 1; index++) {
                this.onAddMoreSchedule();
            }

        } catch (error) {
        }
    }

    addMoreOption() {
        if (!!this.selectedSchedule.options && !!this.selectedSchedule.options.length) {
            this.selectedSchedule.options.push(new ScheduleOption({ title: '', value: this.optionValues[0].value }));
        }
        else {
            this.selectedSchedule.options = this.initOption(this.options)
        }
    }

    onDeleteOption(selectedSchedule: ScheduleTour, index: number) {
        if (!!selectedSchedule) {
            this.selectedSchedule.options.splice(index, 1);
        }
    }

    //fn get data option
    getOption() {
        return this._http.get('assets/json/option-journey.json');
    }
    //fn init option;
    initOption(titles: any[]): any[] {
        let arr: any[] = [];
        titles.forEach(element => {
            arr.push(new ScheduleOption({ title: element, value: null }));
        });
        return arr;
    }

    detectDisabled() {
        if (!this.journey || !this.journey.details.length) {
            return false;
        }
        else {
            for (const item of this.journey.details) {
                return this.validateData(item.options)
            }
        }
    }

    validateData(data: Array<any> = []): boolean {
        let isError: boolean = false;
        if (!data || (!!data && !data.length)) {
            return false;
        }

        for (const iterator of data) {
            if (!iterator.title || !iterator.value) {
                isError = true;
            }
        }
        return isError;
    }
}

interface IJourney {
    details: ScheduleTour[];
}