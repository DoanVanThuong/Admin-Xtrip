import * as _ from 'lodash';


export class ScheduleOption {
    title: string = '';
    value: string = '';

    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }

    setTitle(title: string = '') {
        this.title = title;
    }

    setValue(value: string = '') {
        this.value = value;
    }
}
