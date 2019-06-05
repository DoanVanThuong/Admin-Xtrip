import { Booking } from "../booking";

export class FlightBooking extends Booking {
	journey: string = '';
	agency: string = '';
	isIssued: boolean = false;
	actualStatus: boolean = false;

	constructor(data?: any) {
		super();

		if (!_.isEmpty(data)) {
			let self = this;
			_.each(data, function (val, key) {
				if (self.hasOwnProperty(key)) {
					self[key] = val;
				}
			});


		}
	}
}