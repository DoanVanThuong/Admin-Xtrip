export class Passenger {
    title: string = '';
    type: string = '';
    PassengerType: string = 'ADT';
    fullName: string = '';
    dateOfBirth: string = '';
    firstName: string = '';
    lastName: string = '';
    passportNumber: string = '';
    passportExpiry: string = '';
    passportCountry: string = '';
    national: string = '';
    baggages: any[] = []
    no: number = 0;
    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }

    setNo(no: number) {
        this.no = no;
    }

    setType(type: string) {
        this.PassengerType = type;
        this.type = type;
    }
}