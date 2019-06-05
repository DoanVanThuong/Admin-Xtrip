import { Image } from "../image";

export class Tour {
    id: string = '';
    photo: Image = new Image();
    code: string = '';
    name: string = '';
    days: number = 0;
    nights: number = 0;
    weight: number = 0;
    departureName: string = '';
    arrivalName: string = '';
    status: string = '';
    
    enabled: boolean = false;
    isInternational: boolean = false;

    supplierName: string = '';
    departDates: any[] = [];
    pricesCode: any[] = [];
    showItemDepart:number = 4;
    showItemPriceCode: number = 4;

    departDate: string ='';
    available: number = 1;
    tourHot: boolean = false;
    tourPopular: boolean = true;
    adultPrice: number = 0;
    childPrice: number = 0;
    infantPrice: number = 0;
    highlights:any[] = [];
    no: number = 0;
    departName: string = '';
    categories: any[] = [];
    // OSE
    isSystemCode: boolean = true;
    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });

        if (!data.photo) {
            self.photo = new Image();
        }
    }
}