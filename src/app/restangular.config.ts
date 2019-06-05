import { CSECURITY } from "./app.constants";
import { environment } from "../environments/environment";

// Function for setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider, storage, spinner) {

	RestangularProvider.setBaseUrl(environment.API_URL);
	RestangularProvider.setFullResponse(true);
	RestangularProvider.setDefaultHttpFields({ withCredentials: false, cache: false, timeout: 60000 });

	let queues: Array<string> = [];

	// fn request
	RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
		// if (typeof (params.showSpinner) === 'undefined' || params.showSpinner === true) {
		// 	spinner.push(url).show();
		// }

		// if (operation === 'get') {
		// 	RestangularProvider.setDefaultRequestParams({ ver: Math.random() });
		// } else {
		// 	RestangularProvider.setDefaultRequestParams({ ver: undefined });
		// }

		// Update Authorization footer
		let authHeader = {};
		let authToken = storage.getItem(CSECURITY.tokenName, false);

		if (authToken) {
			authHeader = { Authorization: `Bearer ${authToken}` };
		}
		else {
			return;

		}

		return {
			element: element,
			operation: operation,
			path: path,
			url: url,
			headers: Object.assign({}, headers, authHeader),
			params: Object.assign({}, params),
		};
	});

	// fn response
	RestangularProvider.addResponseInterceptor((data, operation, what, url, response) => {
		if (url !== environment.API_URL) {
			RestangularProvider.setBaseUrl(environment.API_URL);
		}
		let index = spinner.find(url);
		if (index > -1) {
			spinner.splice(index, 1);
		}

		setTimeout(() => {
			if (spinner.queues.length == 0) {
				spinner.hide();
			}
		}, 100);

		let responseArr = [];

		responseArr['data'] = data;

		return responseArr;
	});

	RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
		switch (response.status) {
			case 401: {
				storage.storage.removeItem(CSECURITY.tokenName);
				window.location.href = '/sign-in';
				break;
			}
		}

		return true;
	});
}
