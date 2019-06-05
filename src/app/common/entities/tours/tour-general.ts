import { TourSupplier } from "./tour-supplier";

export class TourGeneral {
    id: string = '';
    name: string = '';
    departureCode: string = '';
    journey: string = '';
    supplier: TourSupplier = new TourSupplier();
    arrivalCode: string = '';

    isInternational: boolean = false
    code: string = '';
    days: number = 0;
    nights: number = 0;
    commissionRate: number = 0;
    rewardPoints: number = 0;

    topics: any[] = [];
    services: any[] = [];
    categories: any[] = [];
    highlights: any[] = [];

    adultRangeAge: any = {}
    childRangeAge: any = {}
    infantRangeAge: any = {}

    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });

        if (!!data && !data.adultRangeAge) {
            this.adultRangeAge = { from: 11, to: 65 }
        }
        if (!!data && !data.childRangeAge) {
            this.childRangeAge = { from: 2, to: 11 }
        }
        if (!!data && !data.infantRangeAge) {
            this.infantRangeAge = { from: 0, to: 2 }
        }
    };

}