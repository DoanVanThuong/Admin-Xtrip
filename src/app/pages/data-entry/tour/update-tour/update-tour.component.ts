import { Component } from '@angular/core';
import { AppBase } from '../../../../app.base';
import { ActivatedRoute } from '@angular/router';
import { TourRepo, TourGeneral, NotificationService, Error } from '../../../../common';
import { ALL_TAB_CREATE_TOUR } from '../../../../app.constants';

@Component({
    selector: 'update-tour',
    templateUrl: './update-tour.component.html',
    styleUrls: ['./update-tour.less']
})

export class UpdateTourComponent extends AppBase {

    tab: string = '';
    tourId: string = '';
    tourGeneral: TourGeneral = new TourGeneral();

    constructor(private _activeRoute: ActivatedRoute,
        private _tourRepo: TourRepo,
        private _noti: NotificationService
    ) {
        super();
    }

    ngOnInit() {
        this._activeRoute.params.subscribe((param) => {
            if (param.id) {
                this.tourId = param.id;
                this.getTourInfo(this.tourId);
            }
        });

        this.tab = ALL_TAB_CREATE_TOUR.GENERAL;
    }

    //fn get thong tin tour
    async getTourInfo(id: string) {
        try {
            const dataFormServe: any = await this._tourRepo.getTour(id);
            this.tourGeneral = dataFormServe.data;

        } catch (error) { 
            const err: Error = new Error(error[0]);
            this._noti.pushToast(err.value,'','error',2000,{showConfirmButton: false});
        }
    }

    //fn select tab
    selectTab(e: any, tab: string) {
        this.tab = tab;
    }

}