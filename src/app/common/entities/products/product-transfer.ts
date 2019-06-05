import { Transfer } from "../transfer";

export class TransferProduct extends Transfer {
    code: string = '';
    expiryDate: string = '';
    totalPrice: number = 0;

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