import { TicketIssue } from "../flights/tickets-issue";

export class TicketIssueProduct extends TicketIssue {
    productname: string = '';

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