import { Component, EventEmitter, Output } from '@angular/core';
import { CSECURITY, CSTORAGE, ACTION_TOUR } from '../../../../../app.constants';
import { StorageService, TourRepo, NotificationService, Spinner, TourTerm, TourPolicy, ScheduleTour, ScheduleOption } from '../../../../../common';

import { environment } from '../../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AppBase } from '../../../../../app.base';

enum TYPE_SURCHARGE {
    INTERNATIONAL = 'international',
    DOMESTIC = 'domestic',
    COMMON = 'common'
}
@Component({
    selector: 'tour-policy',
    templateUrl: './policy.component.html',
    styleUrls: ['./policy.less']
})

export class TourPolicyComponent extends AppBase {
    @Output() changeTab = new EventEmitter();

    action: string = ACTION_TOUR.CREATE;
    tourId: string = '';

    optionEditor: any = '';
    policy: TourPolicy = new TourPolicy();
    term: TourTerm = new TourTerm();

    mediaurl = environment.HOST_IMG;
    bearer = '';
    module = 'tour';
    tourInfo: any = {};

    isInternational: boolean = false;

    constructor(
        private _localstorage: StorageService,
        private _tourRepo: TourRepo,
        private _activedRoute: ActivatedRoute,
        private _notification: NotificationService,
        private _spinner: Spinner) {
        super();

    }

    ngOnInit() {
        this.bearer = this._localstorage.getItem(CSECURITY.tokenName, false);

        //init data update
        this._activedRoute.queryParams.subscribe((params) => {
            if (!!params && params.id && params.action) {
                this.action = params.action;
                this.tourId = params.id;
                this.getTourInfo(this.tourId);
                this.getTermPolicy(this.tourId)

            }
        });
        switch (this.action) {
            case ACTION_TOUR.CREATE: {
                this.tourInfo = this._localstorage.getItem(CSTORAGE.TOUR_GENERAL, true);
                this.isInternational = this.tourInfo.isInternational;

                // lọc phụ thu theo tour quốc tế | trong nước
                this.policy.surcharges = <any>this.initSurcharges().filter((item: ISurcharge) => {
                    return (!this.isInternational ? item.type === TYPE_SURCHARGE.COMMON : item)
                });
                break;
            }
            case ACTION_TOUR.CLONE: {
                this.tourInfo = this._localstorage.getItem(CSTORAGE.CLONETOUR, true);
                this.isInternational = this.tourInfo.isInternational;

                break;
            }
            default:
                break;
        }


        //init text editor
        this.optionEditor = {
            htmlExecuteScripts: false,
            heightMin: 150,
            charCounterCount: false,
            theme: 'royal',
            fontFamily: {
                "Roboto,sans-serif": 'Roboto',
                "Oswald,sans-serif": 'Oswald',
                "Montserrat,sans-serif": 'Montserrat',
                "'Open Sans Condensed',sans-serif": 'Open Sans Condensed',
                "'Arial',sans-serif,": 'Arial',
                "Time new Roman": 'Time new Roman',
                "Tahoma": 'Tahoma'
            },
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertTable', '|', 'emoticons', 'fontAwesome', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            quickInsertButtons: ['table', 'ul', 'ol', 'hr'],
            fontFamilySelection: true,
            language: 'vi',
            requestHeaders: {
                Authorization: 'Bearer ' + this.bearer,
                Module: this.module
            },
            imageManagerPageSize: 20,
            imageManagerScrollOffset: 10,
            imageUploadURL: this.mediaurl + '/Media/Upload/Image',
            fileUploadURL: this.mediaurl + '/Media/Upload/File',
            imageManagerLoadURL: this.mediaurl + '/Media/Images'
        };
    }

    //btn thêm, update chính sách điều khoản
    onAddPolicyTerm() {
        if (this.action === ACTION_TOUR.UPDATE) {
            this.onUpdate();
        }
        else {
            this.onCreate();
        }
    }

    //fn create term, policy
    async onCreate() {
        try {
            const dataFromServer: any = await this.addPolicyTerm(this.tourInfo.id, this.policy, this.term);
            if (dataFromServer.code == 'Success') {
                this.changeTab.emit('hashtag');
            }
            else {
                const err: Error = new Error();
                throw err;
            }
        } catch (error) { }
    }

    //fn update term, policy
    async onUpdate() {
        try {
            const dataFromServer: any = await this.addPolicyTerm(this.tourId, this.policy, this.term);
            if (dataFromServer.code === 'Success') {
                this._notification.pushAlert('Thành công', 'Cập nhật chính sách điều khoản thành công', 'success');
            }
        } catch (error) {
            const err: Error = new Error();
        }
    }

    //fn thêm chính sách điều khoản
    addPolicyTerm(id: string, policy: any, term: any) {
        try {
            return this._tourRepo.setTermPolicyTour(id, policy, term);
        } catch (error) { }
    }

    //fn get chính sách điều khoản
    async getTermPolicy(id: string) {
        this._spinner.show();
        try {
            const dataFromServer: any = await this._tourRepo.getTourTermAndPolicy(id);
            this.term = dataFromServer.data.terms || new TourTerm();
            this.policy = dataFromServer.data.policy || new TourPolicy();
            
            // lọc phụ thu theo tour quốc tế | trong nước
            if (!this.policy.surcharges.length) {
                const data = <any>this.initSurcharges().filter((item: ISurcharge) => {
                    return (!this.isInternational ? item.type === TYPE_SURCHARGE.COMMON : item)
                });
                this.policy.surcharges = data;
            }
        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    //fn add more option
    addMoreOption() {
        if (!!this.policy.surcharges) {
            this.policy.surcharges.push(new ScheduleOption());
        }
        else {
            this.policy.surcharges = new Array<ScheduleOption>(new ScheduleOption());
        }
    }

    //fn delete option
    onDeleteOption(index: number) {
        this.policy.surcharges.splice(index, 1);
    }

    detectDisabled() {
        return !this.policy.exclude || !this.policy.include || !this.term.notes || !this.term.refund || (this.isInternational ? !this.term.visa : false) || this.validateData(this.policy.surcharges);
    }

    //fn get thong tin tour
    async getTourInfo(id: string) {
        this._spinner.show();
        try {
            const dataFormServe: any = await this._tourRepo.getTour(id);
            this.isInternational = dataFormServe.data.isInternational;
        } catch (error) {
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn init surcharges
    initSurcharges(): ISurcharge[] {
        //common: bao gồm trong nước và quốc tế
        //international: quốc tế
        return [
            { title: 'Tips cho tài xế và HDV', value: '', type: 'international' },
            { title: 'Phụ thu phòng đơn', value: '', type: 'common' },
            { title: 'Phụ thu khách Ngoại quốc', value: '', type: 'common' },
            { title: 'Phụ thu khách Đài Loan hoặc người Việt sinh sống tại Đài Loan', value: '', type: 'international' },
            { title: 'Visa tái nhập Việt Nam (Khách Ngoại quốc/Việt Kiều/Việt Kiều có tên không thuần Việt)', value: '', type: 'international' },
            { title: 'Phụ thu Lễ/Tết', value: '', type: 'international' },
        ];
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

interface ISurcharge {
    title: string;
    value: string;
    type: string;
}