import { Booking } from "../booking";
import { UtilityHelper } from "../../helpers/utility.helper";


export class TourBooking extends Booking {
	tourName: string = '';
	operator: string = '';
	supplier: string = '';
	constructor(data?: any) {
		super();
		const utility = new UtilityHelper();
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