import { Transport } from "../transport";

export class DepartInfo {
    transportType: string = '';
    transportSupplier: Transport = new Transport();
    transportClass: string = '';
    transportNumber: string = '';
    departTime: string;
    arrivalTime: string;
    constructor(data?: any) {
        let self = this;

        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }


}