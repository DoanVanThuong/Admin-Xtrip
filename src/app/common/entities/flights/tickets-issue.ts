export class TicketIssue {
    id: string = "";
    code: string = "";
    bookingCode: string = '';
    bookingDate: string = "";
    holdExpiry: string = " ";
    customerName: string = "";
    agency: string = "";

    totalPrice: number = 0;
    no: number = 0;

    isIssued: boolean = false;
    actualStatus: boolean = false;

}