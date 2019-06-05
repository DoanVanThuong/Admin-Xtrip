export const CAPP = {
	ASSETS_PLACEHOLDER: 'assets/images/default-profile-square.png',
	DATE_FORMAT: 'DD/MM/YYYY HH:mm',
	DATE_FORMAT_NO_TIME: 'DD/MM/YYYY',
	DATE_SHORT_FORMAT: 'DD/MM/YYYY',
	TIME_FORMAT: 'HH:mm',
	LATITUDE: -25.363,
	LONGITUDE: 131.044,
	FEE: 0,
	IMAGE_MAX_SIZE: 1080,
	IMAGE_LIMIT: 5,
	IMAGE_CHAT_LIMIT: 4,
};


export const CLANG = 'YOUVIT:lang';
export const CLANGES = [
	{ language: 'English', code: 'en', locale: 'en', flag: 'assets/images/en.png', country: 'England' },
	{ language: 'Indonesian', code: 'ind', locale: 'in', flag: 'assets/images/in.png', country: 'Indonesia' },
];

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const CSECURITY = {
	tokenName: 'Authorization',
};

export const REMEMBER = {
	EMAIL: 'EMAIL',
	PASSWORD: 'PASSWORD'
}

export const CINPUT = {
	USERNAME_MIN_LENGTH: 4,
	TOURNAME_MIN_LENGTH: 3,
	USERNAME_MAX_LENGTH: 20,
	PASSWORD_MIN_LENGTH: 6,
	PHONE_NUMBER_MIN_LENGTH: 7,
	PHONE_NUMBER_MAX_LENGTH: 15,
	DESCRIPTION_LENGTH: 500,
	MAX_LENGTH: 255,
	CONFIRM_CODE_LENGTH: 4,
};

export const CPATTERN = {
	EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	NUMBER: /^\d+$/,
	PHONE_NUMBER: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
	SSN: /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/,
	DATE: /[0-9]{2}/,
	MONTH: /[0-9]{2}/,
	YEAR: /[0-9]{4}/,
	AGE: /^[1-9]+[0-9]*$/,
	PRICE: /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/,
};



export const CBONUS = [
	{ 'value': 0, 'name': '0%' },
	{ 'value': 0.05, 'name': '5%' },
	{ 'value': 0.1, 'name': '10%' },
	{ 'value': 0.15, 'name': '15%' },
	{ 'value': 0.2, 'name': '20%' },
];



export const CERROR_CODES = {
	FACEBOOK_NOT_EXIST: { errorCode: 2100, errorMessage: '' },
	CONFIRM_CODE: { errorCode: 2100, errorMessage: 'Invalid verify code. Please try again!' },
	AUTH_FAILED: { errorCode: 9011, errorMessage: 'Please make sure your request has an Authorization footer!' },
};

export const CMONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jun', 'Aug', 'Sep', 'Otc', 'Nov', 'Dec'];
export const CMONTHS_SHORT = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

export const CWEEKS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
export const CWEEKS_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export enum TYPE_TRANSFER {
	FLIGHT = "FLIGHT",
	HOTEL = "HOTEL",
	TOUR = "TOUR",
	PRODUCT = 'PRODUCT'
}
export const ALL_PAYMENT_CODE = {
	TRANSFER: 'Transfer', //chuyển khoản
	CYBERSOURCE: 'CyberSource', //Visa - Master Card
	NAPAS: 'Napas', //ATM nội địa
	XPAY: 'XPay', //Tại văn phòng, đại lí
	PAYOO: 'Payoo', //qua Payoo
	NULL: ''
}

export const ALL_TRANSPORT = {
	FLIGHT: 'Flight',
	CAR: 'Car',
	YACHT: 'Yacht',
	TRAIN: 'Train',
	SELF: 'Self'
}

export const ALL_SUGGEST_TOUR = {
	SUPPLIER: 'Supplier',
	DESTINATION: 'CyberSource',
	DEPART: 'Depart',
	BENEFIT: 'Benefit',
	SERVICE: 'Service',
	TOPIC: 'Topic',
	TRANSPORT: 'Transport',
	HOTEL: 'Hotel',
	AIRLINE: 'Airline',
	NULL: '',
}

export const TOUR_GENERAL = {
	DATA: 'TourGeneral'
};

export const ALL_TAB_CREATE_TOUR = {
	GENERAL: 'general',
	STARTING_DATE: 'starting-date',
	IMAGE: 'image',
	POLICY: 'policy',
	JOURNEY: 'journey',
	HASHTAG: 'hashtag'
}
export type ACTION_TOUR_TYPE = 'create' | 'update' | 'clone' | 'book' | 'update-passenger';
export const ACTION_TOUR = {
	CREATE: <ACTION_TOUR_TYPE>'create',
	UPDATE: <ACTION_TOUR_TYPE>'update',
	CLONE: <ACTION_TOUR_TYPE>'clone',
	BOOOK: <ACTION_TOUR_TYPE>'book',
	UPDATE_PASSENGER: <ACTION_TOUR_TYPE>'update-passenger'

}

