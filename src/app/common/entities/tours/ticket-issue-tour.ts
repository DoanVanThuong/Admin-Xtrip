import { TicketIssue } from "../flights/tickets-issue";

export class TicketIssueTour extends TicketIssue {
    tourDepart: string = '';
    tourArrival: string = '';
    tourName: string = '';
    agency: string = '';
    tourCode: string = '';
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