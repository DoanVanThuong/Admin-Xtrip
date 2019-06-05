import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { CustomerServiceComponent } from './customer-service.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: CustomerServiceComponent,
        children: [
            {
                path: 'customer', redirectTo: 'customer', pathMatch: 'full'
            },
            {
                path: 'customer', loadChildren: './customer/customer.module#CSCustomerModule'
            },
            {
                path: 'search', loadChildren: './searching/searching.module#SearchingModule'
            },
        ]
    },

];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
