import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ComponentsModule } from "../../../components/components.module";
import { BookerTicketComponent } from "./booker-ticket.component";

import { CommonModule as AppCommonModule } from "../../../common/common.module";
import { TabsModule } from "ngx-bootstrap/tabs";
import { FlightTicketComponent } from "./flight/flight-ticket.component";
import { ProductTicketComponent } from "./product/product-ticket.component";
import { TourTicketComponent } from "./tour/tour-ticket.component";
import { HotelTicketComponent } from "./hotel/hotel-ticket.component";

export const routes = [
	{ path: "", component: BookerTicketComponent, pathMatch: "full" }
];

const COMPONENT = [
	FlightTicketComponent,
	ProductTicketComponent,
	TourTicketComponent,
	HotelTicketComponent
]
@NgModule({
	imports: [
		CommonModule,
		AppCommonModule,
		RouterModule.forChild(routes),
		TabsModule,
		FormsModule,
		ComponentsModule,
		PaginationModule
	],
	bootstrap: [BookerTicketComponent],
	declarations: [BookerTicketComponent, ...COMPONENT]
})
export class BookerTicketModule {

	static routes = routes;
}
