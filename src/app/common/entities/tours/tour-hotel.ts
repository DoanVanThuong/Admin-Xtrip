import { Image } from "../image";

export class TourHotel {
    name: string = '';
    code: string = '';
    photo: Image = new Image();
    star: number = 1;
    room: string = '';
    show: boolean = false;
    selected: boolean = false;
    source: any[] = [];
    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }

            // if (!!data.source) {

            //     self.source = data.source.map(hotel => new Hotel(hotel));
            // }
        })
    }




}