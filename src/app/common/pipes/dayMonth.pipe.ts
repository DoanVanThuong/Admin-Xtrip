import { Pipe, PipeTransform } from '@angular/core';
import { UtilityHelper } from '../helpers';

@Pipe({ name: 'dayMonth' })

export class DayMonthPipe implements PipeTransform {
    utilyti = new UtilityHelper()
    transform(date) {
        if (date) {
            return this.utilyti.getDate(date) + '/' + this.utilyti.getMonth(date);
        }
        return '';
    }
}