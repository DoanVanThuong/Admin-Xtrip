import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BookerCustomerComponent } from "./booker-customer.component";
import { ComponentsModule } from "../../../components/components.module";
import { CommonModule as AppCommonModule } from "../../../common/common.module";

import { PaginationModule } from "ngx-bootstrap/pagination";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ShareModule } from "../../shared/share.module";

export const routes = [
	{ path: "", component: BookerCustomerComponent, pathMatch: "full" }
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
		PaginationModule,
		ShareModule
	],
	bootstrap: [BookerCustomerComponent],
	declarations: [BookerCustomerComponent, ...COMPONENT]
})
export class BookerCustomerModule {

	static routes = routes;
}
