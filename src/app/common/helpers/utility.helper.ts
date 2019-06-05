import { CAPP } from "../../app.constants";
declare var moment: any;

export class UtilityHelper {

	/***
	 * Get Dates
	 *
	 * @param date
	 * @returns [y, m, d]
	 */
	getDates(date: string): Array<any> {
		let d = new Date(date);

		if (d.toString() == "Invalid Date") {
			return [null, null, null];
		} else {
			return [d.getFullYear().toString(), (d.getMonth() + 1).toString(), d.getDate().toString()];
		}
	}

	/***
	 * Get Date String
	 * @param date
	 * @param format
	 *
	 * @returns string
	 */
	getDateStringWithourTime(date: any, format?: string): string {
		if (!format) {
			format = CAPP.DATE_FORMAT_NO_TIME;
		}

		return moment(new Date(date)).format(format);
	}

	/***
	 * Get Date String
	 * @param num
	 *
	 * @returns string 
	 */


	// fn hour format
	hourFormat = (time: number = 0, showDay: boolean = false) => {
		if(showDay) {
			var day = Math.floor(time / (60 * 60 * 24));
			time = Math.floor(time % (60 * 60 * 24));
		}

		let hour = Math.floor(time / (60 * 60));
		let minute = Math.floor((time % (60 * 60)) / 60);
		let second = Math.floor((time % (60 * 60)) % 60);

		if(!showDay) {
			return this.pad(hour) + ':' + this.pad(minute) + ':' + this.pad(second);
		}
		else if (day > 0) {
			return `${day} ngày ` + this.pad(hour) + ':' + this.pad(minute) + ':' + this.pad(second);
		} else 
			return this.pad(hour) + ':' + this.pad(minute) + ':' + this.pad(second);
	};


	pad = (num: number = 0) => {
		return ('0' + num).slice(-2);
	};
	/***
	 * Get Date String
	 * @param second
	 *
	 * @returns string with format hh:mm:ss
	 */

	hhmmss(secs) {
		let minutes = Math.floor(secs / 60);
		secs = secs % 60;
		let hours = Math.floor(minutes / 60)
		minutes = minutes % 60;
		return this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(secs);
	}

	// fn convert time 
	convertTime(time: number = 0) {
		let hour = Math.floor(time / 60);
		let min = time % 60;

		return hour > 0 ? `${hour}h${min}p` : `${min}p`;
	}

	/***
	 * Get Date String
	 * @param date
	 * @param format
	 *
	 * @returns string
	 */
	getDateString(date: any, format?: string): string {
		if (!date) {
			return "";
		}
		if (!format) {
			format = CAPP.DATE_FORMAT;
		}

		return moment(new Date(date)).format(format);
	}

	/**
	 * Get Start Date Of Last Month
	 *
	 * @param {number} lastMonth
	 * @param {string} format
	 * @returns {string}
	 */
	getStartDateOfLastMonth(lastMonth?: number, format?: string): string {
		if (!lastMonth) {
			lastMonth = 1;
		}
		if (!format) {
			format = CAPP.DATE_FORMAT;
		}

		return moment(new Date()).subtract(lastMonth, 'months').startOf('month').format(format);
	}

	/**
	 * Get End Date Of Last Month
	 *
	 * @param {number} lastMonth
	 * @param {string} format
	 * @returns {string}
	 */
	getEndDateOfLastMonth(lastMonth?: number, format?: string): string {
		if (!lastMonth) {
			lastMonth = 1;
		}
		if (!format) {
			format = CAPP.DATE_FORMAT;
		}

		return moment(new Date()).subtract(lastMonth, 'months').endOf('month').format(format);
	}

	/**
	 * Get first Date Of Month
	 *
	 * @param {number} month
	 * @param {string} format
	 * @returns {string}
	 */
	getFirstDateOfMonth(month?: number, format?: string) {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}
		if (!month) {
			return moment().startOf('month').format(format);
		}
		else {
			return moment().month(month - 1).startOf('month').format(format);
		}
	}

	/**
	 * Get last Date Of Month
	 *
	 * @param {number} month
	 * @param {string} format
	 * @returns {string}
	 */
	getLastDateOfMonth(month?: number, format?: string) {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}
		if (!month) {
			return moment().endOf('month').format(format);
		}
		else {
			return moment().month(month - 1).endOf('month').format(format);
		}
	}
	/**
	 * Get Start Date Of Last Month
	 *
	 * @param {number} lastMonth
	 * @param {string} format
	 * @returns {string}
	 */
	getStartEndDateOfMonth(month: number, year?: number, format?: string): any {
		if (!format) {
			format = CAPP.DATE_FORMAT;
		}
		if (!year) {
			year = new Date().getFullYear();
		}

		let m = moment(new Date(year.toString() + '-' + month.toString() + '-01'));

		return {
			startDate: m.startOf('month').format(format),
			endDate: m.endOf('month').format(format),
		};
	}

	getWeek(date: string, format?: string): number {
		moment.updateLocale('en', {
			week: {
				dow: 1,
				doy: 4
			},
		})
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}

		return moment(date, format).week();
	}

	getMonth(date: string, format?: string): number {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}

		return moment(date, format).month() + 1;
	}

	getDate(date: string, format?: string): number {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}

		return moment(date, format).date();
	}

	getYear(date: string, format?: string): number {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}
		return moment(date, format).year();
	}

	/**
	 * Get Dates in range date
	 *
	 * @param {start} date
	 * @param {end} format
	 * @param {format} format
	 * @returns {Array} 
	 */
	getDateInRange(start: string, end: string, format?: string) {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}
		let dates: any = [];
		const startDate = moment(start, format);
		const endDate = moment(end, format);
		const range: number = endDate.diff(startDate, 'd');
		let i = 0;
		while (i <= range) {
			const date = moment(startDate).add(i, 'd').format(format);
			dates.push(date);
			i++;
		}
		return dates;
	}

	/**
	 * check date in past or not
	 *
	 * @param {string} date
	 * @param {format} format
	 * @returns {boolean} past or now
	 */
	checkDateInPast(date: string, format?: string): boolean {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}
		let now = moment();
		let currentDate = moment(date, 'DD/MM/YYYY');
		let diff = currentDate.diff(now, 'd');

		if (diff < 0) {
			//day in past
			return true;
		}
		return false;
	}



	/**
	 * check date is today or not
	 *
	 * @param {string} date
	 * @param {format} format
	 * @returns {boolean} past or now
	 */
	checkToday(date: string, format?: string): boolean {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}
		return moment().format(format) === moment(date, format).format(format) ? true : false;
	}

	/**
	 * check month is today or not
	 *
	 * @param {string} year
	 * @param {format} format
	 * @returns {boolean} past or now
	 * 
	 */
	checkMonthInPast(date: string, format?: string): boolean {
		if (!format) {
			format = CAPP.DATE_SHORT_FORMAT;
		}
		const currentMonth: number = this.getMonth(moment().format(format));
		const month: number = this.getMonth(date);

		const year: number = this.getYear(moment().format(format));
		const currentYear: number = this.getYear(date);

		if (currentYear === year) {
			if (currentMonth > month) {
				return true;
			}
			return false;
		}
		if (currentYear < year) {
			return false;
		}

	}

	/**
	 * check month is today or not
	 *
	 * @param {string} year
	 * @param {string} month
	 * @returns {Array} dates
	 * 
	 */
	getDaysInMonth(month, year) {
		var date = moment([year, month - 1, 1]);
		var days = [];
		while (date.month() === month - 1) {
			days.push(moment(date));
			date.add(1, 'day');
		}
		return days;
	}
}


