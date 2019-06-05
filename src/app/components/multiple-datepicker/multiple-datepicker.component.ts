import { Component, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { AppPage } from '../../app.base';

@Component({
    selector: 'multiple-datepicker',
    templateUrl: './multiple-datepicker.component.html',
    styleUrls: ['./multiple-datepicker.less']
})

export class MultipleDatePickerComponent extends AppPage {
    // vẽ calendar
    date = moment();
    daysArr: any[] = [];
    @Input() daysSelected: any[] = [];

    @Output() selectedDays: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor() {
        super();
    }

    ngOnChanges() {

    }
    ngOnInit() {
        //init calendar chọn nhiều ngày và mảng chứa các ngày được chọn
        this.daysArr = this.ReturnDateInMonth(this.createCalendar(this.date));
    }

    ngAfterViewInit() {
        this.selectedDays.emit(this.daysSelected);
    }

    gotoMonth(option: string) {
        const currentDate = this.returnDateCurrent();
        if (option === 'prev') {
            if (this.utilityHelper.getMonth(this.date.format("DD/MM/YYYY")) === this.utilityHelper.getMonth(currentDate)) {
                return;
            }
            this.date.subtract(1, 'M');
            this.daysArr = this.ReturnDateInMonth(this.createCalendar(this.date));
        }
        if (option === 'next') {
            this.date.add(1, 'M');
            this.daysArr = this.ReturnDateInMonth(this.createCalendar(this.date));
        }
    }

    //get Date Current
    returnDateCurrent(format?: string): string {
        return this.utilityHelper.getDateStringWithourTime(moment(), format);
    }

    //fn return dates in month with title (number) & value ("DD/MM/YYYY")
    ReturnDateInMonth(days: any) {
        const daysArr = days.map(day => {
            const body = {
                title: this.utilityHelper.getDate(day) || '',
                value: this.utilityHelper.getDateString(day, "DD/MM/YYYY")
            };
            return body;
        });
        return daysArr;
    }

    //return array moment day in month
    createCalendar(month) {
        const firstDay = moment(month).startOf('month');

        let days = Array.apply(null, { length: month.daysInMonth() })
            .map(Number.call, Number)
            .map(n => {
                return moment(firstDay).add(n, 'd');
            });
        for (let n = 0; n < firstDay.weekday(); n++) {
            days.unshift(null);
        }
        return days;
    }

    selectedDates(date: any) {

        const index = _.findIndex(this.daysSelected, item => item === date.value);
        if (index === -1) {
            this.daysSelected.push(date.value);
            this.selectedDays.emit(this.daysSelected);
        }
        else this.daysSelected.splice(index, 1);
    }

    checkDayInArray(date: any) {
        return _.includes(this.daysSelected, date.value);
    }

}