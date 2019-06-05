import { TicketIssued } from "../flights/ticket-issued";

export class TicketIssuedHotel extends TicketIssued {
    employeeExport: string = '';
    exportDate: string = '';
    pnrCode: string = '';

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