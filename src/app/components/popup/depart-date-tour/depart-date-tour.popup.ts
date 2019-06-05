import { Component, ViewEncapsulation, Input } from '@angular/core';
import * as moment from 'moment';
import { PopupBase } from '../popup.component';
import { TourRepo } from '../../../common';

@Component({
    selector: 'depart-date-tour-calendar-popup',
    templateUrl: './depart-date-tour.popup.html',
    styleUrls: ['./depart-date-tour.popup.less'],
    encapsulation: ViewEncapsulation.None
})

export class DepartDateTourPopupComponent extends PopupBase {
    @Input() departDates: any[] = [];
    @Input() id: string = '';
    isLoading: boolean = false;
    currentMonth: any = moment();
    constructor(private _tourRepo: TourRepo) {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {

    }

    ngOnChanges() {
        this.currentMonth = moment();
        this.getDataDepart(this.id);
    }

    // fn disable button next/prev
    // onDisabledPrevMonth = (): boolean => {
    //     return this.currentMonth.diff(moment().add(1, 'month').subtract(1, 'day'), 'month') < 0;
    // };

    // onDisabledNextMonth = (): boolean => {
    //     return this.currentMonth.diff(moment().add(1, 'month').subtract(1, 'day'), 'month') > 11;
    // };

    // on select next month - change month
    onSelectNextMonth = (unit: number = 0): void => {
        this.currentMonth.add(unit, 'month');
    };

    async getDataDepart(id){
        this.isLoading = true;
        try {
            const response: any = await this._tourRepo.getAllTourDepart(id);
            this.departDates = response.data;
        } catch (error) {
        }
        finally{
            this.isLoading = false;
        }
    }
}