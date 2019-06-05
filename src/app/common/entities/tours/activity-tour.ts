import { Image } from "../image";

export class ActivityTour {
    text: string = '';
    image: Image = new Image();

    constructor(data?: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }

    getImage() {
        return this.image;
    }


}