export class BookingDetail {

	customerName: string;
	mobileNumber: string;
	email: string;
	journey?: string;
	receiverName?: string;
	checkIn?: string;
	nights?: number;
	rooms?: number;
	code?: string;
	bookingDate?: string;
	roomType?: string;
	agency?: string;
	paymentMethodCode?: string;
	hotelName?: string;
	tourName?: string;


	constructor(data?: any) {
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