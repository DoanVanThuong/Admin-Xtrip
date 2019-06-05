import { TicketIssued } from "../flights/ticket-issued";

export class TicketIssuedProduct extends TicketIssued {
    employeeIssue: string = '';
    issuedDate: string = '';
    bookingCode: string = '';

    constructor(data?: any) {
        super();
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }
}