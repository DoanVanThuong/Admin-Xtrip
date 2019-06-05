import { Component, Input, ViewChild, HostListener } from "@angular/core";
import * as _ from "lodash";
import { TYPE_TRANSFER, ACTION_TOUR } from "../../app.constants";
import * as moment from "moment";
import { AppBase } from "../../app.base";
import { TourInfoPopupComponent } from "../popup/tour-info/popup-tour-info.component";
import { TourRepo, Spinner } from "../../common";
import { GlobalState } from "../../global.state";
import { Router } from "@angular/router";

@Component({
    selector: "sidebar-detail",
    templateUrl: "./sidebar-detail.component.html",
    styleUrls: ['./sidebar-detail.less']
})

export class SidebarDetailComponent extends AppBase {

    @Input() open = false; //open or close
    @Input() data: any; //data in sidebar
    @Input() type: TYPE_TRANSFER; //type

    @ViewChild(TourInfoPopupComponent) tourInfoPopup: TourInfoPopupComponent;

    isShowFlight: boolean = false;
    isShowHotel: boolean = false;
    isShowTour: boolean = false;
    isShowProduct: boolean = false;

    @Input() id: string = '';
    tourInfoDetail: any = null;
    journey: any = null;

    depositTitle: string = 'Số tiền khách sẽ thanh toán ';
    
    constructor(private _tourRepo: TourRepo,
        private _route: Router,
        private _spinner: Spinner) { super(); }

    ngOnInit() { }

    ngOnChanges() {
        if (_.isEmpty(this.data)) {
            this.open = false;
        } else this.open = true;
        
        switch (this.type) {

            case TYPE_TRANSFER.FLIGHT: {
                [this.isShowFlight, this.isShowHotel, this.isShowTour, this.isShowProduct] = [true, false, false, false]
                break;
            }

            case TYPE_TRANSFER.HOTEL: {
                [this.isShowFlight, this.isShowHotel, this.isShowTour, this.isShowProduct] = [false, true, false, false]
                break;
            }

            case TYPE_TRANSFER.TOUR: {
                [this.isShowFlight, this.isShowHotel, this.isShowTour, this.isShowProduct] = [false, false, true, false]
                break;
            }
            case TYPE_TRANSFER.PRODUCT: {
                [this.isShowFlight, this.isShowHotel, this.isShowTour, this.isShowProduct] = [false, false, false, true];
                break;
            }
            default:
                [this.isShowFlight, this.isShowHotel, this.isShowTour, this.isShowProduct] = [false, false, false, false];
                break;
        }
    }

    //fn format time arrival
    returnTimeArrival(date: string) {
        return moment(date.substring((date.indexOf("-") || 0) + 1, date.length).trim(), "MM/DD/YYYY hh:mm A").format("HH:mm DD/MM/YYYY");
    }

    //fn format time depart
    returnTimeDepart(date: string) {
        return moment(date.substring(0, date.indexOf("-") || 0).trim(), "MM/DD/YYYY hh:mm A").format("HH:mm DD/MM/YYYY");
    }

    hideDetail() {
        this.open = !this.open;
    }

    //fn view tour detail
    async viewTourDetail() {
        try {
            const response: any = await this._tourRepo.getDetailBookingTour(this.id);
            if (response.code.toLowerCase() === 'success') {
                this.tourInfoDetail = response.data.detail.tourDetailInfo || {};
                this.journey = await this.getJourney(this.tourInfoDetail.tourPriceCode);
                setTimeout(() => {
                    this.tourInfoPopup.show();
                }, 100);
            }
        }
        catch (err) { }
    }

    //fn
    @HostListener('document:keyup', ['$event']) onKeyDown(event) {
        if (event.keyCode === 27 || event.code === 'Escape') {
            if (this.open) {
                this.open = false;
            }
        }
    }

    gotoEditPassenger() {
        this._route.navigate(['booking/tour'], { queryParams: { tab: 'passenger', action: ACTION_TOUR.UPDATE_PASSENGER, bookingId: this.id, adults: this.data.detail.adults, childrens: this.data.detail.children, infants: this.data.detail.infants } });
    }

    //fn get thông tin lich trình tour
    async getJourney(tourCode: string) {
        this._spinner.show();
        try {
            const response: any = await this._tourRepo.getJourneyTourByCode(tourCode);
            return response.data;
        } catch (error) { }
        finally {
            this._spinner.hide(); 1
        }
    }
}
