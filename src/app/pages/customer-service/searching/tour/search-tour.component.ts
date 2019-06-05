import { Component, ViewChild } from '@angular/core';
import { TourDepart, TourArrival, TourRepo, Spinner, NotificationService, Error, Tour } from '../../../../common';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AppList } from '../../../../app.list';
import { TourDetailPopup } from '../components/tour-detail/tour-detail.popup';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search-tour',
    templateUrl: './search-tour.component.html',
    styleUrls: ['./search-tour.component.less']
})
export class SearchTourComponent extends AppList {
    @ViewChild(TourDetailPopup) tourInfo: TourDetailPopup;

    formTour: FormGroup;
    placeDepart: AbstractControl;
    placeArrival: AbstractControl;
    tourType: AbstractControl;
    departDate: AbstractControl;

    tourTypes: any[] = [];
    tourTypeSelected: any = null;

    departs: TourDepart[] = new Array<TourDepart>();
    arrivals: TourArrival[] = new Array<TourArrival>();
    selectedDepart: TourDepart = new TourDepart();
    selectedArrival: TourArrival = new TourArrival();

    isSearch: boolean = false;
    isSelectedDepart: boolean = false;
    isSelectedArrival: boolean = false;

    startDate: any;
    endDate: any;

    tours: Tour[] = [];
    selectedTour: Tour = null;

    isLookup: boolean = false;

    constructor(
        private _tourRepo: TourRepo,
        private _spinner: Spinner,
        private _notificaiton: NotificationService,
        private fb: FormBuilder,
        private _router: Router
    ) {
        super();
        this.request = this.onSubmit;
    }

    ngOnInit(): void {
        this.tourTypes = [{ title: 'Trong nước', selected: true, IsInternational: false }, { title: 'Nước ngoài', selected: false, IsInternational: true }];
        this.tourTypeSelected = this.tourTypes[0];
        this.initForm();
    }

    //init form tour
    initForm() {
        this.formTour = this.fb.group({
            'placeDepart': [, Validators.compose([
                Validators.required
            ])],
            'placeArrival': [, Validators.compose([
                Validators.required
            ])],
            'tourType': [{ value: this.tourTypeSelected }],
            'departDate': [moment()],
        });

        this.placeDepart = this.formTour.controls['placeDepart'];
        this.placeArrival = this.formTour.controls['placeArrival'];
        this.tourType = this.formTour.controls['tourType'];
        this.departDate = this.formTour.controls['departDate'];
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
        if (keyword.length > 0) {

            [this.isSearch, this.isSelectedDepart] = [true, false];
            this.departs = await this.getTourdeparture(keyword);
        }
        else if (keyword.length == 0) {
            this.onHideSearch();
            this.isSelectedDepart = false;
        }
    }

    // fn search Arrival auto complete
    async searchArrival(keyword: string) {
        if (keyword.length > 0) {
            [this.isSearch, this.isSelectedArrival] = [true, false];
            this.arrivals = await this.getTourArrival(this.tourTypeSelected.IsInternational, keyword);
        }
        else if (keyword.length == 0) {
            this.onHideSearch();
            this.isSelectedArrival = false;
        }
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
        this.tourTypeSelected = tourType;
        this.placeArrival.setValue("");
        // this.departDate.setValue(moment());
    }
    onRangeDateChange(value: any) {
        if (!!value) {
            this.startDate = moment(value[0]).format("YYYY-MM-DD");
            this.endDate = moment(value[1]).format("YYYY-MM-DD");
        }
    }

    async onSubmit(value: any) {
        this._spinner.show();
        const body = {
            arrival: this.selectedArrival.code,
            depart: this.selectedDepart.code,
            from: this.startDate,
            to: this.endDate
        }
        try {
            const response: any = await this._tourRepo.searchTourOSE(body, (this.page - 1) * this.pageSize, this.limit);
            this.tours = (response.data.tours || []).map((item: Tour) => new Tour(item));

            this.total = response.data.total || 0;
            this.isLookup = true;
        } catch (error) {

        }
        finally {
            this._spinner.hide();
        }
    }

    //view detail tour popup
    viewDetail(tour: Tour) {
        this.selectedTour = tour;
        setTimeout(() => {
            this.tourInfo.show();
        }, 100);
    }

    //fn book tour using serialCode
    onBookTour(tour: Tour) {
        this._router.navigate(['booking/tour'], {
            queryParams: {
                tab: 'general',
                serialCode: tour.code
            }
        });
    }
}
