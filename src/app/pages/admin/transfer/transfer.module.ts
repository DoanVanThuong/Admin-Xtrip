import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TransferComponent } from "./transfer.component";
import { TransferFlightComponent } from "./transfer-flight/transfer-flight.component";
import { TransferHotelComponent } from "./transfer-hotel/transfer-hotel.component";
import { TransferTourComponent } from "./transfer-tour/transfer-tour.component";
import { PaginationModule, TabsModule } from "ngx-bootstrap";
import { ComponentsModule } from "../../../components/components.module";
import { TransferProductComponent } from "./transfer-product/transfer-product.component";
import { CommonModule as AppCommonModule } from "../../../common/common.module";

export const routes = [
	{ path: "", component: TransferComponent, pathMatch: "full" }
];

const TRANSFER = [
	TransferFlightComponent,
	TransferHotelComponent,
	TransferTourComponent,
	TransferProductComponent
];
@NgModule({
	imports: [
		ComponentsModule,
		CommonModule,
		AppCommonModule,
		RouterModule.forChild(routes),
		TabsModule.forRoot(),
		FormsModule,
		PaginationModule
	],
	bootstrap: [TransferComponent],

	declarations: [TransferComponent, ...TRANSFER]
})
export class TransferModule {
	static routes = routes;
}
