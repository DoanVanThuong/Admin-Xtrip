import { DepartInfo } from "./tour-depart-info";
import { TourHotel } from "./tour-hotel";
import { Hotel } from "../hotels/hotel";

export class TourStartingDate {
    originalPrice: number = 0;
    adultPrice: number = 0;
    childPrice: number = 0;
    infantPrice: number = 0;
    percentChildPrice: number = 0;
    percentInfantPrice: number = 0;
    quantity: number = 0;

    transportClass: any = null;
    usePercentage: boolean = false;
    isTourDaily: boolean = false;
    multipleDays: boolean = false;

    code: string = '';
    departDate: string = '';
    tourCode: string = '';
    transportType: string = '';

    rangeDate: any[] = [];
    departInfo: DepartInfo = new DepartInfo();
    returnInfo: DepartInfo = new DepartInfo();
    hotels: TourHotel[] = new Array<TourHotel>();

    adultRangeAge: any = {
        from: 11,
        to: 100
    };
    childRangeAge: any = {
        from: 2,
        to: 11
    };
    infantRangeAge: any = {
        from: 0,
        to: 2
    };
    
    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }


}