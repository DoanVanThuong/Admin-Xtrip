import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ComponentsModule } from "../../../components/components.module";

import { CSCustomerComponent } from "./customer.component";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { CommonModule as AppCommonModule } from "../../../common/common.module";

import { TabsModule } from "ngx-bootstrap/tabs";
import { ShareModule } from "../../shared/share.module";

export const routes = [
    { path: "", component: CSCustomerComponent, pathMatch: "full" }
];

const COMPONENT = [
]
@NgModule({

    imports: [
        CommonModule,
        AppCommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ComponentsModule,
        PaginationModule,
        TabsModule,
        ShareModule

    ],
    bootstrap: [CSCustomerComponent],
    declarations: [CSCustomerComponent, ...COMPONENT]
})
export class CSCustomerModule {
    static routes = routes;
}
