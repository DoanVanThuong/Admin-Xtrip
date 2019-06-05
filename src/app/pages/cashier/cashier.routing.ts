import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/compiler/src/core";
import { CashierComponent } from "./cashier.component";

const routes: Routes = [
    {
        path: '', component: CashierComponent, children: [
            { path: 'receipt', redirectTo: 'receipt', pathMatch: 'full' },
            { path: 'receipt', loadChildren: './receipt/receipt.module#ReceiptModule' },
            { path: 'order-refund', loadChildren: './order-refund/order-refund.module#OrderRefundModule' },
            { path: 'customer', loadChildren: './customer/cashier-customer.module#CashierCustomerModule' },

            // ordert module in here (TODO)
        ]
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);