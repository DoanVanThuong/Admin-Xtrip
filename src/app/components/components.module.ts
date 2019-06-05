import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { CommonModule as AppCommonModule } from '../common/common.module';


import { SidebarDetailComponent } from './sidebar-detail/sidebar-detail.component';
import { MultipleMonthPickerComponent } from './multiple-monthpicker/multiple-monthpicker.component';
import { MultipleDatePickerComponent } from './multiple-datepicker/multiple-datepicker.component';
import { ImageUploadComponent } from './img-upload/img-upload.component';
import { SearchAutoCompleteComponent } from './autocomplete/search-autoComplete.component';
import { MinSidebarComponent } from './min-sidebar.component';

import { PreviewJourneyPopupComponent } from './popup/journey-preview/popup-preview-journey.component';
import { TourInfoPopupComponent } from './popup/tour-info/popup-tour-info.component';
import { CountdownComponent } from './coundown.component';
import { ProfilePopupComponent } from './popup/profile/popup-profile.component';
import { ChangePasswordPopupComponent } from './popup/change-password/popup-change-password.component';
import { ExportFilePopupComponent } from './popup/export-file/popup-export-file.component';
import { SelectLimitComponent } from './select-limit/select-limit.component';
import { SideBarTicketDetailFlightComponent } from './sidebar-detail/ticket-detail/flight/ticket-detail-flight.component';
import { SideBarTicketDetailHotelComponent } from './sidebar-detail/ticket-detail/hotel/ticket-detail-hotel.component';
import { CounterComponent } from './counter/counter.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DepartDateTourPopupComponent } from './popup/depart-date-tour/depart-date-tour.popup';
import { PreviewReceiptPopupComponent } from './popup/preview-receipt/preview-receipt.popup';

const APP_COMPONENTS = [
	MinSidebarComponent,

];

const THIRD_COMPONENTS = [
	CountdownComponent,
	SidebarDetailComponent,
	SideBarTicketDetailFlightComponent,
	MultipleMonthPickerComponent,
	MultipleDatePickerComponent,
	ImageUploadComponent,
	SearchAutoCompleteComponent,
	SelectLimitComponent,
	SideBarTicketDetailHotelComponent,
	CounterComponent,
	CalendarComponent
];

const POPUP = [
	TourInfoPopupComponent,
	PreviewJourneyPopupComponent,
	ProfilePopupComponent,
	ChangePasswordPopupComponent,
	ExportFilePopupComponent,
	DepartDateTourPopupComponent,
	PreviewReceiptPopupComponent
]

const Libary = [
	ModalModule.forRoot(),
	TabsModule.forRoot(),
	BsDatepickerModule.forRoot()
]

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		AppCommonModule,
		...Libary
	],
	declarations: [
		...APP_COMPONENTS,
		...THIRD_COMPONENTS,
		...POPUP
	],
	providers: [],
	exports: [
		...APP_COMPONENTS,
		...THIRD_COMPONENTS,
		...POPUP

	]
})

export class ComponentsModule {
	static forRoot(): ModuleWithProviders {
		return <ModuleWithProviders>{
			ngModule: ComponentsModule,
			providers: [],
		};
	}
}
