import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from "ngx-bootstrap";

import { LayoutsModule } from '../../layouts/layouts.module';
import { routing } from './booker.routing';
import { BookerComponent } from './booker.component';
import { ComponentsModule } from '../../components/components.module';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { BookerCustomerModule } from './customer/booker-customer.module';
import { BookerTicketModule } from './ticket/booker-ticket.module';


const PAGE = [
	BookerCustomerModule,
	BookerTicketModule
]
@NgModule({
	imports: [
		CommonModule,
		routing,
		LayoutsModule,
		PaginationModule.forRoot(),
		ComponentsModule,
		FormsModule,
		...PAGE

	],
	declarations: [
		BookerComponent,
	],
})

export class BookerModule {

}
