import { TicketIssued } from "../flights/ticket-issued";

export class TicketIssuedTour extends TicketIssued {
    agency: string = '';
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