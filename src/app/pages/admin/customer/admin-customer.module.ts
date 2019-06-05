import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CustomerComponent } from "./admin-customer.component";

import { ComponentsModule } from "../../../components/components.module";
import { CommonModule as AppCommonModule } from "../../../common/common.module";

import { PaginationModule } from "ngx-bootstrap/pagination";
import { TabsModule } from "ngx-bootstrap/tabs";
import { CommonModule } from "@angular/common";
import { ShareModule } from "../../shared/share.module";

// routing
export const routes = [
	{ path: "", component: CustomerComponent, pathMatch: "full" }
];

const CUSTOMER = [
]

@NgModule({
	imports: [
		ComponentsModule,
		CommonModule,
		AppCommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		PaginationModule,
		TabsModule.forRoot(),
		ShareModule
	],
	bootstrap: [CustomerComponent],

	declarations: [CustomerComponent, ...CUSTOMER]
})
export class AdminCustomer {
	static routes = routes;
}
