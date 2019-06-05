import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ComponentsModule } from "../../../components/components.module";
import { CommonModule as AppCommonModule } from "../../../common/common.module";

import { PaginationModule } from "ngx-bootstrap/pagination";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ShareModule } from "../../shared/share.module";
import { CashierCustomerComponent } from "./cashier-customer.component";

export const routes = [
	{ path: "", component: CashierCustomerComponent, pathMatch: "full" }
];

const COMPONENT = [
]
@NgModule({

	imports: [
		CommonModule,
		AppCommonModule,
		RouterModule.forChild(routes),
		TabsModule,
		FormsModule,
		ComponentsModule,
		PaginationModule.forRoot(),
		ShareModule
	],
	bootstrap: [CashierCustomerComponent],
	declarations: [CashierCustomerComponent]
})
export class CashierCustomerModule {

	static routes = routes;
}
