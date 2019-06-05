import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BillListComponent } from "./billList/bill-list.component";
import { routes } from "./bill.routing";


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(routes)
	],
	bootstrap: [BillListComponent],
	declarations: [BillListComponent]
})
export class BillModule {
}
