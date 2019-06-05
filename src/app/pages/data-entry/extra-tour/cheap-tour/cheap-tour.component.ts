import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { TourRepo, Spinner, NotificationService, Tour, Error } from '../../../../common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'cheap-tour',
    templateUrl: './cheap-tour.component.html',
    styleUrls: ['./cheap-tour.component.less']
})
export class CheapTourComponent extends AppList {

    tours: Tour[] = [];
    selectedIndex:number = 0;

    tourTypeSelected: any = null;
    tourTypes: any = [];

    constructor(private _tourRepo: TourRepo,
        private _spinner: Spinner,
        private _title: Title,
        private _router: Router,
        private _notificaiton: NotificationService) { 
        super();
        this.request = this.getListTour
        this._title.setTitle("DataEntry - Tour nổi bật");

    }

    ngOnInit(): void { 
        this.tourTypes = [
            { title: 'Tour trong nước', isInternational: false },
            { title: 'Tour nước ngoài', isInternational: true },
        ];
        this.tourTypeSelected = this.tourTypes[1];

        this.getListTour();
    }

    //fn get list tour hot
    async getListTour() {
        this._spinner.show();
        const body = {
            keyword: this.keyword,
            sortBy: "",
            descending: false,
            isinternational: this.tourTypeSelected.isInternational
        }
        try {
            const dataFormServe: any = await this._tourRepo.getTourPopular((this.page - 1) * this.pageSize, this.limit, body);
            this.total = dataFormServe.data.total || 0;
            this.tours = (dataFormServe.data.data || []).map((item: Tour) => new Tour(item));

        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn update tour hot
    async updateTourPopular(currentIndex:number = 0, dropIndex: number = 0, value: Tour) {
        this._spinner.show();
        try {
            const body = {
                tourCode: value.code,
                lastWeig: currentIndex,
                weight: dropIndex + 1
            }
            await this._tourRepo.updateTourPopular(body, value.id);
            this.getListTour();
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    addTourPopular() {
        this._router.navigate(['data-entry/extra-tour/create-hot-tour'], {queryParams: {type: 'cheap', isInternational: this.tourTypeSelected.isInternational}});
    }

    //fn copy clipboard
    onClipboardSuccess(e: any) {
        this._notificaiton.pushToast('Đã copy mã', `${e.content}`, 'success', 1000 , {showConfirmButton: false});
    }

    //fn on drop tour
    dropTour(e: any) {
        if (this.selectedIndex !== e.dropIndex) {
            this.updateTourPopular(e.value.weight, e.dropIndex, e.value);
        }
    }

    dragTour(e: any) {
        this.selectedIndex = e.el.rowIndex;
        this.selectedIndex--;
    }

    onChangeTourType(tourType: any) {
        this.tourTypeSelected = tourType;
        this.getListTour();
    }

    //fn on delete tour
    onDeleteTour(tour: Tour) {
        this._notificaiton.pushQuestion(`Xóa tour ${tour.name}`, 'Bạn có chắc?', true, 'Xóa', 'Hủy').then((value: any) => {
            if (value.value) {
                this.deleteTour(tour.id);
            }
        })
    }

    async deleteTour(id: string) {
        this._spinner.show();
        try {
            await this._tourRepo.deleteTourPopular(id);
            this._notificaiton.pushAlert('Xóa thành công', '', 'success', 2000);
            this.getListTour();
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally{
            this._spinner.hide();
        }
    }
}
