import { Booking } from "../booking";
export class HotelBooking extends Booking {
	hotelName: string = '';
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