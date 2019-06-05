import * as _ from "lodash";
import { Booking } from "../booking";

export class ProductBooking extends Booking {
    contactName: string = '';
    productName: string = '';
    actualStatus: boolean = false;
    isIssued: boolean = false;

    constructor(data?: any) {
        super();
        if (!_.isEmpty(data)) {
            let self = this;
            _.each(data, function (val, key) {
                if (self.hasOwnProperty(key)) {
                    self[key] = val;
                }
            });
        }
    }
}