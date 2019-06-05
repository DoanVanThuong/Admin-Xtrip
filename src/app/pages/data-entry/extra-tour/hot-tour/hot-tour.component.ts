import { Component} from '@angular/core';
import { AppList } from '../../../../app.list';
import { TourRepo, Tour, Spinner, NotificationService, Error } from '../../../../common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'hot-tour',
    templateUrl: './hot-tour.component.html',
    styleUrls: ['./hot-tour.component.less']
})

export class HotTourComponent extends AppList {
    tours: Tour[] = [];
    selectedIndex: number = 0;
    constructor(private _tourRepo: TourRepo,
        private _spinner: Spinner,
        private _title: Title,
        private _router: Router,
        private _notificaiton: NotificationService,
    ) {
        super();
        this.request = this.getListTour;
        this._title.setTitle("DataEntry - Tour Hot");

    }

    ngOnInit(): void {
        this.getListTour();

    }

    //fn get list tour hot
    async getListTour() {
        this._spinner.show();
        const body = {
            keyword: this.keyword,
            sortBy: "",
            descending: false
        }
        try {
            const dataFormServe: any = await this._tourRepo.getTourHot((this.page - 1) * this.pageSize, this.limit, body);
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
    async updateTourHot(currenIndex: number = 0, dropIndex: number = 0, value: Tour) {
        this._spinner.show();
        try {
            const body = {
                tourCode: value.code,
                lastWeight: currenIndex,
                weight: dropIndex + 1
            }
            await this._tourRepo.updateTourHot(body, value.id);
            this.getListTour();
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    addTourHot() {
        this._router.navigate(['data-entry/extra-tour/create-hot-tour'], {queryParams: { type: 'hot'}});
    }

    //fn copy clipboard
    onClipboardSuccess(e: any) {
        this._notificaiton.pushToast('Đã copy mã', `${e.content}`, 'success', 1000, { showConfirmButton: false });
    }

    //fn on drop tour
    dropTour(e: any) {
        if (this.selectedIndex !== e.dropIndex){
            this.updateTourHot(e.value.weight, e.dropIndex, e.value);
        }
    }

    dragTour(e: any) {
        this.selectedIndex = e.el.rowIndex;
        this.selectedIndex--;
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
            await this._tourRepo.deleteTourHot(id);
            this._notificaiton.pushAlert('Xóa thành công', '', 'success', 2000);
            this.getListTour();
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }
}