export const ALL_INPUT_TRANSPORT_TEXT = {
	FLIGHT: {
		PLACEHOLDER_FLIGHT_TITLE: "Tên hãng hàng không",
		PLACEHOLDER_FLIGHT_NAME: "Nhập Tên hãng hàng không",
		PLACEHOLDER_FLIGHT_NUMBER: "nhập số hiệu "
	},
	CAR: {
		PLACEHOLDER_CAR_TITLE: "Tên nhà xe",
		PLACEHOLDER_CAR_NAME: "Nhập Tên hãng xe",
		PLACEHOLDER_CAR_NUMBER: "nhập biển số xe"
	},
	TRAIN: {
		PLACEHOLDER_TRAIN_TITLE: "Tên hãng tàu",
		PLACEHOLDER_TRAIN_NAME: "Nhập Tên hãng tàu",
		PLACEHOLDER_TRAIN_NUMBER: "nhập số hiệu tàu"
	},
	YACHT: {
		PLACEHOLDER_YACHT_TITLE: "Tên hãng du thuyền",
		PLACEHOLDER_YACHT_NAME: "Nhập Tên hãng du thuyền ",
		PLACEHOLDER_YACHT_NUMBER: "nhập số hiệu thuyền "
	}
}

export const CSTORAGE = {
	TAB_NAME: 'xtravel:tour.tabName',
	TOUR_GENERAL: 'xtravel:tour.general',
	TOUR_TRANSPORT: 'xtravel:tour.transport',
	ROLE_ACCOUNT: 'xtravel:internal.role',
	TOUR_AIRLINES: 'xtravel:tour.airlines',
	BOOKING_TOUR: 'xtrvel:tour.booking',
	COUNTRY: 'xtravel.global.country',
	CLONETOUR: 'xtravel.clone.tour'
}

export const ROLE = {
	ADMIN: 'Admin',
	BOOKER: 'Booker',
	DENTRY: 'DataEntry',
	CS: 'CS',
	CASHIER: 'Cashier'
}

export const FILE_TYPE = {
	EXCEL: 'application/vnd.ms-excel'
}

export const BOOKING_STATUS: any = {
	WAITING: 1, // đang xuất vé
	UNPAID: 2, // chưa thanh toán
	CANCELED: 3, // hủy
	DEPOSITED: 4,
	SUCCESS: 5, // thanh toán thành công / xuất vé thành công
	PENDING: 7 // chờ xác thực
};

export type MEAL_TYPE = 'Bữa sáng' | 'Bữa trưa' | 'Bữa tối' | 'Bữa ăn nhẹ' | 'Điểm nghỉ ngơi';
export const OPTION_MEAL = {
	BREAKFAST: <MEAL_TYPE>'Bữa sáng',
	LUNCH: <MEAL_TYPE>'Bữa trưa',
	DINNER: <MEAL_TYPE>'Bữa tối',
	SNACK: <MEAL_TYPE>'Bữa ăn nhẹ',
	RELAX: <MEAL_TYPE>'Điểm nghỉ ngơi',
}

export const OPTION_JOURNEY: any = {
	MEAL_IN_TRIP: 'Dùng bữa theo chương trình.',
	MEAL_IN_HOTEL_RESORT: 'Dùng bữa tại khách sạn/resort.',
	MEAL_BUFFET: 'Dùng Buffet.',
	MEAL_IN_PLANE: 'Dùng bữa trên máy bay.',
	MEAL_YOURSELF: 'Quý khách tự túc.',
	HOTEL_3_4_STAR: 'Khách sạn 3*-4*.',
	HOTEL_2_3_STAR: 'Khách sạn 2*-3*.',
	HOTEL_2_STAR: 'Khách sạn 2*.',
	HOTEL_3_STAR: 'Khách sạn 3*.',
	HOTEL_4_STAR: 'Khách sạn 4*.',
	HOTEL_5_STAR: 'Khách sạn 5*.',
	HOTEL_4_5_STAR: 'Khách sạn 4*-5*.',
	RESORT_2: 'Resort 2*.',
	RESORT_3: 'Resort 3*.',
	RESORT_2_3: 'Resort 2*-3*.',
	RESORT_3_4: 'Resort 3*-4*',
	RESORT_4: 'Resort 4*.',
	RESORT_4_5: 'Resort 4*-5*',
	RESORT_5: 'Resort 5*.',

}