import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ComponentsModule } from "../../../components/components.module";
import { TicketComponent } from "./admin-ticket.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TicketIssuedFlightComponent } from "./ticket-flight/ticket-issued-flight.component";
import { TicketIssuedProductComponent } from "./ticket-product/ticket-issued-product.component";
import { TicketIssuedTourComponent } from "./ticket-tour/ticket-issued-tour.component";
import { TicketIssuedHotelComponent } from "./ticket-hotel/ticket-issued-hotel.component";


export const routes = [{ path: "", component: TicketComponent, pathMatch: "full" }];

const COMPONENT = [
	TicketIssuedFlightComponent,
	TicketIssuedProductComponent,
	TicketIssuedTourComponent,
	TicketIssuedHotelComponent
]
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(routes),
		PaginationModule,
		ComponentsModule,
		TabsModule

	],
	bootstrap: [TicketComponent],
	declarations: [TicketComponent, ...COMPONENT]
})
export class TicketModule {
	static routes = routes;
}
