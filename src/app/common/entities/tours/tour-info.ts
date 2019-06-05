import { Image } from "../image";
import { TourService } from "./tour-service";
import { TourBenefit } from "./tour-benefit";
import { TourTopic } from "./tour-topic";
import { TourSupplier } from "./tour-supplier";

export class TourInfo {

    id: string = '';
    code: string = '';
    countryCode: string = '';
    departureCode: string = '';
    arrivalCode: string = '';
    name: string = '';
    alias: string = '';
    descirption: string = '';
    term: string = '';
    policy: string = '';

    services: TourService[] = new Array<TourService>();
    benefits: TourBenefit[] = new Array<TourBenefit>();
    topics: TourTopic[] = new Array<TourTopic>();

    landmarks: any = null;
    contact: any = null;
    score: any = null;
    remark: any = null;
    sumary: any = null;

    supplier: TourSupplier = new TourSupplier();
    photo: Image = new Image();
    photos: Image[] = new Array<Image>();

    rating: number = 0;
    commissionRate: number = 0;
    days: number = 0;
    nights: number = 0;

    enable: boolean = false
    isInternational: boolean = false;

    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });

    }
}