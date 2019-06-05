import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestangularModule } from 'ngx-restangular';
// Routing
import { routing } from './app.routing';

// App is our top level component
import { PagesModule } from './pages/pages.module';
import { BlanksModule } from './pages/blanks/blanks.module';
import { LayoutsModule } from './layouts/layouts.module';

import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { Spinner } from "./common/services/spinner.service";
import { StorageService } from "./common/services/storage.service";
import { RestangularConfigFactory } from "./restangular.config";
import { AuthAdmin } from './auth-admin';
import { AuthBooker } from './auth-booker';
import { AuthDentry } from './auth-dentry';
import { AuthCS } from './auth-cs';
import { AuthCashier } from './auth-cashier';
import { AuthInterceptor } from './auth.interceptor';

// Application wide providers
const APP_PROVIDERS = [
	AppState,
	GlobalState,
];

export type StoreType = {
	state: InternalStateType,
	restoreInputValues: () => void,
	disposeOldHosts: () => void
};

@NgModule({
	bootstrap: [
		App,
	],
	imports: [
		routing,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		RestangularModule.forRoot([StorageService, Spinner,], RestangularConfigFactory),
		PagesModule,
		BlanksModule,
		LayoutsModule,
	],
	declarations: [
		App,
	],
	providers: [ // expose our Services and Providers intro Angular's dependency injection
		APP_PROVIDERS,
		AuthAdmin,
		AuthBooker,
		AuthDentry,
		AuthCS,
		AuthCashier,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		}

	],
})

export class AppModule {

	constructor(public appState: AppState) {

	}
}
