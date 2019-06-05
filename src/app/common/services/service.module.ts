import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CookieModule } from 'ngx-cookie';

import { ApiService } from './api.service';
import { DialogService } from './dialog.service';
import { RestoreService } from './restore.service';
import { StripeService } from './stripe.service'
import { Utils } from './utils';
import { WindowRef, DocumentRef } from './browser-globals'
import { Spinner } from './spinner.service'
import { Script } from './script.service'
import { StorageService } from './storage.service';
import { DomService } from './dom.service';
import { NotificationService } from './notification.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
	imports: [
		CookieModule.forRoot(),
	],
	providers: [
		DatePipe,
		ApiService,
		DialogService,
		RestoreService,
		StripeService,
		StorageService,
		DomService,
		Utils,
		WindowRef,
		DocumentRef,
		Spinner,
		Script,
		NotificationService,
		HttpClientModule
	],
})
export class ServiceModule {
}