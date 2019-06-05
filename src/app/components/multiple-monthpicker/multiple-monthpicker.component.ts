import { Component, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { AppBase } from '../../app.base';

@Component({
    selector: 'multiple-monthpicker',
    templateUrl: './multiple.monthpicker.html',
    styleUrls: ['./multiple-monthpicker.less']
})

export class MultipleMonthPickerComponent extends AppBase {

    @Output() selectedMonths: EventEmitter<string[]> = new EventEmitter<string[]>();
    // @Input() currentDate: any;
    currentYear: number = 0;
    year: number = 0;

    monthYear: any[] = [];
    @Input() months: any = [];
    selectedMonth: any;
    week: number = 0;
    constructor() {
        super();
    }

    ngOnInit() {
        //init calendar cho chọn tour theo ngày ( chọn nhiều tháng ) và mảng tháng chứa các tháng được chọn
        this.year = this.currentYear = this.utilityHelper.getYear(this.utilityHelper.getDateStringWithourTime(moment()));
        this.monthYear = this.getFirstDateOfMonthInYear(this.year);
    }


    ngAfterViewInit() {
        // hack to emit value after parent component checking
        setTimeout(() => {
            this.selectedMonths.emit(this.months);
        }, 0);
    }


    //fn btn go next/previous year
    gotoYear(option: string) {
        if (option === 'prev') {
            if (this.year == this.currentYear) {
                return;
            }
            this.currentYear--;
            this.monthYear = this.getFirstDateOfMonthInYear(this.currentYear);
        }
        if (option === 'next') {
            this.currentYear++;
            this.monthYear = this.getFirstDateOfMonthInYear(this.currentYear);
        }
    }

    //get first date in month
    getFirstDateOfMonthInYear(year: number) {
        let firstDateMonth = [];
        for (let i = 0; i < 12; i++) {
            const data = {
                title: 'Tháng ' + (i + 1),
                valueStart: moment().year(year).month(i).startOf('month').format('DD/MM/YYYY')
            }
            firstDateMonth.push(data);
        }

        return firstDateMonth;
    }

    checkSelectedMonth(month: any) {
        return _.includes(this.months, month.valueStart);
    }

    //chọn tháng ( tối đa 3 tháng)
    selectMonth(month: any) {
        const index = _.findIndex(this.months, item => item == month.valueStart);
        if (index === -1) {
            // push vào mảng giá trị là ngày đầu tiên của tháng nếu mảng dưới 3 item
            if (this.months.length > 2) {
                return;
            }
            this.months.push(month.valueStart);
            this.selectedMonths.emit(this.months);
        }
        else this.months.splice(index, 1);
    }
}