import * as _ from 'lodash';

export class TourService {
    id: string = '';
    code: string = '';
    name: string = '';
    status: boolean = false;

    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}
