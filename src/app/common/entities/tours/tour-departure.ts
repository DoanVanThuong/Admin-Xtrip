import * as _ from 'lodash';

export class TourDepart {
    id: string = '';
    code: string = '';
    name: string = '';
    selected: boolean = false;

    constructor(data?: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }
}