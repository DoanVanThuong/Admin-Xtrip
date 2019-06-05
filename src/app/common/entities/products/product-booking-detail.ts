import * as _ from "lodash";
import { Booking } from "../booking";
import { VAT } from "../vat";

export class ProductBookingDetail extends Booking {
    contactName: string = '';
    productName: string = '';
    contactMobileNumber: string = '';
    contactEmail: string = '';
    duration: string = '';
    notes: string = '';
    departDate: string = '';

    adults: number = 0;
    children: number = 0;
    infants: number = 0;
    seniors: number = 0;

    passenger: any[] = []
    actualStatus: boolean = false;
    vatInvoiceInfo: VAT = null;
    cancellationPolicies: string = '';
    comboType: string = '';
    timeslots?: any = {};
    message: string = '';
    paymentFee: number = 0;
    price: number = 0;
    addonUsage: any = {
        amount: 0,
        createdDate: '',
        name: '',
        type: '',
        value:''
    }
    constructor(data?: any) {
        super();
        if (!_.isEmpty(data)) {
            let self = this;
            _.each(data, function (val, key) {
                if (self.hasOwnProperty(key)) {
                    self[key] = val;
                }
            });
            if (!!data.vatInvoiceInfo) {
                this.vatInvoiceInfo = new VAT(data.vatInvoiceInfo);
            }
        }
    }
}