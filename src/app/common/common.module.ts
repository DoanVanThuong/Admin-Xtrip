import { NgModule, ModuleWithProviders } from '@angular/core';

import { ServiceModule } from './services/service.module';
import { SecurityModule } from './security/security.module';
import { RepositoryModule } from './repositories/repository.module';
import {
	CapitalizePipe,
	PadPipe,
	MomentPipe,
	NewlinePipe,
	TextEllipsisPipe,
	SearchBooking,
	MonthYearPipe,
	DayMonthPipe,
	IssueNowPipe,
	EqualErrorPipe,
	ResizeImage,
	CurrencyToVNDPipe,
	GetFileNameFromUrl

} from './pipes/index'

import {
	EmailValidator,
	EqualPasswordsValidator,
	DateValidator,
	PhoneNumberValidator,
	PriceValidator,
} from './validators/index';

import {
	SuffixMaskDirective,
	ClickOutSideDirective
} from './directives/index';

const APP_VALIDATORS = [
	EmailValidator,
	EqualPasswordsValidator,
	DateValidator,
	PhoneNumberValidator,
	PriceValidator,
];

const APP_PIPES = [
	CapitalizePipe,
	PadPipe,
	MomentPipe,
	NewlinePipe,
	TextEllipsisPipe,
	SearchBooking,
	MonthYearPipe,
	DayMonthPipe,
	IssueNowPipe,
	EqualErrorPipe,
	ResizeImage,
	CurrencyToVNDPipe,
	GetFileNameFromUrl

];

const APP_DIRECTIVES = [
	SuffixMaskDirective,
	ClickOutSideDirective

];

@NgModule({
	declarations: [
		...APP_PIPES,
		...APP_DIRECTIVES,
	],
	imports: [
		ServiceModule,
		SecurityModule,
		RepositoryModule,


	],
	providers: [
		...APP_VALIDATORS
	],
	exports: [
		...APP_PIPES,
		...APP_DIRECTIVES,
	]
})

export class CommonModule {
	static forRoot(): ModuleWithProviders {
		return <ModuleWithProviders>{
			ngModule: CommonModule,
			providers: [],
		};
	}
}
