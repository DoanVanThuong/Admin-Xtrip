import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { UtilityHelper } from '../helpers';

@Pipe({ name: 'monthYear' })

export class MonthYearPipe implements PipeTransform {
    utilyti = new UtilityHelper()
    transform(date: any) {
        if (typeof (date) == 'string' || typeof (date) === 'object') {
            return 'Tháng ' + this.utilyti.getMonth(date) + ', ' + this.utilyti.getYear(date);
        }
        return '';
    }
}