import { Passenger } from "../passenger";
import { Ticket } from "./ticket";

export class TicketDetail {
    customerName: string = '';
    mobileNumber: string = '';
    email: string = '';

    passenger: Passenger[] = new Array<Passenger>();
    tickets: Ticket[] = new Array<Ticket>();

    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}