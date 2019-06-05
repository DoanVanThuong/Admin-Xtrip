import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'issueNow' })

export class IssueNowPipe implements PipeTransform {
    transform(date: string, type: string = 'name') {
        let hours = moment.duration(moment(date, "YYYY-MM-DDTHH:mm+07:00").diff(moment())).asHours();
        if (!!date && type === 'name') {
            if (hours >= 0 && hours <= 0.5) {
                return 'Xuất vé ngay';
            }
            else {
                return 'Xuất vé';
            }
        }
        else {
            if (hours >= 0 && hours <= 0.5) {
                return 'btn-danger';
            }
            else {
                return '';
            }
        }
    }
}