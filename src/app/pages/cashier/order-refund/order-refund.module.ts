import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule as AppCommonModule } from "../../../common/common.module";
import { ComponentsModule } from '../../../components/components.module';
import { OrderRefundComponent } from './order-refund.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CreateOrderRefundComponent } from './create-refund/create-refund.component';
import { ShareCashierModule } from '../share-cashier.module';

const routes: Routes = [
    { path: '', component: OrderRefundComponent, pathMatch: 'full' },
    { path: 'create', component: CreateOrderRefundComponent },
    { path: 'detail/:id', component: CreateOrderRefundComponent },


];

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        RouterModule.forChild(routes),
        PaginationModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        CurrencyMaskModule,
        ShareCashierModule
    ],
    declarations: [
        OrderRefundComponent,
        CreateOrderRefundComponent
    ],
    bootstrap: [OrderRefundComponent]
})
export class OrderRefundModule {
    static routes = routes;
}