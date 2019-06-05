// The file contents for the current environment will overwrite these during build.
// The build system defaults to the staging environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: true,
	live: false,
	API_URL: "//devapi.xtrip.vn", //dev.api.xtravel.vn
	HOST_IMG: "http://devmedia.xtrip.vn", //http://dev.media.xtravel.vn
	API_PAY_URL: '//devpay.xtrip.vn', //dev.pay.xtravel.vn

	FILE_SYSTEM: {
		URL: '',
		ATTRIBUTE_NAME: '',
	},
	OAUTH: {
		CLIENT_ID: '',
		CLIENT_SECRET: '',
	},
	FACEBOOK: {
		APP_ID: '',
		APP_VERSION: '',
	},
	GOOGLE: {
		API_KEY: '',
	},
	STRIPE: {
		API_KEY: '',
	}
};

