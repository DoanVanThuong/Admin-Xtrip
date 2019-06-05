import { FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Utils } from '../services/utils';
import * as _ from 'lodash';
declare var moment: any;

export class DateValidator {

    //fn validate input isDate 
    public static validate(input: AbstractControl) {
        return (!input.value || (!!input.value && Utils.isDate(input.value))) ? null : {
            validateDate: {
                valid: false
            }
        };
    }


    //fn validate day is newer
    public static validateNewer(startDate, endDate) {
        return (c: FormGroup) => {
            if (!c.controls[startDate].value || !c.controls[endDate].value) {
                return null;
            }
            if (!Utils.isDate(c.controls[startDate].value) || !Utils.isDate(c.controls[startDate].value)) {
                return null;
            }

            let start = new Date(c.controls[startDate].value).getTime();
            let end = new Date(c.controls[endDate].value).getTime();

            return (start <= end) ? null : {
                validateNewer: {
                    valid: false
                }
            };
        }
    }

    //fn validate day lastest
    public static validateLatest(input: AbstractControl) {
        if (!input.value || !Utils.isDate(input.value)) {
            return null;
        }

        let time = new Date(moment(new Date(input.value)).format('YYYY-MM-DD')).getTime();
        let current = new Date(moment(new Date()).format('YYYY-MM-DD')).getTime();

        return (time >= current) ? null : {
            validateLatest: {
                valid: false
            }
        };
    }

    //fn validate số ngày and số đêm 
    public static validateDaysNights(controls: AbstractControl) {
        let day = controls.get('numDay').value;
        let night = controls.get('numNight').value;
        if (!day) {
            return null;
        }
        const validDays: number[] = [night - 1, night, night + 1]; //mảng số ngày cho phép

        const isValidNight: boolean = _.includes(validDays, day);
        if (!isValidNight) {
            controls.get('numNight').setErrors({
                validNights: {
                    valid: false
                }
            });

        } else {
            controls.get('numNight').setErrors(null);
            return null;
        }
    }


    //fn validate giờ khởi hành về, giờ đến 
    public static validateTimeReturn(controls: AbstractControl) {
        let departTime = moment(controls.get('hourReturnStart').value, "HH:mm");
        let arrivalTime = moment(controls.get('hourReturnEnd').value, "HH:mm");

        if (!departTime.isValid()) {
            controls.get('hourReturnStart').setErrors({
                validDate: { valid: false }
            });
        }
        if (!arrivalTime.isValid()) {
            controls.get('hourReturnEnd').setErrors({
                validDate: { valid: false }
            });
        }

        // else if (departTime.isSame(arrivalTime, 'm') || arrivalTime.diff(departTime) < 0) {
        //     controls.get('hourReturnEnd').setErrors({
        //         validDate: { valid: false }
        //     });
        // }
        else {
            controls.get('hourReturnEnd').setErrors(null);
            return null;
        }
    }

    //fn validate giờ khởi hành đi về, giờ đến 
    public static validateTimeDepart(controls: AbstractControl) {
        const departTime = moment(controls.get('hourDepartStart').value, "HH:mm");
        const arrivalTime = moment(controls.get('hourDepartEnd').value, "HH:mm");

        if (!departTime.isValid()) {
            controls.get('hourDepartStart').setErrors({
                validDate: { valid: false }
            });
        }
        if (!arrivalTime.isValid()) {
            controls.get('hourDepartEnd').setErrors({
                validDate: { valid: false }
            });
        }

        // else if (departTime.isSame(arrivalTime, 'm') || arrivalTime.diff(departTime) < 0) {
        //     controls.get('hourDepartEnd').setErrors({
        //         validDate: { valid: false }
        //     });
        // }
        else {
            controls.get('hourDepartEnd').setErrors(null);
            return null;
        }
    }
}
