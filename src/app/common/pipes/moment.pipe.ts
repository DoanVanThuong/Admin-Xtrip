import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { CAPP } from '../../app.constants';

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {
  transform(datetime: any, format: string, fromNowType: boolean = true, short: boolean = false) {

    let date = moment(datetime);
    if (!date.isValid()) {
      return datetime;
    }

    if (!format) {
      format = CAPP.DATE_FORMAT;
    }

    if (date) {
      switch (format) {
        case 'ago': {
          return moment(date).fromNow(fromNowType);
        }
        case 'time_ago': {
          let unit = '';
          let count: number = 0;

          let now = moment();
          date = moment(date);

          switch (true) {
            case now.diff(date, 'years') > 0:
              unit = short ? 'y' : 'năm';
              count = now.diff(date, 'years');
              break;

            case now.diff(date, 'months') > 0:
              unit = short ? 'm' : 'tháng';
              count = now.diff(date, 'months');
              break;

            case now.diff(date, 'days') > 0:
              unit = short ? 'd' : 'ngày';
              count = now.diff(date, 'days');

              if (count >= 7) {
                unit = short ? 'w' : 'tuần';
                count = Math.floor(count / 7);
              }
              break;

            case now.diff(date, 'hours') > 0:
              unit = short ? 'h' : 'giờ';
              count = now.diff(date, 'hours');
              break;

            case now.diff(date, 'minutes') > 0:
              unit = short ? 'min' : 'phút';
              count = now.diff(date, 'minutes');
              break;

            default:
              unit = short ? 's' : 'giây';
              count = now.diff(date, 'seconds');
              break;
          }

          if (count === 0) {
            unit = 'một vài giây trước';
          }

          let time = (!!count ? count : '') + ' ' + unit;

          if (fromNowType) {
            return time + ' trước';
          }

          let isFuture = count < 0;

          return time + ' ' + (!!now ? (isFuture ? 'kể từ bây giờ' : 'cách đây') : (isFuture ? 'sau' : 'trước'));
        }
        default: {
          return moment(date).format(format);
        }
      }
    } else {
      return date;
    }
  }
}
