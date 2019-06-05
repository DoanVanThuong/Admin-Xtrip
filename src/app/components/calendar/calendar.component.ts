import { Component, Input, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { AppBase } from '../../app.base';

const Headers: any = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
const DateOptions: any = {
  format: 'YYYY-DD-MM',
  startOfWeek: 0, // [0-6)
  single: false,
  headers: Headers,
  isOtherDateShow: false,
  isDisableLastDatesInMonth: true,
  isNextButtonShow: false
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent extends AppBase {

  @Input('data') data: Array<any> = [];
  @Input('month') month: number = moment().month();
  @Input('year') year: number = moment().year();

  @Input() headers: Array<any> = Headers;
  @Input('options') options: any = DateOptions;

  private now: any = moment();
  private dates: Array<any> = [];

  rows: number = 5;
  cols: number = 7;
  selectedDate: any = null;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  ngOnChanges() {
    this.handleOptions();
    this.buildCalendar(moment([this.year, this.month, 1]));
  }

  handleOptions = () => {

    this.options = Object.assign({}, DateOptions, this.options);

    this.options.startOfWeek = this.options.startOfWeek % this.cols;

    let headers = [];
    for (let i = 0; i < this.options.headers.slice(0, this.cols).length; i++) {
      headers.push(this.options.headers[(i + this.options.startOfWeek) % this.cols]);
    }

    this.headers = headers;
  };
  // fn convert number to array
  convertNumberToArray = (number: number = 0) => {
    return Array.from(Array(Number(number)).keys()).map(i => i);
  };

  // fn build calendar
  buildCalendar = (month: any = null): void => {

    let firstDayOfWeek = moment([month.year(), month.month(), 1]).day();

    this.dates = [];
    for (let row = 0; row < this.rows; row++) {
      this.dates[row] = [];

      for (let col = 0; col < this.cols; col++) {

        let position = row * this.headers.length + col;
        let date: any = moment(new Date(month.year(), month.month(), position + 1 - firstDayOfWeek + this.options.startOfWeek));

        let item = this.findItemInDataList(date, this.data);
        this.dates[row].push({
          date: date,
          data: !!item ? item : null,
          code: !!item ? item.code : null,
          available: !!item ? item.available : null,
          adultPrice: !!item ? item.adultPrice : null,
          isShowInfo: false
        });
      }
    }
  };

  // fn find date in list
  findItemInDataList = (date: any = null, list: Array<any> = []) => {

    if (!date && !list.length) {
      return null;
    }

    return _.find(list, (item) => {
      return moment(item.departDate).format("DD/MM/YYYY") === moment(date).format("DD/MM/YYYY");
    });
  };

  // fn show date
  onShowDate = (date: any): boolean => {

    if (!this.options.isOtherDateShow) {
      return moment(date).month() === Number(this.month) ? date : '';
    }

    return date;
  };

  // fn detect disabled date (in past)
  onDisabledDate = (date: any): boolean => {
    if (!!date) {
      return ((this.options.isDisableLastDatesInMonth && this.now.diff(moment(date, 'day')) > 0) || moment(date).month() !== Number(this.month));
    }

    return true;
  };


  // fn on select callback
  onSelectDate = (data: any = null) => {
    if(!!data.code) {
      this.selectedDate = data;
      data.isShowInfo = !data.isShowInfo;
    }
  };

  onClickOutside(item: any) {
    item.isShowInfo = false;
  }

}