import * as _ from 'lodash';
export class TourSupplier {
    id: string = '';
    code: string = '';
    name: string = '';
    address: string = '';
    logo: any = {};
    selected: boolean = false;
    
    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}