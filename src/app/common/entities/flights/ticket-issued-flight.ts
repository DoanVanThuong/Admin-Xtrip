import { TicketIssued } from "./ticket-issued";

export class TicketIssuedFlight extends TicketIssued {
    pnrCode: string = '';
    employeeExport: string = '';
    exportDate: string = '';

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