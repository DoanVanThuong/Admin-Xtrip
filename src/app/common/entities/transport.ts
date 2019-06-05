import { Image } from "./image";

export class Transport {
    name: string = '';
    code: string = '';
    address: string = '';
    logo: Image = new Image();

    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}