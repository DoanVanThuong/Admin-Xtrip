import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from "ngx-bootstrap/pagination";
import { FormsModule } from '@angular/forms';

import { routing } from './admin.routing';

import { AdminComponent } from './admin.component';
import { LayoutsModule } from '../../layouts/layouts.module';
import { BillListComponent } from './bill/billList/bill-list.component';

import { InternalModule } from './internal/internal.module';
import { TransferModule } from './transfer/transfer.module';
import { AdminCustomer } from './customer/admin-customer.module';
import { TicketModule } from './ticket/admin-ticket.module';
import { CouponModule } from './coupon/coupon.module';


const COMPONENT = [
	AdminComponent,
	BillListComponent,
]

const PAGE = [
	InternalModule,
	TransferModule,
	AdminCustomer,
	TicketModule,
	CouponModule,

]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
		LayoutsModule,
		PaginationModule.forRoot(),
		...PAGE
	],
	declarations: [
		...COMPONENT,
	],
})

export class AdminModule {

}
