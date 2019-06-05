export class Ticket {
    segmentId: string = '';
    journey: string = '';
    departCode: string = '';
    departName: string = '';
    arrivalCode: string = '';
    arrivalName: string = '';
    airline: string = '';
    times: string = '';
    pnrCode: string = '';
    holdExpiry: string = '';

    transits: any[] = [];
    actualStatus: boolean = false;

    constructor(data?: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }
}