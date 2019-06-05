import { Image } from "../image";

export class Airline {
    id: string = '';
    code: string = '';
    name: string = '';
    photo: Image = new Image();
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