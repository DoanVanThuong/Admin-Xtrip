import { TicketIssue } from "./tickets-issue";

export class TicketIssueFlight extends TicketIssue {
    pnrCode: string = '';
    journey: string = "";
    flightNumber: string = "";

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