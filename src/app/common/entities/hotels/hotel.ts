import * as _ from "lodash";
import { Image } from "../image";

export class Hotel {
    name: string = '';
    photo: Image = new Image();
    hotelCode: string = '';
    class: number = 1;
    code?: string = '';
    address?: string = '';
    stars: number = 1;
    constructor(data?: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }
}

