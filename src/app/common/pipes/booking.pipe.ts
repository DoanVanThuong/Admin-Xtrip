import { Pipe, PipeTransform } from '@angular/core';
import { BookingDetail } from '../entities/booking-detail';
@Pipe({
	name: 'SearchBooking',
	pure: false
})
export class SearchBooking implements PipeTransform {

	transform(value: BookingDetail[], args?): Array<any> {
		let searchText = new RegExp(args, 'ig');
		if (value) {
			return value.filter(booking => {
				if (booking) {
					return booking.customerName.search(searchText) !== -1 ||
						booking.code.search(searchText) !== -1;
				}
				else {
					return booking.bookingDate.search(searchText) !== -1;
				}
			});
		}
	}
}
