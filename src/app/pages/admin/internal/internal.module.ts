import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routing } from "./internal.routing";
import { InternalAccountListComponent } from "./acount-list/account-list.component";
import { AddAccountComponent } from "./add-account/add-acount.component";
import { PaginationModule } from "../../../../../node_modules/ngx-bootstrap";
import { EditAccountComponent } from "./edit-account/edit-account.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routing),
        PaginationModule
    ],
    bootstrap: [InternalAccountListComponent],

    declarations: [InternalAccountListComponent, AddAccountComponent, EditAccountComponent]
})
export class InternalModule {
    static routes = routing;

}
