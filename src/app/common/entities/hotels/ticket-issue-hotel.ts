import { TicketIssue } from "../flights/tickets-issue";

export class TicketIssueHotel extends TicketIssue {
    hotelName: string = '';
    roomName: string = '';

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