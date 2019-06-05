import * as _ from 'lodash';
import { Image } from '../image';

export class TourImage {
    photo: Image = new Image();
    photos: Image[] = [new Image()]

    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    };
}